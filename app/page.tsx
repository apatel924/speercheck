"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Search, User, Users, Clock, X, Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  mockCandidates,
  mockEngineers,
  getAvailableSlots,
  isSlotBooked,
  formatAvailability,
  getEngineerColor,
  formatTime,
  getEndTime,
  DAYS,
  TIME_SLOTS,
  type Candidate,
  type Engineer,
  type BookedSlot,
  type TimeSlot,
} from "@/lib/utils"

interface ConfirmationData {
  candidate: Candidate
  engineer: Engineer
  timeSlot: TimeSlot
  duration: number
}

// Candidate Selector Component
function CandidateSelector({
  candidates,
  selectedCandidate,
  onSelect,
}: {
  candidates: Candidate[]
  selectedCandidate: Candidate | null
  onSelect: (candidate: Candidate) => void
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-64 justify-between bg-white hover:bg-gray-50 shadow-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="truncate">{selectedCandidate ? selectedCandidate.name : "Select Candidate"}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 shadow-lg" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filteredCandidates.map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => {
                onSelect(candidate)
                setOpen(false)
                setSearchTerm("")
              }}
              className="w-full p-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{candidate.name}</div>
              <div className="text-sm text-gray-500 mt-1">Free: {formatAvailability(candidate.availability)}</div>
            </button>
          ))}

          {filteredCandidates.length === 0 && <div className="p-4 text-center text-gray-500">No candidates found</div>}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Engineer Filter Component
