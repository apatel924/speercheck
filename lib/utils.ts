import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Centralized color mapping for engineers
const engineerColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
]

const colorMap = new Map<string, string>()

export function getEngineerColor(engineerId: string): string {
  if (!colorMap.has(engineerId)) {
    const index = colorMap.size % engineerColors.length
    colorMap.set(engineerId, engineerColors[index])
  }
  return colorMap.get(engineerId)!
}

export function getEngineerInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Time utilities
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

export function formatTimeToAMPM(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

// Generate 30-minute time slots from availability ranges
export function generateTimeSlots(availability: { start: string; end: string }[]): string[] {
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
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Email generation utilities
export function generateEmail(name: string, domain = "email.com"): string {
  const firstName = name.split(" ")[0].toLowerCase()
  const lastName = name.split(" ")[1]?.toLowerCase() || ""
  return `${firstName}.${lastName}@${domain}`
}

// Candidate color utilities
export function getCandidateColor(index: number): string {
  const blueColors = ["bg-blue-500", "bg-blue-600", "bg-blue-700", "bg-indigo-500", "bg-indigo-600", "bg-sky-500"]
  return blueColors[index % blueColors.length]
}

// Time calculation utilities
export function getEndTime(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(":").map(Number)
  const totalMinutes = hours * 60 + minutes + duration
  const endHours = Math.floor(totalMinutes / 60)
  const endMins = totalMinutes % 60
  return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}
