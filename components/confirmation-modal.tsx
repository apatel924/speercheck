"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, Users, Check, MapPin, Video, Phone } from "lucide-react"
import type { Candidate, Engineer, TimeSlot } from "@/lib/types"
import { formatTime, getEndTime } from "@/lib/utils"

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
  const [interviewType, setInterviewType] = useState<"video" | "phone" | "in-person">("video")

  const handleConfirm = async () => {
    setIsConfirming(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setShowSuccess(true)
    setTimeout(() => {
      onConfirm()
      setIsConfirming(false)
      setShowSuccess(false)
    }, 2000)
  }

  if (showSuccess) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50 duration-300">
              <Check className="w-10 h-10 text-green-600 animate-in zoom-in-50 duration-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Interview Scheduled!</h3>
            <p className="text-gray-600 text-center mb-4">
              The interview has been successfully booked and calendar invites will be sent shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 w-full">
              <div className="text-sm text-gray-600">
                <div className="font-medium">
                  {candidate.name} ↔️ {engineer.name}
                </div>
                <div>
                  {timeSlot.day}, {formatTime(timeSlot.startTime)} -{" "}
                  {formatTime(getEndTime(timeSlot.startTime, duration))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Confirm Interview Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Candidate</div>
                <div className="text-lg font-medium text-blue-700">{candidate.name}</div>
                <div className="text-sm text-gray-600 mt-1">Interview Candidate</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Interviewer</div>
                <div className="text-lg font-medium text-green-700">{engineer.name}</div>
                <div className="text-sm text-gray-600 mt-1">{engineer.role}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">Interview Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Date & Time</div>
                  <div className="text-gray-600">
                    {timeSlot.day}, {formatTime(timeSlot.startTime)} -{" "}
                    {formatTime(getEndTime(timeSlot.startTime, duration))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900">Duration</div>
                  <div className="text-gray-600">{duration} minutes</div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium text-gray-900 mb-3">Interview Format</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: "video" as const, icon: Video, label: "Video Call" },
                  { type: "phone" as const, icon: Phone, label: "Phone" },
                  { type: "in-person" as const, icon: MapPin, label: "In Person" },
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setInterviewType(type)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                      interviewType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-sm text-amber-800">
                <div className="font-medium mb-1">What happens next?</div>
                <ul className="space-y-1 text-amber-700">
                  <li>• Calendar invites will be sent to both participants</li>
                  <li>
                    •{" "}
                    {interviewType === "video"
                      ? "Video call link will be included"
                      : interviewType === "phone"
                        ? "Phone details will be shared"
                        : "Location details will be provided"}
                  </li>
                  <li>• Reminder notifications will be sent 24 hours and 1 hour before</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isConfirming}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isConfirming}>
            {isConfirming ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scheduling Interview...
              </div>
            ) : (
              "Confirm & Schedule Interview"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
