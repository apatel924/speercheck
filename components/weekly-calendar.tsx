"use client"

import { useMemo } from "react"
import { EngineerBadge } from "./engineer-badge"
import { getAvailableSlots, getAllSlotBookings, getBookedEngineersInSlot } from "@/lib/calendar-utils"
import { getEngineerColor, formatTimeToAMPM } from "@/lib/utils"
import { mockEngineers } from "@/lib/mock-data"
import type { Candidate, Engineer, BookedSlot, TimeSlot, ViewSettings } from "@/lib/types"

interface WeeklyCalendarProps {
  selectedCandidate: Candidate | null
  selectedEngineers: Engineer[]
  duration: 30 | 60
  bookedSlots: BookedSlot[]
  viewSettings: ViewSettings
  onSlotClick: (timeSlot: TimeSlot, engineer: Engineer) => void
  onViewBookingDetails: (booking: BookedSlot) => void
  onCancelBooking: (bookingId: string) => void
  onRescheduleBooking: (bookingId: string) => void
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
  viewSettings,
  onSlotClick,
  onViewBookingDetails,
  onCancelBooking,
  onRescheduleBooking,
}: WeeklyCalendarProps) {
  const availableSlots = useMemo(() => {
    if (!selectedCandidate || selectedEngineers.length === 0) {
      return new Map()
    }
    return getAvailableSlots(selectedCandidate, selectedEngineers)
  }, [selectedCandidate, selectedEngineers])

  const getSlotData = (day: string, time: string) => {
    const slotKey = `${day}-${time}`
    const slotBookings = getAllSlotBookings(bookedSlots, day, time)

    if (viewSettings.showBookedOnly) {
      const bookedEngineersInSlot = getBookedEngineersInSlot(bookedSlots, mockEngineers, day, time)
      const engineerStates = bookedEngineersInSlot.map((engineer) => {
        const booking = slotBookings.find((b) => b.engineerId === engineer.id)
        return {
          engineer,
          status: "booked" as const,
          bookingDetails: booking!,
        }
      })

      return { engineerStates, isFullyBooked: false }
    }

    const availableEngineers = availableSlots.get(slotKey) || []
    const engineerStates = availableEngineers.map((engineer) => {
      const booking = slotBookings.find((b) => b.engineerId === engineer.id)
      return {
        engineer,
        status: booking ? ("booked" as const) : ("available" as const),
        bookingDetails: booking,
      }
    })

    const isFullyBooked =
      availableEngineers.length > 0 &&
      availableEngineers.every((eng) => slotBookings.some((b) => b.engineerId === eng.id))

    return { engineerStates, isFullyBooked }
  }

  const handleSlotClick = (day: string, time: string) => {
    const { engineerStates } = getSlotData(day, time)
    const availableEngineer = engineerStates.find((s) => s.status === "available")?.engineer

    if (availableEngineer) {
      onSlotClick({ day, startTime: time }, availableEngineer)
    }
  }

  if (!selectedCandidate) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Select a Candidate</h3>
          <p className="text-gray-500 dark:text-gray-400">Choose a candidate to view their availability</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-700">
        <div className="p-3 border-r border-gray-200 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300 text-sm">
          Time
        </div>
        {days.map((day, index) => (
          <div
            key={day}
            className="p-3 border-r border-gray-200 dark:border-gray-600 last:border-r-0 font-medium text-gray-700 dark:text-gray-300 text-sm text-center"
          >
            <div>{day}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jan {index + 1}</div>
          </div>
        ))}
      </div>

      {timeSlots.map((time) => (
        <div key={time} className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
          <div className="p-3 border-r border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center bg-gray-50 dark:bg-gray-700">
            {formatTimeToAMPM(time)}
          </div>
          {days.map((day) => {
            const { engineerStates, isFullyBooked } = getSlotData(day, time)
            const hasAvailableEngineers = engineerStates.some((s) => s.status === "available")

            return (
              <div
                key={`${day}-${time}`}
                className={`p-2 border-r border-gray-200 dark:border-gray-600 last:border-r-0 h-12 relative transition-all duration-150 ${
                  isFullyBooked
                    ? "bg-red-50 dark:bg-red-900/20"
                    : hasAvailableEngineers
                      ? "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer hover:shadow-sm"
                      : "bg-white dark:bg-gray-800"
                }`}
                onClick={() => handleSlotClick(day, time)}
              >
                {isFullyBooked && (
                  <div className="absolute top-1 right-1">
                    <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded text-[10px]">Booked</div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 items-start justify-start">
                  {engineerStates.map(({ engineer, status, bookingDetails }) => (
                    <EngineerBadge
                      key={engineer.id}
                      engineer={engineer}
                      color={getEngineerColor(engineer.id)}
                      status={status}
                      bookingDetails={bookingDetails}
                      onViewDetails={() => bookingDetails && onViewBookingDetails(bookingDetails)}
                      onCancelBooking={() => bookingDetails && onCancelBooking(bookingDetails.id)}
                      onReschedule={() => bookingDetails && onRescheduleBooking(bookingDetails.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
