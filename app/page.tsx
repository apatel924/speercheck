"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { CandidateSelector } from "@/components/candidate-selector"
import { EngineerFilter } from "@/components/engineer-filter"
import { DurationSelector } from "@/components/duration-selector"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { SlotValidationModal } from "@/components/slot-validation-modal"
import { AvailabilityInfoModal } from "@/components/availability-info-modal"
import { Controls } from "@/components/controls"
import { LiveClock } from "@/components/live-clock"
import { ThemeToggle } from "@/components/theme-toggle"
import { mockCandidates, mockEngineers } from "@/lib/mock-data"
import { canBookSlot } from "@/lib/calendar-utils"
import type { Candidate, Engineer, BookedSlot, TimeSlot, ViewSettings } from "@/lib/types"
import Image from "next/image"

export default function SchedulerPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedEngineers, setSelectedEngineers] = useState<Engineer[]>([])
  const [duration, setDuration] = useState<30 | 60>(30)
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
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    showBookedOnly: false,
  })
  const [availabilityModal, setAvailabilityModal] = useState<{
    open: boolean
    type: "candidate" | "engineers"
  }>({ open: false, type: "candidate" })

  const handleSlotClick = (timeSlot: TimeSlot, engineer: Engineer) => {
    if (!selectedCandidate) return

    const canBook = canBookSlot(selectedCandidate, engineer, timeSlot.day, timeSlot.startTime, duration, bookedSlots)

    if (canBook) {
      setConfirmationData({ candidate: selectedCandidate, engineer, timeSlot, duration })
    } else {
      const [hours, minutes] = timeSlot.startTime.split(":").map(Number)
      const earlierMinutes = hours * 60 + minutes - 30

      if (earlierMinutes >= 9 * 60) {
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

    const newBookings: BookedSlot[] = []
    const startMinutes = confirmationData.timeSlot.startTime.split(":").map(Number)
    const totalMinutes = startMinutes[0] * 60 + startMinutes[1]

    for (let i = 0; i < confirmationData.duration; i += 30) {
      const slotMinutes = totalMinutes + i
      const slotHours = Math.floor(slotMinutes / 60)
      const slotMins = slotMinutes % 60
      const slotTime = `${slotHours.toString().padStart(2, "0")}:${slotMins.toString().padStart(2, "0")}`

      const booking: BookedSlot = {
        id: `${Date.now()}-${i}`,
        candidateId: confirmationData.candidate.id,
        engineerId: confirmationData.engineer.id,
        day: confirmationData.timeSlot.day,
        startTime: slotTime,
        duration: confirmationData.duration,
        bookedAt: new Date(),
        status: "confirmed",
        interviewType: "video",
      }
      newBookings.push(booking)
    }

    setBookedSlots((prev) => [...prev, ...newBookings])
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="SpeerCheck Logo" width={24} height={24} className="dark:invert" />
              <div>
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SpeerCheck</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Live Interview Scheduler</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LiveClock />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Weekly Schedule</h2>
            </div>
            <div className="p-4 h-[calc(100%-60px)] overflow-auto">
              <WeeklyCalendar
                selectedCandidate={selectedCandidate}
                selectedEngineers={selectedEngineers}
                duration={duration}
                bookedSlots={bookedSlots}
                viewSettings={viewSettings}
                onSlotClick={handleSlotClick}
                onViewBookingDetails={(booking) => console.log("View booking details:", booking)}
                onCancelBooking={(bookingId) =>
                  setBookedSlots((prev) => prev.filter((booking) => booking.id !== bookingId))
                }
                onRescheduleBooking={(bookingId) => console.log("Reschedule booking:", bookingId)}
              />
            </div>
          </div>
        </div>

        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Candidate</label>
                  <button
                    onClick={() => setAvailabilityModal({ open: true, type: "candidate" })}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    title="View full availability"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <CandidateSelector
                  candidates={mockCandidates}
                  selectedCandidate={selectedCandidate}
                  onSelect={setSelectedCandidate}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter Engineers</label>
                  <button
                    onClick={() => setAvailabilityModal({ open: true, type: "engineers" })}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    title="View full availability"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <EngineerFilter
                  engineers={mockEngineers}
                  selectedEngineers={selectedEngineers}
                  onSelectionChange={setSelectedEngineers}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                <DurationSelector duration={duration} onDurationChange={setDuration} />
              </div>
            </div>

            <Controls viewSettings={viewSettings} onViewSettingsChange={setViewSettings} />

            {!selectedCandidate && (
              <div className="mt-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a candidate to view available time slots
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

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

      <AvailabilityInfoModal
        open={availabilityModal.open}
        onClose={() => setAvailabilityModal({ open: false, type: "candidate" })}
        candidate={availabilityModal.type === "candidate" ? selectedCandidate : undefined}
        engineers={availabilityModal.type === "engineers" ? selectedEngineers : undefined}
        type={availabilityModal.type}
      />
    </div>
  )
}
