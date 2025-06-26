"use client"

import { useMemo, useState } from "react"
import { EngineerBadge } from "@/components/engineer-badge"
import { getAvailableSlots, getAllSlotBookings, getBookedEngineersInSlot } from "@/lib/calendar-utils"
import { getEngineerColor } from "@/lib/engineer-colors"
import type { Candidate, Engineer, BookedSlot, TimeSlot, ViewSettings } from "@/lib/types"
import { mockEngineers, mockCandidates } from "@/lib/mock-data"

interface EnhancedWeeklyCalendarProps {
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

export function EnhancedWeeklyCalendar({
  selectedCandidate,
  selectedEngineers,
  duration,
  bookedSlots,
  viewSettings,
  onSlotClick,
  onViewBookingDetails,
  onCancelBooking,
  onRescheduleBooking,
}: EnhancedWeeklyCalendarProps) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)

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
      const engineerStates = bookedEngineersInSlot.map((engineer) => {
        const booking = slotBookings.find((b) => b.engineerId === engineer.id)
        return {
          engineer,
          status: "booked" as const,
          bookingDetails: booking!,
        }
      })

      return {
        engineerStates,
        slotBookings,
        isFullyBooked: engineerStates.length > 0,
      }
    }

    // Normal mode: show only selected engineers and their availability
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

    return { engineerStates, slotBookings, isFullyBooked }
  }

  const getCellBackgroundClass = (day: string, time: string) => {
    const { engineerStates, isFullyBooked } = getSlotData(day, time)
    const slotKey = `${day}-${time}`

    if (isFullyBooked) return "bg-red-50"
    if (hoveredSlot === slotKey && engineerStates.some((s) => s.status === "available")) return "bg-blue-50"
    return "bg-white"
  }

  const getSlotTooltipContent = (day: string, time: string) => {
    const { slotBookings } = getSlotData(day, time)

    if (slotBookings.length === 0) return null

    const formatInterviewType = (type?: string) => {
      switch (type) {
        case "video":
          return "📹 Video Call"
        case "phone":
          return "📞 Phone"
        case "in-person":
          return "🏢 In Person"
        default:
          return "📹 Video Call"
      }
    }

    return (
      <div className="space-y-2">
        <div className="font-medium text-center border-b border-gray-600 pb-1">
          {time}–{getEndTime(time, duration)}
        </div>
        {slotBookings.map((booking) => {
          const candidate = mockCandidates.find((c) => c.id === booking.candidateId)
          const engineer = mockEngineers.find((e) => e.id === booking.engineerId)
          return (
            <div key={booking.id} className="text-xs space-y-1">
              <div className="font-medium">
                {candidate?.name} ↔️ {engineer?.name}
              </div>
              <div className="text-gray-300 space-y-0.5">
                <div>⏱️ {booking.duration} minutes</div>
                <div>{formatInterviewType(booking.interviewType)}</div>
                <div className="text-green-300">✅ Confirmed</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMins = totalMinutes % 60
    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`
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
        <div key={time} className={`grid grid-cols-6 border-b border-gray-200 last:border-b-0`}>
          <div className="p-3 border-r border-gray-200 text-sm font-medium text-gray-600 flex items-center bg-gray-50">
            {time}
          </div>
          {days.map((day) => {
            const { engineerStates, slotBookings } = getSlotData(day, time)
            const slotKey = `${day}-${time}`
            const hasAvailableEngineers = engineerStates.some((s) => s.status === "available")

            return (
              <div
                key={slotKey}
                className={`p-2 border-r border-gray-200 last:border-r-0 h-12 relative transition-all duration-150 ${getCellBackgroundClass(day, time)} ${
                  hasAvailableEngineers ? "cursor-pointer hover:shadow-sm" : ""
                }`}
                onClick={() => handleSlotClick(day, time)}
                onMouseEnter={() => setHoveredSlot(slotKey)}
                onMouseLeave={() => setHoveredSlot(null)}
                title={slotBookings.length > 0 ? "View bookings" : undefined}
              >
                {/* Show "Booked" indicator if fully booked */}
                {engineerStates.length > 0 && engineerStates.every((s) => s.status === "booked") && (
                  <div className="absolute top-1 right-1">
                    <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded text-[10px]">Booked</div>
                  </div>
                )}

                {/* Engineer badges */}
                <div className="flex flex-wrap gap-1">
                  {engineerStates.map(({ engineer, status, bookingDetails }) => (
                    <EnhancedEngineerBadge
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
                  ))}
                </div>

                {/* Enhanced slot tooltip for bookings */}
                {hoveredSlot === slotKey && slotBookings.length > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-4 py-3 shadow-lg min-w-48">
                      {getSlotTooltipContent(day, time)}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
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
