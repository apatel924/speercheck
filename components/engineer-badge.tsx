"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { getEngineerInitials, getEndTime } from "@/lib/utils"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { mockCandidates } from "@/lib/mock-data"
import type { Engineer, BookedSlot } from "@/lib/types"

interface EngineerBadgeProps {
  engineer: Engineer
  color: string
  status: "available" | "selected" | "booked"
  bookingDetails?: BookedSlot
  onViewDetails?: () => void
  onCancelBooking?: () => void
  onReschedule?: () => void
}

export function EngineerBadge({
  engineer,
  color,
  status,
  bookingDetails,
  onViewDetails,
  onCancelBooking,
  onReschedule,
}: EngineerBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const initials = getEngineerInitials(engineer.name)

  const getTooltipContent = () => {
    if (status === "booked" && bookingDetails) {
      const bookedCandidate = mockCandidates.find((c) => c.id === bookingDetails.candidateId)

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
            {bookingDetails.startTime}–{getEndTime(bookingDetails.startTime, bookingDetails.duration)}
          </div>
          <div className="text-xs space-y-1">
            <div className="font-medium">
              {bookedCandidate?.name} ↔️ {engineer.name}
            </div>
            <div className="text-gray-300 space-y-0.5">
              <div>⏱️ {bookingDetails.duration} minutes</div>
              <div>{formatInterviewType(bookingDetails.interviewType)}</div>
              <div className="text-green-300">✅ Confirmed</div>
            </div>
          </div>
        </div>
      )
    }
    return `${engineer.name} available`
  }

  const getBadgeClasses = () => {
    const baseClasses = `relative flex items-center justify-center text-white text-xs font-medium cursor-pointer transition-all duration-200 w-7 h-7 rounded-full`

    switch (status) {
      case "selected":
        return `${baseClasses} ${color} ring-2 ring-blue-400 ring-offset-1 animate-pulse`
      case "booked":
        return `${baseClasses} ${color} opacity-70`
      default:
        return `${baseClasses} ${color} hover:scale-110`
    }
  }

  return (
    <div className="relative">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={getBadgeClasses()}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {initials}
            {status === "booked" && <Lock className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full p-0.5" />}
          </div>
        </ContextMenuTrigger>

        {status === "booked" && (
          <ContextMenuContent>
            <ContextMenuItem onClick={onViewDetails}>View booking details</ContextMenuItem>
            <ContextMenuItem onClick={onCancelBooking} className="text-red-600">
              Cancel booking
            </ContextMenuItem>
            <ContextMenuItem onClick={onReschedule}>Reschedule</ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-4 py-3 shadow-lg min-w-48">
            {status === "booked" ? (
              getTooltipContent()
            ) : (
              <div>
                <div className="font-medium">{getTooltipContent()}</div>
                <div className="text-gray-300">{engineer.role}</div>
              </div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}
