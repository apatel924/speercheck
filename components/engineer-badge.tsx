"use client"

import { useState } from "react"
import { getEngineerInitials } from "@/lib/engineer-colors"
import type { Engineer } from "@/lib/types"

interface EngineerBadgeProps {
  engineer: Engineer
  color: string
}

export function EngineerBadge({ engineer, color }: EngineerBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const initials = getEngineerInitials(engineer.name)

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
