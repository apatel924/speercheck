import type { Candidate, Engineer } from "./types"

export const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    color: "bg-blue-500",
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
    email: "bob.smith@email.com",
    color: "bg-blue-600",
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
    email: "carol.davis@email.com",
    color: "bg-blue-700",
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
    email: "david.wilson@company.com",
    role: "Senior Frontend Engineer",
    color: "bg-red-500",
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
    email: "emma.brown@company.com",
    role: "Backend Engineer",
    color: "bg-blue-500",
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
    email: "frank.miller@company.com",
    role: "Full Stack Engineer",
    color: "bg-green-500",
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
    email: "grace.lee@company.com",
    role: "DevOps Engineer",
    color: "bg-yellow-500",
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
