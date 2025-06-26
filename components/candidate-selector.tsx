"use client"

import { useState } from "react"
import { ChevronDown, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getEngineerInitials } from "@/lib/engineer-colors"
import type { Candidate } from "@/lib/types"

interface CandidateSelectorProps {
  candidates: Candidate[]
  selectedCandidate: Candidate | null
  onSelect: (candidate: Candidate) => void
}

export function CandidateSelector({ candidates, selectedCandidate, onSelect }: CandidateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Generate mock email addresses for candidates
  const getCandidateEmail = (candidate: Candidate) => {
    const firstName = candidate.name.split(" ")[0].toLowerCase()
    const lastName = candidate.name.split(" ")[1]?.toLowerCase() || ""
    return `${firstName}.${lastName}@email.com`
  }

  // Get candidate avatar color (blue variations)
  const getCandidateColor = (index: number) => {
    const blueColors = ["bg-blue-500", "bg-blue-600", "bg-blue-700", "bg-indigo-500", "bg-indigo-600", "bg-sky-500"]
    return blueColors[index % blueColors.length]
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-full h-12 px-4"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedCandidate ? selectedCandidate.name : "Select Candidate"}
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-96 p-0 shadow-lg border-gray-200 dark:border-gray-700 rounded-xl" align="start">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
          </div>

          {/* Candidate List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filteredCandidates.map((candidate, index) => {
              const initials = getEngineerInitials(candidate.name)
              const email = getCandidateEmail(candidate)
              const isSelected = selectedCandidate?.id === candidate.id

              return (
                <div
                  key={candidate.id}
                  className={`flex items-center gap-3 p-3 m-1 rounded-lg transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                  }`}
                  onClick={() => {
                    onSelect(candidate)
                    setOpen(false)
                    setSearchTerm("")
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getCandidateColor(index)}`}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{candidate.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{email}</div>
                  </div>
                </div>
              )
            })}

            {filteredCandidates.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No candidates found</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
