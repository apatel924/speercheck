"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { getEngineerInitials } from "@/lib/engineer-colors"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import type { Engineer, BookedSlot, Candidate } from "@/lib/types"

interface EnhancedEngineerBadgeProps {
  engineer: Engineer
  color: string
  status: "available" | "selected" | "booked"
  bookingDetails?: BookedSlot
  candidate?: Candidate
  onViewDetails?: () => void
  onCancelBooking?: () => void
  onReschedule?: () => void
}

export function EnhancedEngineerBadge({
  engineer,
  color,
  status,
  bookingDetails,
  candidate,
  onViewDetails,
  onCancelBooking,
  onReschedule,
}: EnhancedEngineerBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const initials = getEngineerInitials(engineer.name)

  const getTooltipContent = () => {
    if (status === "booked" && bookingDetails && candidate) {
      return `${engineer.name} ↔️ ${candidate.name} (confirmed)`
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
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <div className="font-medium">{getTooltipContent()}</div>
            {status === "available" && <div className="text-gray-300">{engineer.role}</div>}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}
