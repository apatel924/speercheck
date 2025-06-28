"use client"

import { useMemo } from "react"
import { EngineerBadge } from "./engineer-badge"
import { getAvailableSlots, getAllSlotBookings, getBookedEngineersInSlot } from "@/lib/calendar-utils"
import { getEngineerColor, formatTimeToAMPM } from "@/lib/utils"
import { mockEngineers } from "@/lib/mock-data"
import type { Candidate, Engineer, BookedSlot, TimeSlot, ViewSettings, DayOfWeek } from "@/lib/types"

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

const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
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
    if (!selectedEngineers.length) {
      return new Map()
    }
    if (!selectedCandidate) {
      // No candidate selected: show only engineers who are available at each slot
      const map = new Map()
      for (const day of days) {
        for (const time of timeSlots) {
          const available: Engineer[] = []
          for (const engineer of selectedEngineers) {
            // Use generateTimeSlots to get all available slots for this engineer on this day
            // Only add engineer if this slot is in their available slots
            const engineerSlots = require("@/lib/utils").generateTimeSlots(engineer.availability[day] || [])
            if (engineerSlots.includes(time)) {
              available.push(engineer)
            }
          }
          if (available.length) {
            map.set(`${day}-${time}`, available)
          }
        }
      }
      return map
    }
    return getAvailableSlots(selectedCandidate, selectedEngineers)
  }, [selectedCandidate, selectedEngineers])

  const getSlotData = (day: DayOfWeek, time: string) => {
    const slotKey = `${day}-${time}`
    const slotBookings = getAllSlotBookings(bookedSlots, day, time)

    if (viewSettings.showBookedOnly) {
      const bookedEngineersInSlot = getBookedEngineersInSlot(bookedSlots, mockEngineers, day, time)
      const engineerStates = bookedEngineersInSlot.map((engineer: Engineer) => {
        const booking = slotBookings.find((b: BookedSlot) => b.engineerId === engineer.id)
        return {
          engineer,
          status: "booked" as 'booked',
          bookingDetails: booking!,
        }
      })

      return { engineerStates, isFullyBooked: false }
    }

    const availableEngineers = availableSlots.get(slotKey) || []
    const engineerStates = availableEngineers.map((engineer: Engineer) => {
      const booking = slotBookings.find((b: BookedSlot) => b.engineerId === engineer.id)
      return {
        engineer,
        status: booking ? ("booked" as 'booked') : ("available" as 'available'),
        bookingDetails: booking,
      }
    })

    const isFullyBooked =
      availableEngineers.length > 0 &&
      availableEngineers.every((eng: Engineer) => slotBookings.some((b: BookedSlot) => b.engineerId === eng.id))

    return { engineerStates, isFullyBooked }
  }

  const handleSlotClick = (day: DayOfWeek, time: string) => {
    const { engineerStates } = getSlotData(day, time)
    const availableEngineer = engineerStates.find((s: { status: 'available' | 'booked', engineer: Engineer }) => s.status === "available")?.engineer

    if (availableEngineer) {
      onSlotClick({ day, startTime: time }, availableEngineer)
    }
  }

  return (
    <div
      className="border-2 border-blue-300 dark:border-blue-700 rounded-xl overflow-hidden bg-blue-50 dark:bg-blue-950"
      style={{
        boxShadow: '0 8px 32px 0 rgba(59,130,246,0.25), 0 2px 8px 0 rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e0ecff 100%)',
      }}
    >
      <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-700">
        <div className="p-3 border-r border-gray-200 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300 text-sm">
          Time
        </div>
        {days.map((day: DayOfWeek, index: number) => (
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
          {days.map((day: DayOfWeek) => {
            const { engineerStates } = getSlotData(day, time)
            const hasAvailableEngineers = engineerStates.some((s: { status: 'available' | 'booked' }) => s.status === "available")

            return (
              <div
                key={`${day}-${time}`}
                className={`p-2 border-r border-gray-200 dark:border-gray-600 last:border-r-0 h-12 relative ${
                  engineerStates.some((s: { status: 'available' | 'booked' }) => s.status === 'booked')
                    ? 'bg-gradient-to-br from-red-200 to-red-300 dark:from-red-900/40 dark:to-red-800/60'
                    : engineerStates.some((s: { status: 'available' | 'booked' }) => s.status === 'available')
                      ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-500/40 dark:to-blue-400/60'
                      : 'bg-white dark:bg-gray-800'
                }`}
                onClick={() => handleSlotClick(day, time)}
              >
                <div className="flex flex-wrap gap-1 items-start justify-start">
                  {engineerStates.map(({ engineer, status, bookingDetails }: { engineer: Engineer, status: 'available' | 'booked', bookingDetails: BookedSlot }) => (
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
