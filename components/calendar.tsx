"use client"

import { useMemo, useState } from "react"
import { getAvailableSlots, isSlotBooked, DAYS, TIME_SLOTS } from "@/lib/utils"
import { getEngineerColor } from "@/lib/utils"
import type { Candidate, Engineer, BookedSlot, TimeSlot } from "@/lib/utils"

interface CalendarProps {
  selectedCandidate: Candidate | null
  selectedEngineers: Engineer[]
  duration: 15 | 30 | 60
  bookedSlots: BookedSlot[]
  onSlotClick: (timeSlot: TimeSlot, engineer: Engineer) => void
}

// Engineer Badge Component
function EngineerBadge({ engineer, color }: { engineer: Engineer; color: string }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const initials = engineer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative">
      <div
        className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-white text-xs font-medium cursor-pointer transition-transform duration-150 hover:scale-110`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {initials}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <div className="font-medium">{engineer.name}</div>
            <div className="text-gray-300">{engineer.role}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Calendar Slot Component
function CalendarSlot({
  engineers,
  isBooked,
  selectedEngineers,
  onClick,
}: {
  engineers: Engineer[]
  isBooked: boolean
  selectedEngineers: Engineer[]
  onClick: () => void
}) {
  const hasAvailability = engineers.length > 0

  return (
    <div
      className={`p-2 border-r last:border-r-0 h-16 relative transition-all duration-150 ${
        isBooked
          ? "bg-red-50 cursor-not-allowed"
          : hasAvailability
            ? "cursor-pointer hover:bg-blue-50 hover:scale-105 hover:shadow-sm"
            : "bg-gray-50/30"
      }`}
      onClick={onClick}
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
          {engineers.map((engineer) => (
            <EngineerBadge
              key={engineer.id}
              engineer={engineer}
              color={getEngineerColor(engineer.id, selectedEngineers)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Empty State Component
function EmptyState({ type }: { type: "candidate" | "engineers" }) {
  const config = {
    candidate: {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      ),
      title: "Select a Candidate",
      description: "Choose a candidate to view their availability",
    },
    engineers: {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      title: "Select Engineers",
      description: "Choose one or more engineers to see overlapping availability",
    },
  }

  const { icon, title, description } = config[type]

  return (
    <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-sm border">
      <div className="text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  )
}

export function Calendar({ selectedCandidate, selectedEngineers, duration, bookedSlots, onSlotClick }: CalendarProps) {
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
    onSlotClick({ day, startTime: time }, engineers[0])
  }

  if (!selectedCandidate) {
    return <EmptyState type="candidate" />
  }

  if (selectedEngineers.length === 0) {
    return <EmptyState type="engineers" />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="grid grid-cols-6 border-b">
        <div className="p-4 bg-gray-50 border-r font-medium text-gray-700">Time</div>
        {DAYS.map((day) => (
          <div key={day} className="p-4 bg-gray-50 border-r last:border-r-0 font-medium text-gray-700 text-center">
            {day}
          </div>
        ))}
      </div>

      {TIME_SLOTS.map((time) => (
        <div key={time} className="grid grid-cols-6 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors">
          <div className="p-3 border-r bg-gray-50/50 text-sm font-medium text-gray-600 flex items-center">{time}</div>
          {DAYS.map((day) => {
            const { engineers, isBooked } = getSlotStatus(day, time)
            return (
              <CalendarSlot
                key={`${day}-${time}`}
                engineers={engineers}
                isBooked={isBooked}
                selectedEngineers={selectedEngineers}
                onClick={() => handleSlotClick(day, time)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