function EngineerFilter({
  engineers,
  selectedEngineers,
  onSelectionChange,
}: {
  engineers: Engineer[]
  selectedEngineers: Engineer[]
  onSelectionChange: (engineers: Engineer[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEngineers = engineers.filter((engineer) =>
    engineer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleEngineer = (engineer: Engineer) => {
    const isSelected = selectedEngineers.some((e) => e.id === engineer.id)
    if (isSelected) {
      onSelectionChange(selectedEngineers.filter((e) => e.id !== engineer.id))
    } else {
      onSelectionChange([...selectedEngineers, engineer])
    }
  }

  const removeEngineer = (engineerId: string) => {
    onSelectionChange(selectedEngineers.filter((e) => e.id !== engineerId))
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-48 justify-between bg-white hover:bg-gray-50 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>
                {selectedEngineers.length === 0 ? "Filter Engineers" : `${selectedEngineers.length} selected`}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-0 shadow-lg" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search engineers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredEngineers.map((engineer) => {
              const isSelected = selectedEngineers.some((e) => e.id === engineer.id)
              return (
                <div
                  key={engineer.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors duration-150"
                >
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleEngineer(engineer)} />
                  <div className={`w-3 h-3 rounded-full ${getEngineerColor(engineer.id, mockEngineers)}`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{engineer.name}</div>
                    <div className="text-sm text-gray-500">{engineer.role}</div>
                  </div>
                </div>
              )
            })}

            {filteredEngineers.length === 0 && <div className="p-4 text-center text-gray-500">No engineers found</div>}
          </div>
        </PopoverContent>
      </Popover>

      {selectedEngineers.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedEngineers.map((engineer) => (
            <Badge key={engineer.id} variant="secondary" className="flex items-center gap-1 bg-white border shadow-sm">
              <div className={`w-2 h-2 rounded-full ${getEngineerColor(engineer.id, mockEngineers)}`} />
              <span className="text-xs">{engineer.name}</span>
              <button
                onClick={() => removeEngineer(engineer.id)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Duration Selector Component
function DurationSelector({
  duration,
  onDurationChange,
}: {
  duration: 15 | 30 | 60
  onDurationChange: (duration: 15 | 30 | 60) => void
}) {
  const durations: Array<{ value: 15 | 30 | 60; label: string }> = [
    { value: 15, label: "15 min" },
    { value: 30, label: "30 min" },
    { value: 60, label: "60 min" },
  ]

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-gray-500" />
      <div className="flex bg-white rounded-full p-1 shadow-sm border">
        {durations.map((d) => (
          <Button
            key={d.value}
            variant={duration === d.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onDurationChange(d.value)}
            className={`rounded-full px-4 py-1 text-sm transition-all duration-200 ${
              duration === d.value ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {d.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Engineer Badge Component
function EngineerBadge({ engineer, color }: { engineer: Engineer; color: string }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const initials = engineer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative">
      <div
        className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-white text-xs font-medium cursor-pointer transition-transform duration-150 hover:scale-110`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {initials}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <div className="font-medium">{engineer.name}</div>
            <div className="text-gray-300">{engineer.role}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Confirmation Modal Component
function ConfirmationModal({
  candidate,
  engineer,
  timeSlot,
  duration,
  onConfirm,
  onCancel,
}: ConfirmationData & {
  onConfirm: () => void
  onCancel: () => void
}) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setShowSuccess(true)
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

// Main App Component
export default function SchedulerPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedEngineers, setSelectedEngineers] = useState<Engineer[]>([])
  const [duration, setDuration] = useState<15 | 30 | 60>(30)
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null)

  const availableSlots = useMemo(() => {
    if (!selectedCandidate || selectedEngineers.length === 0) {
      return new Map()
    }
    return getAvailableSlots(selectedCandidate, selectedEngineers)
  }, [selectedCandidate, selectedEngineers])

  const handleSlotClick = (timeSlot: TimeSlot, engineer: Engineer) => {
    if (!selectedCandidate) return
    setConfirmationData({ candidate: selectedCandidate, engineer, timeSlot, duration })
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

  const getSlotStatus = (day: string, time: string) => {
    const slotKey = `${day}-${time}`
    const engineers = availableSlots.get(slotKey) || []
    const isBooked = isSlotBooked(bookedSlots, day, time, duration)
    return { engineers, isBooked }
  }

  const handleCalendarSlotClick = (day: string, time: string) => {
    const { engineers, isBooked } = getSlotStatus(day, time)
    if (isBooked || engineers.length === 0) return
    handleSlotClick({ day, startTime: time }, engineers[0])
  }

  const renderEmptyState = (type: "candidate" | "engineers") => {
    const config = {
      candidate: {
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        ),
        title: "Select a Candidate",
        description: "Choose a candidate to view their availability",
      },
      engineers: {
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        ),
        title: "Select Engineers",
        description: "Choose one or more engineers to see overlapping availability",
      },
    }

    const { icon, title, description } = config[type]

    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-sm border">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SpeerCheck Live</h1>
              <p className="text-sm text-gray-600">Interview Scheduler</p>
            </div>

            <div className="flex items-center gap-4">
              <CandidateSelector
                candidates={mockCandidates}
                selectedCandidate={selectedCandidate}
                onSelect={setSelectedCandidate}
              />
              <EngineerFilter
                engineers={mockEngineers}
                selectedEngineers={selectedEngineers}
                onSelectionChange={setSelectedEngineers}
              />
              <DurationSelector duration={duration} onDurationChange={setDuration} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCandidate ? (
          renderEmptyState("candidate")
        ) : selectedEngineers.length === 0 ? (
          renderEmptyState("engineers")
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="grid grid-cols-6 border-b">
              <div className="p-4 bg-gray-50 border-r font-medium text-gray-700">Time</div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="p-4 bg-gray-50 border-r last:border-r-0 font-medium text-gray-700 text-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {TIME_SLOTS.map((time) => (
              <div
                key={time}
                className="grid grid-cols-6 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
              >
                <div className="p-3 border-r bg-gray-50/50 text-sm font-medium text-gray-600 flex items-center">
                  {time}
                </div>
                {DAYS.map((day) => {
                  const { engineers, isBooked } = getSlotStatus(day, time)
                  const hasAvailability = engineers.length > 0

                  return (
                    <div
                      key={`${day}-${time}`}
                      className={`p-2 border-r last:border-r-0 h-16 relative transition-all duration-150 ${
                        isBooked
                          ? "bg-red-50 cursor-not-allowed"
                          : hasAvailability
                            ? "cursor-pointer hover:bg-blue-50 hover:scale-105 hover:shadow-sm"
                            : "bg-gray-50/30"
                      }`}
                      onClick={() => handleCalendarSlotClick(day, time)}
                    >
                      {isBooked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Booked
                          </div>
                        </div>
                      )}

                      {!isBooked && hasAvailability && (
                        <div className="flex flex-wrap gap-1">
                          {engineers.map((engineer: Engineer) => (
                            <EngineerBadge
                              key={engineer.id}
                              engineer={engineer}
                              color={getEngineerColor(engineer.id, mockEngineers)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {confirmationData && (
        <ConfirmationModal
          {...confirmationData}
          onConfirm={handleConfirmBooking}
          onCancel={() => setConfirmationData(null)}
        />
      )}
    </div>
  )
}
