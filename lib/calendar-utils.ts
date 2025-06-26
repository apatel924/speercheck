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

// Check if a slot is already booked
export function isSlotBooked(bookedSlots: BookedSlot[], day: string, startTime: string, duration: number): boolean {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = startMinutes + duration

  return bookedSlots.some((booking) => {
    if (booking.day !== day) return false

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

// Validate if a booking can be made for the given duration
export function canBookSlot(
  candidate: Candidate,
  engineer: Engineer,
  day: string,
  startTime: string,
  duration: number,
  bookedSlots: BookedSlot[],
): boolean {
  // Check if slot is already booked
  if (isSlotBooked(bookedSlots, day, startTime, duration)) {
    return false
  }

  const startMinutes = timeToMinutes(startTime)
  const endMinutes = startMinutes + duration

  // Check candidate availability
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
