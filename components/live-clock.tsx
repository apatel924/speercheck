"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
        <Clock className="w-4 h-4 text-white" />
      </div>
      <div className="text-sm">
        <div className="font-semibold text-gray-900 dark:text-gray-100">{formatTime(time)}</div>
        <div className="text-gray-500 dark:text-gray-400 text-xs">{formatDate(time)}</div>
      </div>
    </div>
  )
}
