"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Calendar, Clock, User, Users } from "lucide-react"
import type { Candidate, Engineer, TimeSlot } from "@/lib/types"
import { formatTime, getEndTime } from "@/lib/utils"

interface SlotValidationModalProps {
  candidate: Candidate
  engineer: Engineer
  requestedSlot: TimeSlot
  suggestedSlot: TimeSlot
  duration: number
  onAccept: () => void
  onCancel: () => void
}

export function SlotValidationModal({
  candidate,
  engineer,
  requestedSlot,
  suggestedSlot,
  duration,
  onAccept,
  onCancel,
}: SlotValidationModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle className="text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            Time Slot Conflict
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
            <p className="text-amber-800 text-xs">
              The requested {duration}-minute time slot is not fully available. We found an alternative time that works
              for both participants.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <User className="w-3 h-3 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Candidate</div>
                <div className="text-gray-600 text-xs">{candidate.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Users className="w-3 h-3 text-green-600" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Interviewer</div>
                <div className="text-gray-600 text-xs">{engineer.name}</div>
                <div className="text-xs text-gray-500">{engineer.role}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <Calendar className="w-3 h-3 text-red-600" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">Requested Time (Not Available)</div>
                  <div className="text-gray-600 text-xs">
                    {requestedSlot.day}, {formatTime(requestedSlot.startTime)} -{" "}
                    {formatTime(getEndTime(requestedSlot.startTime, duration))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <Calendar className="w-3 h-3 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">Suggested Alternative</div>
                  <div className="text-gray-600 text-xs">
                    {suggestedSlot.day}, {formatTime(suggestedSlot.startTime)} -{" "}
                    {formatTime(getEndTime(suggestedSlot.startTime, duration))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Clock className="w-3 h-3 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Duration</div>
                <div className="text-gray-600 text-xs">{duration} minutes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 text-xs">
            Cancel
          </Button>
          <Button onClick={onAccept} className="flex-1 bg-green-600 hover:bg-green-700 text-xs">
            Accept Alternative Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
