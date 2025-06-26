"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, Clock } from "lucide-react"
import type { Candidate, Engineer } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface AvailabilityInfoModalProps {
  open: boolean
  onClose: () => void
  candidate?: Candidate
  engineers?: Engineer[]
  type: "candidate" | "engineers"
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export function AvailabilityInfoModal({ open, onClose, candidate, engineers, type }: AvailabilityInfoModalProps) {
  const formatTimeRange = (start: string, end: string) => {
    return `${formatTime(start)}–${formatTime(end)}`
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Full Availability Overview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {type === "candidate" && candidate && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{candidate.name}</h3>
              <div className="space-y-3">
                {days.map((day) => {
                  const daySlots = candidate.availability[day] || []
                  return (
                    <div key={day} className="flex items-start gap-4">
                      <div className="w-20 text-sm font-medium text-gray-700 pt-1">{day}:</div>
                      <div className="flex-1">
                        {daySlots.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {daySlots.map((slot, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                              >
                                <Clock className="w-3 h-3" />
                                {formatTimeRange(slot.start, slot.end)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not available</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {type === "engineers" && engineers && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Engineers Availability</h3>
              <Accordion type="multiple" className="w-full">
                {engineers.map((engineer) => (
                  <AccordionItem key={engineer.id} value={engineer.id}>
                    <AccordionTrigger className="text-left">
                      <div>
                        <div className="font-medium">{engineer.name}</div>
                        <div className="text-sm text-gray-500">{engineer.role}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {days.map((day) => {
                          const daySlots = engineer.availability[day] || []
                          return (
                            <div key={day} className="flex items-start gap-4">
                              <div className="w-20 text-sm font-medium text-gray-700 pt-1">{day}:</div>
                              <div className="flex-1">
                                {daySlots.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {daySlots.map((slot, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                      >
                                        <Clock className="w-3 h-3" />
                                        {formatTimeRange(slot.start, slot.end)}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">Not available</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
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
