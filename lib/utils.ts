import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Types
export interface TimeSlot {
  day: string
  startTime: string
}

export interface AvailabilitySlot {
  start: string
  end: string
}

export interface Candidate {
  id: string
  name: string
  availability: {
    [day: string]: AvailabilitySlot[]
  }
}

export interface Engineer {
  id: string
  name: string
  role: string
  availability: {
    [day: string]: AvailabilitySlot[]
  }
}

export interface BookedSlot {
  id: string
  candidateId: string
  engineerId: string
  day: string
  startTime: string
  duration: number
  bookedAt: Date
}

// Constants
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]
export const ENGINEER_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
]

// Mock Data
export const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alice Johnson",
    availability: {
      Monday: [
        { start: "09:00", end: "11:00" },
        { start: "14:00", end: "16:00" },
      ],
      Tuesday: [
        { start: "10:00", end: "12:00" },
        { start: "15:00", end: "17:00" },
      ],
      Wednesday: [
        { start: "09:30", end: "11:30" },
        { start: "13:00", end: "15:00" },
      ],
      Thursday: [
        { start: "11:00", end: "13:00" },
        { start: "16:00", end: "18:00" },
      ],
      Friday: [
        { start: "09:00", end: "10:30" },
        { start: "14:30", end: "17:00" },
      ],
    },
  },
  {
    id: "2",
    name: "Bob Smith",
    availability: {
      Monday: [
        { start: "10:00", end: "12:00" },
        { start: "15:00", end: "17:00" },
      ],
      Tuesday: [
        { start: "09:00", end: "11:00" },
        { start: "14:00", end: "16:00" },
      ],
      Wednesday: [
        { start: "11:00", end: "13:00" },
        { start: "15:30", end: "17:30" },
      ],
      Thursday: [
        { start: "09:30", end: "11:30" },
        { start: "14:30", end: "16:30" },
      ],
      Friday: [
        { start: "10:30", end: "12:30" },
        { start: "15:00", end: "18:00" },
      ],
    },
  },
  {
    id: "3",
    name: "Carol Davis",
    availability: {
      Monday: [
        { start: "09:30", end: "11:30" },
        { start: "13:30", end: "15:30" },
      ],
      Tuesday: [
        { start: "11:00", end: "13:00" },
        { start: "16:00", end: "18:00" },
      ],
      Wednesday: [
        { start: "09:00", end: "10:30" },
        { start: "14:00", end: "16:00" },
      ],
      Thursday: [
        { start: "10:00", end: "12:00" },
        { start: "15:00", end: "17:00" },
      ],
      Friday: [
        { start: "09:00", end: "11:00" },
        { start: "13:00", end: "15:00" },
      ],
    },
  },
]

export const mockEngineers: Engineer[] = [
  {
    id: "e1",
    name: "David Wilson",
    role: "Senior Frontend Engineer",
    availability: {
      Monday: [
        { start: "09:00", end: "12:00" },
        { start: "14:00", end: "17:00" },
      ],
      Tuesday: [
        { start: "10:00", end: "13:00" },
        { start: "15:00", end: "18:00" },
      ],
      Wednesday: [
        { start: "09:00", end: "11:00" },
        { start: "13:00", end: "16:00" },
      ],
      Thursday: [
        { start: "11:00", end: "14:00" },
        { start: "16:00", end: "18:00" },
      ],
      Friday: [
        { start: "09:00", end: "12:00" },
        { start: "14:00", end: "17:00" },
      ],
    },
  },
  {
    id: "e2",
    name: "Emma Brown",
    role: "Backend Engineer",
    availability: {
      Monday: [
        { start: "10:00", end: "13:00" },
        { start: "15:00", end: "18:00" },
      ],
      Tuesday: [
        { start: "09:00", end: "12:00" },
        { start: "14:00", end: "17:00" },
      ],
      Wednesday: [
        { start: "10:30", end: "13:30" },
        { start: "15:30", end: "17:30" },
      ],
      Thursday: [
        { start: "09:30", end: "12:30" },
        { start: "14:30", end: "17:30" },
      ],
      Friday: [
        { start: "11:00", end: "14:00" },
        { start: "15:00", end: "18:00" },
      ],
    },
  },
  {
    id: "e3",
    name: "Frank Miller",
    role: "Full Stack Engineer",
    availability: {
      Monday: [
        { start: "09:30", end: "12:30" },
        { start: "13:30", end: "16:30" },
      ],
      Tuesday: [
        { start: "11:00", end: "14:00" },
        { start: "16:00", end: "18:00" },
      ],
      Wednesday: [
        { start: "09:00", end: "11:30" },
        { start: "14:00", end: "17:00" },
      ],
      Thursday: [
        { start: "10:00", end: "13:00" },
        { start: "15:00", end: "18:00" },
      ],
      Friday: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "16:00" },
      ],
    },
  },
  {
    id: "e4",
    name: "Grace Lee",
    role: "DevOps Engineer",
    availability: {
      Monday: [
        { start: "11:00", end: "14:00" },
        { start: "16:00", end: "18:00" },
      ],
      Tuesday: [
        { start: "09:30", end: "12:30" },
        { start: "15:30", end: "17:30" },
      ],
      Wednesday: [
        { start: "10:00", end: "13:00" },
        { start: "15:00", end: "18:00" },
      ],
      Thursday: [
        { start: "09:00", end: "11:00" },
        { start: "13:00", end: "16:00" },
      ],
      Friday: [
        { start: "10:30", end: "13:30" },
        { start: "14:30", end: "17:30" },
      ],
    },
  },
]

// Utility Functions
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

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

export function getAvailableSlots(candidate: Candidate, engineers: Engineer[]): Map<string, Engineer[]> {
  const availableSlots = new Map<string, Engineer[]>()

  for (const day of DAYS) {
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
        availableSlots.set(`${day}-${slot}`, availableEngineers)
      }
    }
  }

  return availableSlots
}

export function isSlotBooked(bookedSlots: BookedSlot[], day: string, startTime: string, duration: number): boolean {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = startMinutes + duration

  return bookedSlots.some((booking) => {
    if (booking.day !== day) return false

    const bookingStartMinutes = timeToMinutes(booking.startTime)
    const bookingEndMinutes = bookingStartMinutes + booking.duration

    return (
      (startMinutes >= bookingStartMinutes && startMinutes < bookingEndMinutes) ||
      (endMinutes > bookingStartMinutes && endMinutes <= bookingEndMinutes) ||
      (startMinutes <= bookingStartMinutes && endMinutes >= bookingEndMinutes)
    )
  })
}

export function formatAvailability(availability: Candidate["availability"]) {
  const summary = Object.entries(availability)
    .filter(([_, slots]) => slots.length > 0)
    .map(([day, slots]) => {
      const dayShort = day.slice(0, 3)
      const timeRanges = slots.map((slot) => `${slot.start}–${slot.end}`)
      return `${dayShort} ${timeRanges.join(", ")}`
    })
    .slice(0, 2)
    .join("; ")

  return summary || "No availability"
}

export function getEngineerColor(engineerId: string, engineers: Engineer[]) {
  const index = engineers.findIndex((e) => e.id === engineerId)
  return ENGINEER_COLORS[index % ENGINEER_COLORS.length]
}

export function formatTime(time: string) {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

export function getEndTime(startTime: string, duration: number) {
  const [hours, minutes] = startTime.split(":").map(Number)
  const totalMinutes = hours * 60 + minutes + duration
  const endHours = Math.floor(totalMinutes / 60)
  const endMins = totalMinutes % 60
  return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`
}
