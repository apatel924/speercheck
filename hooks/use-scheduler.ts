"use client"

import { useState } from "react"
import type { Candidate, Engineer, BookedSlot, TimeSlot } from "@/lib/utils"

interface ConfirmationData {
  candidate: Candidate
  engineer: Engineer
  timeSlot: TimeSlot
  duration: number
}

export function useScheduler() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedEngineers, setSelectedEngineers] = useState<Engineer[]>([])
  const [duration, setDuration] = useState<15 | 30 | 60>(30)
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null)

  const handleSlotClick = (timeSlot: TimeSlot, engineer: Engineer) => {
    if (!selectedCandidate) return

    setConfirmationData({
      candidate: selectedCandidate,
      engineer,
      timeSlot,
      duration,
    })
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

  return {
    selectedCandidate,
    setSelectedCandidate,
    selectedEngineers,
    setSelectedEngineers,
    duration,
    setDuration,
    bookedSlots,
    confirmationData,
    setConfirmationData,
    handleSlotClick,
    handleConfirmBooking,
  }
}
