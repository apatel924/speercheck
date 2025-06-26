"use client"

import { useMemo } from "react"
import { EngineerBadge } from "@/components/engineer-badge"
import { getAvailableSlots, isSlotBooked } from "@/lib/calendar-utils"
import { getEngineerColor } from "@/lib/engineer-colors"
import type { Candidate, Engineer, BookedSlot, TimeSlot } from "@/lib/types"

interface WeeklyCalendarProps {
  selectedCandidate: Candidate | null
  selectedEngineers: Engineer[]
  duration: 15 | 30 | 60
  bookedSlots: BookedSlot[]
  onSlotClick: (timeSlot: TimeSlot, engineer: Engineer) => void
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = [
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

export function WeeklyCalendar({
  selectedCandidate,
  selectedEngineers,
  duration,
  bookedSlots,
  onSlotClick,
}: WeeklyCalendarProps) {
  const availableSlots = useMemo(() => {
    if (!selectedCandidate || selectedEngineers.length === 0) {
      return new Map()
    }
    return getAvailableSlots(selectedCandidate, selectedEngineers)
  }, [selectedCandidate, selectedEngineers])

  const getSlotStatus = (day: string, time: string) => {
    const slotKey = `${day}-${time}`
    const engineers = availableSlots.get(slotKey) || []
    const isBooked = isSlotBooked(bookedSlots, day, time, duration)

    return { engineers, isBooked }
  }

  const handleSlotClick = (day: string, time: string) => {
    const { engineers, isBooked } = getSlotStatus(day, time)

    if (isBooked || engineers.length === 0) return

    // If only one engineer is available, auto-select them
    const engineer = engineers.length === 1 ? engineers[0] : engineers[0]

    onSlotClick({ day, startTime: time }, engineer)
  }

  if (!selectedCandidate) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Candidate</h3>
          <p className="text-gray-500">Choose a candidate to view their availability</p>
        </div>
      </div>
    )
  }

  if (selectedEngineers.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Select Engineers</h3>
          <p className="text-gray-500">Choose one or more engineers to see overlapping availability</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-6 bg-gray-50">
        <div className="p-3 border-r border-gray-200 font-medium text-gray-700 text-sm">Time</div>
        {days.map((day, index) => (
          <div
            key={day}
            className="p-3 border-r border-gray-200 last:border-r-0 font-medium text-gray-700 text-sm text-center"
          >
            <div>{day}</div>
            <div className="text-xs text-gray-500 mt-1">Jan {index + 1}</div>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {timeSlots.map((time, timeIndex) => (
        <div
          key={time}
          className={`grid grid-cols-6 border-b border-gray-200 last:border-b-0 ${timeIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
        >
          <div className="p-3 border-r border-gray-200 text-sm font-medium text-gray-600 flex items-center bg-gray-50">
            {time}
          </div>
          {days.map((day) => {
            const { engineers, isBooked } = getSlotStatus(day, time)
            const hasAvailability = engineers.length > 0

            return (
              <div
                key={`${day}-${time}`}
                className={`p-2 border-r border-gray-200 last:border-r-0 h-12 relative transition-all duration-150 ${
                  isBooked
                    ? "bg-red-50 cursor-not-allowed"
                    : hasAvailability
                      ? "cursor-pointer hover:bg-blue-50 hover:shadow-sm"
                      : ""
                }`}
                onClick={() => handleSlotClick(day, time)}
              >
                {isBooked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Booked
                    </div>
                  </div>
                )}

                {!isBooked && hasAvailability && (
                  <div className="flex flex-wrap gap-1">
                    {engineers.map((engineer: Engineer) => (
                      <EngineerBadge key={engineer.id} engineer={engineer} color={getEngineerColor(engineer.id)} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
