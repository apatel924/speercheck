"use client"

import { useState } from "react"
import { CandidateSelector } from "@/components/candidate-selector"
import { EngineerFilter } from "@/components/engineer-filter"
import { DurationSelector } from "@/components/duration-selector"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { SlotValidationModal } from "@/components/slot-validation-modal" 
import { mockCandidates, mockEngineers } from "@/lib/mock-data"
import { canBookSlot } from "@/lib/calendar-utils"
import type { Candidate, Engineer, BookedSlot, TimeSlot } from "@/lib/types"

export default function SchedulerPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedEngineers, setSelectedEngineers] = useState<Engineer[]>([])
  const [duration, setDuration] = useState<15 | 30 | 60>(30)
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [confirmationData, setConfirmationData] = useState<{
    candidate: Candidate
    engineer: Engineer
    timeSlot: TimeSlot
    duration: number
  } | null>(null)
  const [validationData, setValidationData] = useState<{
    candidate: Candidate
    engineer: Engineer
    requestedSlot: TimeSlot
    suggestedSlot: TimeSlot
    duration: number
  } | null>(null)

  const handleSlotClick = (timeSlot: TimeSlot, engineer: Engineer) => {
    if (!selectedCandidate) return

    // Check if the requested slot can accommodate the full duration
    const canBook = canBookSlot(selectedCandidate, engineer, timeSlot.day, timeSlot.startTime, duration, bookedSlots)

    if (canBook) {
      // Direct booking if slot is fully available
      setConfirmationData({
        candidate: selectedCandidate,
        engineer,
        timeSlot,
        duration,
      })
    } else {
      // Try to find an alternative slot 30 minutes earlier
      const [hours, minutes] = timeSlot.startTime.split(":").map(Number)
      const earlierMinutes = hours * 60 + minutes - 30

      if (earlierMinutes >= 9 * 60) {
        // Don't go before 9:00 AM
        const earlierHours = Math.floor(earlierMinutes / 60)
        const earlierMins = earlierMinutes % 60
        const suggestedTime = `${earlierHours.toString().padStart(2, "0")}:${earlierMins.toString().padStart(2, "0")}`

        const suggestedSlot = { day: timeSlot.day, startTime: suggestedTime }
        const canBookEarlier = canBookSlot(
          selectedCandidate,
          engineer,
          timeSlot.day,
          suggestedTime,
          duration,
          bookedSlots,
        )

        if (canBookEarlier) {
          setValidationData({
            candidate: selectedCandidate,
            engineer,
            requestedSlot: timeSlot,
            suggestedSlot,
            duration,
          })
          return
        }
      }
      alert("This time slot is not available for the selected duration. Please try a different time.")
    }
  }

  const handleConfirmBooking = () => {
    if (!confirmationData) return

    const newBooking: BookedSlot = {
      id: Date.now().toString(),
      candidateId: confirmationData.candidate.id,
      engineerId: confirmationData.engineer.id,
      day: confirmationData.timeSlot.day,
      startTime: confirmationData.timeSlot.startTime,
      duration: confirmationData.duration,
      bookedAt: new Date(),
    }

    setBookedSlots((prev) => [...prev, newBooking])
    setConfirmationData(null)
  }

  const handleAcceptSuggestion = () => {
    if (!validationData) return

    setConfirmationData({
      candidate: validationData.candidate,
      engineer: validationData.engineer,
      timeSlot: validationData.suggestedSlot,
      duration: validationData.duration,
    })
    setValidationData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">SpeerCheck</h1>
              <p className="text-sm text-gray-600">Live Interview Scheduler</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Calendar Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
            </div>
            <div className="p-4 h-[calc(100%-60px)] overflow-auto">
              <WeeklyCalendar
                selectedCandidate={selectedCandidate}
                selectedEngineers={selectedEngineers}
                duration={duration}
                bookedSlots={bookedSlots}
                onSlotClick={handleSlotClick}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Schedule Interview
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Candidate</label>
                <CandidateSelector
                  candidates={mockCandidates}
                  selectedCandidate={selectedCandidate}
                  onSelect={setSelectedCandidate}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter Engineers</label>
                <EngineerFilter
                  engineers={mockEngineers}
                  selectedEngineers={selectedEngineers}
                  onSelectionChange={setSelectedEngineers}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <DurationSelector duration={duration} onDurationChange={setDuration} />
              </div>
            </div>

            {!selectedCandidate && (
              <div className="mt-8 text-center">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Select a candidate to view available time slots</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {confirmationData && (
        <ConfirmationModal
          candidate={confirmationData.candidate}
          engineer={confirmationData.engineer}
          timeSlot={confirmationData.timeSlot}
          duration={confirmationData.duration}
          onConfirm={handleConfirmBooking}
          onCancel={() => setConfirmationData(null)}
        />
      )}

      {validationData && (
        <SlotValidationModal
          candidate={validationData.candidate}
          engineer={validationData.engineer}
          requestedSlot={validationData.requestedSlot}
          suggestedSlot={validationData.suggestedSlot}
          duration={validationData.duration}
          onAccept={handleAcceptSuggestion}
          onCancel={() => setValidationData(null)}
        />
      )}
    </div>
  )
}
