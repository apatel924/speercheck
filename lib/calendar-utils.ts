import type { Candidate, Engineer, BookedSlot } from "./types"
import { timeToMinutes, minutesToTime, generateTimeSlots } from "./utils"

export function getAvailableSlots(candidate: Candidate, engineers: Engineer[]) {
  const availableSlots = new Map<string, Engineer[]>()
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  for (const day of days) {
    const candidateSlots = generateTimeSlots(candidate.availability[day] || [])

    for (const slot of candidateSlots) {
      const freeEngineers: Engineer[] = []

      for (const engineer of engineers) {
        const engineerSlots = generateTimeSlots(engineer.availability[day] || [])
        if (engineerSlots.includes(slot)) freeEngineers.push(engineer)
      }

      if (freeEngineers.length) {
        availableSlots.set(`${day}-${slot}`, freeEngineers)
      }
    }
  }

  return availableSlots
}


//Booking-related utils                          
export function getAllSlotBookings(bookings: BookedSlot[], day: string, startTime: string) {
  return bookings.filter((b) => b.day === day && b.startTime === startTime && b.status === "confirmed")
}

export function getBookedEngineersInSlot(
  bookings: BookedSlot[],
  engineers: Engineer[],
  day: string,
  startTime: string,
) {
  return getAllSlotBookings(bookings, day, startTime)
    .map((b) => engineers.find((e) => e.id === b.engineerId))
    .filter(Boolean) as Engineer[]
}

//conflict-detection 

export function isEngineerBookedInRange(
  bookings: BookedSlot[],
  engineerId: string,
  day: string,
  startTime: string,
  duration: number,
) {
  const start = timeToMinutes(startTime)
  const end = start + duration

  return bookings.some((b) => {
    if (b.engineerId !== engineerId || b.day !== day || b.status !== "confirmed") return false

    const bookingStart = timeToMinutes(b.startTime)
    const bookingEnd = bookingStart + b.duration

    return (
      (start >= bookingStart && start < bookingEnd) ||
      (end > bookingStart && end <= bookingEnd) ||
      (start <= bookingStart && end >= bookingEnd)
    )
  })
}

export function isCandidateBooked(
  bookings: BookedSlot[],
  candidateId: string,
  day: string,
  startTime: string,
  duration: number,
) {
  const start = timeToMinutes(startTime)
  const end = start + duration

  return bookings.some((b) => {
    if (b.candidateId !== candidateId || b.day !== day || b.status !== "confirmed") return false

    const bookingStart = timeToMinutes(b.startTime)
    const bookingEnd = bookingStart + b.duration

    return (
      (start >= bookingStart && start < bookingEnd) ||
      (end > bookingStart && end <= bookingEnd) ||
      (start <= bookingStart && end >= bookingEnd)
    )
  })
}

//slot checker

export function canBookSlot(
  candidate: Candidate,
  engineer: Engineer,
  day: string,
  startTime: string,
  duration: number,
  bookings: BookedSlot[],
) {
  /* existing bookings conflict? */
  if (
    isEngineerBookedInRange(bookings, engineer.id, day, startTime, duration) ||
    isCandidateBooked(bookings, candidate.id, day, startTime, duration)
  )
    return false

  /* both parties actually free? */
  const start = timeToMinutes(startTime)
  const end = start + duration

  const candidateSlots = generateTimeSlots(candidate.availability[day] || [])
  const engineerSlots = generateTimeSlots(engineer.availability[day] || [])

  for (let t = start; t < end; t += 30) {
    const slot = minutesToTime(t)
    if (!candidateSlots.includes(slot) || !engineerSlots.includes(slot)) return false
  }

  return true
}
