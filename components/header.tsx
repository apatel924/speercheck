"use client"

import { useState } from "react"
import { ChevronDown, Search, User, Users, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { formatAvailability, getEngineerColor } from "@/lib/utils"
import type { Candidate, Engineer } from "@/lib/utils"

interface HeaderProps {
  candidates: Candidate[]
  engineers: Engineer[]
  selectedCandidate: Candidate | null
  onCandidateSelect: (candidate: Candidate) => void
  selectedEngineers: Engineer[]
  onEngineersChange: (engineers: Engineer[]) => void
  duration: 15 | 30 | 60
  onDurationChange: (duration: 15 | 30 | 60) => void
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
                  <div className={`w-3 h-3 rounded-full ${getEngineerColor(engineer.id, engineers)}`} />
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
              <div className={`w-2 h-2 rounded-full ${getEngineerColor(engineer.id, engineers)}`} />
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

export function Header({
  candidates,
  engineers,
  selectedCandidate,
  onCandidateSelect,
  selectedEngineers,
  onEngineersChange,
  duration,
  onDurationChange,
}: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SpeerCheck Live</h1>
            <p className="text-sm text-gray-600">Interview Scheduler</p>
          </div>

          <div className="flex items-center gap-4">
            <CandidateSelector
              candidates={candidates}
              selectedCandidate={selectedCandidate}
              onSelect={onCandidateSelect}
            />
            <EngineerFilter
              engineers={engineers}
              selectedEngineers={selectedEngineers}
              onSelectionChange={onEngineersChange}
            />
            <DurationSelector duration={duration} onDurationChange={onDurationChange} />
          </div>
        </div>
      </div>
    </header>
  )
}
