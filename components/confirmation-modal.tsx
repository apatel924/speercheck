"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, Users, Check } from "lucide-react"
import type { Candidate, Engineer, TimeSlot } from "@/lib/types"

interface ConfirmationModalProps {
  candidate: Candidate
  engineer: Engineer
  timeSlot: TimeSlot
  duration: number
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  candidate,
  engineer,
  timeSlot,
  duration,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMins = totalMinutes % 60
    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`
  }

  const handleConfirm = async () => {
    setIsConfirming(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    setShowSuccess(true)

    // Show success animation for 1.5 seconds
    setTimeout(() => {
      onConfirm()
      setIsConfirming(false)
      setShowSuccess(false)
    }, 1500)
  }

  if (showSuccess) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300">
              <Check className="w-8 h-8 text-green-600 animate-in zoom-in-50 duration-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Scheduled!</h3>
            <p className="text-gray-600 text-center">The interview has been successfully booked.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-lg animate-in slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Confirm Interview</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Candidate</div>
                <div className="text-gray-600">{candidate.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Interviewer</div>
                <div className="text-gray-600">{engineer.name}</div>
                <div className="text-sm text-gray-500">{engineer.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">Date & Time</div>
                <div className="text-gray-600">
                  {timeSlot.day}, {formatTime(timeSlot.startTime)} -{" "}
                  {formatTime(getEndTime(timeSlot.startTime, duration))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-gray-900">Duration</div>
                <div className="text-gray-600">{duration} minutes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isConfirming}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isConfirming}>
            {isConfirming ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming...
              </div>
            ) : (
              "Confirm Interview"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
