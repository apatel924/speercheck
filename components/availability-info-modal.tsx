"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Calendar, Clock } from "lucide-react"
import type { Candidate, Engineer } from "@/lib/types"
import type { AvailabilitySlot } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface AvailabilityInfoModalProps {
  open: boolean
  onClose: () => void
  candidate?: Candidate
  engineers?: Engineer[]
  type: "candidate" | "engineers"
}

export function AvailabilityInfoModal({
  open,
  onClose,
  candidate,
  engineers,
  type,
}: AvailabilityInfoModalProps) {
  const formatTimeRange = (start: string, end: string) =>
    `${formatTime(start)}–${formatTime(end)}`

  function renderSlots(
    availability: Record<string, AvailabilitySlot[]>,
    bgClass: string,
    textClass: string
  ) {
    return Object.entries(availability).map(([day, slots]) => (
      <div key={day} className="flex items-start gap-4">
        <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300 pt-1">
          {day}:
        </div>
        <div className="flex-1">
          {slots.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 px-3 py-1 ${bgClass} ${textClass} rounded-full text-sm`}
                >
                  <Clock className={`w-3 h-3 ${textClass}`} />
                  {formatTimeRange(slot.start, slot.end)}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              Not available
            </span>
          )}
        </div>
      </div>
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Full Availability Overview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {type === "candidate" && candidate && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {candidate.name}
              </h3>
              <div className="space-y-3">
                {renderSlots(
                  candidate.availability as Record<string, AvailabilitySlot[]>,
                  "bg-green-50 dark:bg-green-900/30",
                  "text-green-700 dark:text-green-300"
                )}
              </div>
            </div>
          )}

          {type === "engineers" && engineers && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Engineers Availability
              </h3>
              <Accordion type="multiple" className="w-full">
                {engineers.map((engineer) => (
                  <AccordionItem key={engineer.id} value={engineer.id}>
                    <AccordionTrigger className="text-left">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {engineer.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {engineer.role}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {renderSlots(
                          engineer.availability as Record<string, AvailabilitySlot[]>,
                          "bg-blue-50 dark:bg-blue-900/30",
                          "text-blue-700 dark:text-blue-300"
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
