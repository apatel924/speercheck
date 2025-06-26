"use client"

import { Button } from "@/components/ui/button"

interface DurationSelectorProps {
  duration: 30 | 60
  onDurationChange: (duration: 30 | 60) => void
}

export function DurationSelector({ duration, onDurationChange }: DurationSelectorProps) {
  const durations: Array<{ value: 30 | 60; label: string }> = [
    { value: 30, label: "30 min" },
    { value: 60, label: "60 min" },
  ]

  return (
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1">
      {durations.map((d) => (
        <Button
          key={d.value}
          variant={duration === d.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onDurationChange(d.value)}
          className={`flex-1 rounded-full text-sm transition-all duration-200 ${
            duration === d.value
              ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 bg-transparent"
          }`}
        >
          {d.label}
        </Button>
      ))}
    </div>
  )
}
