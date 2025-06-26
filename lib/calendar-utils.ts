import type { Candidate, Engineer, BookedSlot, AvailabilitySlot } from "./types"

// Convert time string to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Convert minutes since midnight to time string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

// Generate 30-minute time slots from availability ranges
function generateTimeSlots(availability: AvailabilitySlot[]): string[] {
  const slots: string[] = []

  for (const range of availability) {
    const startMinutes = timeToMinutes(range.start)
    const endMinutes = timeToMinutes(range.end)

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      slots.push(minutesToTime(minutes))
    }
  }

  return slots
}

// Find overlapping availability between candidate and engineers
export function getAvailableSlots(candidate: Candidate, engineers: Engineer[]): Map<string, Engineer[]> {
  const availableSlots = new Map<string, Engineer[]>()

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  for (const day of days) {
    const candidateSlots = generateTimeSlots(candidate.availability[day] || [])

    for (const slot of candidateSlots) {
      const availableEngineers: Engineer[] = []

      for (const engineer of engineers) {
        const engineerSlots = generateTimeSlots(engineer.availability[day] || [])
        if (engineerSlots.includes(slot)) {
          availableEngineers.push(engineer)
        }
      }

      if (availableEngineers.length > 0) {
        const slotKey = `${day}-${slot}`
        availableSlots.set(slotKey, availableEngineers)
      }
    }
  }

  return availableSlots
}

// Get all bookings for a specific slot
export function getSlotBookings(bookedSlots: BookedSlot[], day: string, startTime: string): BookedSlot[] {
  return bookedSlots.filter(
    (booking) => booking.day === day && booking.startTime === startTime && booking.status === "confirmed",
  )
}

// Get all bookings for a specific slot regardless of selected engineers
export function getAllSlotBookings(bookedSlots: BookedSlot[], day: string, startTime: string): BookedSlot[] {
  return bookedSlots.filter(
    (booking) => booking.day === day && booking.startTime === startTime && booking.status === "confirmed",
  )
}

// Get all engineers who have bookings in any slot (for show booked only mode)
export function getBookedEngineersInSlot(
  bookedSlots: BookedSlot[],
  allEngineers: Engineer[],
  day: string,
  startTime: string,
): Engineer[] {
  const slotBookings = getAllSlotBookings(bookedSlots, day, startTime)
  return slotBookings
    .map((booking) => allEngineers.find((engineer) => engineer.id === booking.engineerId))
    .filter(Boolean) as Engineer[]
}

// Check if a specific engineer is booked in a slot
export function isEngineerBookedInRange(
  bookedSlots: BookedSlot[],
  engineerId: string,
  day: string,
  startTime: string,
  duration: number,
): boolean {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = startMinutes + duration

  return bookedSlots.some((booking) => {
    if (booking.engineerId !== engineerId || booking.day !== day || booking.status !== "confirmed") {
      return false
    }

    const bookingStartMinutes = timeToMinutes(booking.startTime)
    const bookingEndMinutes = bookingStartMinutes + booking.duration

    // Check for any overlap
    return (
      (startMinutes >= bookingStartMinutes && startMinutes < bookingEndMinutes) ||
      (endMinutes > bookingStartMinutes && endMinutes <= bookingEndMinutes) ||
      (startMinutes <= bookingStartMinutes && endMinutes >= bookingEndMinutes)
    )
  })
}

// Check if a candidate is already booked in overlapping time slots
export function isCandidateBooked(
  bookedSlots: BookedSlot[],
  candidateId: string,
  day: string,
  startTime: string,
  duration: number,
): boolean {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = startMinutes + duration

  return bookedSlots.some((booking) => {
    if (booking.candidateId !== candidateId || booking.day !== day || booking.status !== "confirmed") {
      return false
    }

    const bookingStartMinutes = timeToMinutes(booking.startTime)
    const bookingEndMinutes = bookingStartMinutes + booking.duration

    // Check for any overlap
    return (
      (startMinutes >= bookingStartMinutes && startMinutes < bookingEndMinutes) ||
      (endMinutes > bookingStartMinutes && endMinutes <= bookingEndMinutes) ||
      (startMinutes <= bookingStartMinutes && endMinutes >= bookingEndMinutes)
    )
  })
}

// Check if a slot can be booked for a specific engineer-candidate pair
export function canBookSlot(
  candidate: Candidate,
  engineer: Engineer,
  day: string,
  startTime: string,
  duration: number,
  bookedSlots: BookedSlot[],
): boolean {
  // Check if this specific engineer is already booked in the time range
  if (isEngineerBookedInRange(bookedSlots, engineer.id, day, startTime, duration)) {
    return false
  }

  // Check if the candidate is already booked in overlapping time slots
  if (isCandidateBooked(bookedSlots, candidate.id, day, startTime, duration)) {
    return false
  }

  const startMinutes = timeToMinutes(startTime)
  const endMinutes = startMinutes + duration

  // Check candidate and engineer availability for the full duration
  const candidateSlots = generateTimeSlots(candidate.availability[day] || [])
  const engineerSlots = generateTimeSlots(engineer.availability[day] || [])

  // Check if all required 30-minute slots are available
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    const timeSlot = minutesToTime(minutes)
    if (!candidateSlots.includes(timeSlot) || !engineerSlots.includes(timeSlot)) {
      return false
    }
  }

  return true
}
