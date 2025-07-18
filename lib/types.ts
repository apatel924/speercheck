export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"

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
  email: string
  color: string
  availability: Record<DayOfWeek, AvailabilitySlot[]>
}

export interface Engineer {
  id: string
  name: string
  email: string
  role: string
  color: string
  availability: Record<DayOfWeek, AvailabilitySlot[]>
}

export interface BookedSlot {
  id: string
  candidateId: string
  engineerId: string
  day: string
  startTime: string
  duration: number
  bookedAt: Date
  status: "confirmed" | "pending" | "cancelled"
  interviewType?: "video" | "phone" | "in-person"
}

export interface ViewSettings {
  showBookedOnly: boolean
}
