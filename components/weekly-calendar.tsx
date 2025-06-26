"use client"

import { useMemo } from "react"
import { EngineerBadge } from "@/components/engineer-badge"
import { getAvailableSlots, getAllSlotBookings, getBookedEngineersInSlot } from "@/lib/calendar-utils"
import { getEngineerColor } from "@/lib/engineer-colors"
import type { Candidate, Engineer, BookedSlot, TimeSlot, ViewSettings } from "@/lib/types"
import { mockEngineers } from "@/lib/mock-data"

interface WeeklyCalendarProps {
  selectedCandidate: Candidate | null
  selectedEngineers: Engineer[]
  duration: 15 | 30 | 60
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

// Convert 24-hour time to 12-hour AM/PM format
const formatTimeToAMPM = (time: string) => {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

// Type for engineer state in a slot
type EngineerState = {
  engineer: Engineer
  status: "booked" | "available"
  bookingDetails?: BookedSlot
}

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
      // Show ALL booked engineers in this slot, regardless of selection
      const bookedEngineersInSlot = getBookedEngineersInSlot(bookedSlots, mockEngineers, day, time)
      const engineerStates: EngineerState[] = bookedEngineersInSlot.map((engineer: Engineer) => {
        const booking = slotBookings.find((b) => b.engineerId === engineer.id)
        return {
          engineer,
          status: "booked",
          bookingDetails: booking!,
        }
      })

      return {
        engineerStates,
        slotBookings,
        isFullyBooked: false, // Never fully booked in show-all mode
      }
    }

    // Normal mode: show only selected engineers and their availability
    const availableEngineers: Engineer[] = availableSlots.get(slotKey) || []
    const engineerStates: EngineerState[] = availableEngineers.map((engineer: Engineer) => {
      const booking = slotBookings.find((b) => b.engineerId === engineer.id)
      return {
        engineer,
        status: booking ? "booked" : "available",
        bookingDetails: booking,
      }
    })

    // Only consider it fully booked if ALL selected engineers are booked
    const isFullyBooked =
      availableEngineers.length > 0 &&
      availableEngineers.every((eng: Engineer) => slotBookings.some((b) => b.engineerId === eng.id))

    return { engineerStates, slotBookings, isFullyBooked }
  }

  const getCellBackgroundClass = (day: string, time: string) => {
    const { engineerStates, isFullyBooked } = getSlotData(day, time)

    if (isFullyBooked) return "bg-red-50 dark:bg-red-900/20"
    if (engineerStates.some((s: EngineerState) => s.status === "available")) return "hover:bg-blue-50 dark:hover:bg-blue-900/20"
    return "bg-white dark:bg-gray-800"
  }

  const handleSlotClick = (day: string, time: string) => {
    const { engineerStates } = getSlotData(day, time)
    const availableEngineer = engineerStates.find((s: EngineerState) => s.status === "available")?.engineer

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
      {/* Header */}
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

      {/* Time Slots */}
      {timeSlots.map((time, timeIndex) => (
        <div key={time} className={`grid grid-cols-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0`}>
          <div className="p-3 border-r border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center bg-gray-50 dark:bg-gray-700">
            {formatTimeToAMPM(time)}
          </div>
          {days.map((day) => {
            const { engineerStates, slotBookings } = getSlotData(day, time)
            const slotKey = `${day}-${time}`
            const hasAvailableEngineers = engineerStates.some((s: EngineerState) => s.status === "available")

            return (
              <div
                key={slotKey}
                className={`p-2 border-r border-gray-200 dark:border-gray-600 last:border-r-0 h-12 relative transition-all duration-150 ${getCellBackgroundClass(day, time)} ${
                  hasAvailableEngineers ? "cursor-pointer hover:shadow-sm" : ""
                }`}
                onClick={() => handleSlotClick(day, time)}
              >
                {/* Show "Booked" indicator if fully booked */}
                {engineerStates.length > 0 && engineerStates.every((s: EngineerState) => s.status === "booked") && (
                  <div className="absolute top-1 right-1">
                    <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded text-[10px]">Booked</div>
                  </div>
                )}

                {/* Engineer badges */}
                <div className="flex flex-wrap gap-1 items-start justify-start">
                  {engineerStates.map(
                    ({ engineer, status, bookingDetails }: { engineer: Engineer; status: "booked" | "available"; bookingDetails?: BookedSlot }) => (
                      <EngineerBadge
                        key={engineer.id}
                        engineer={engineer}
                        color={getEngineerColor(engineer.id)}
                        status={status}
                        bookingDetails={bookingDetails}
                        candidate={selectedCandidate}
                        onViewDetails={() => bookingDetails && onViewBookingDetails(bookingDetails)}
                        onCancelBooking={() => bookingDetails && onCancelBooking(bookingDetails.id)}
                        onReschedule={() => bookingDetails && onRescheduleBooking(bookingDetails.id)}
                      />
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
