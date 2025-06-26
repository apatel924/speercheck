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
  status: "confirmed" | "pending" | "cancelled"
  interviewType?: "video" | "phone" | "in-person"
}

export interface ViewSettings {
  showBookedOnly: boolean
}

export interface BadgeState {
  engineer: Engineer
  status: "available" | "selected" | "booked"
  bookingDetails?: BookedSlot
}
