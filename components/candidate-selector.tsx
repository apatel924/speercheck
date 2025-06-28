"use client"

import { useState } from "react"
import { ChevronDown, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// Removed getCandidateColor and generateEmail imports
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-full h-12 px-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {selectedCandidate ? selectedCandidate.name : "Select Candidate"}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0 shadow-lg border-gray-200 dark:border-gray-700 rounded-xl" align="start">
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-gray-300 dark:border-gray-600 rounded-lg h-8 text-sm"
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1">
          {filteredCandidates.map((candidate) => {
            const isSelected = selectedCandidate?.id === candidate.id

            return (
              <div
                key={candidate.id}
                className={`flex items-center gap-2 p-2 m-0.5 rounded-lg transition-all duration-150 cursor-pointer ${
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${candidate.color}`}
                >
                  {candidate.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">{candidate.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{candidate.email}</div>
                </div>
              </div>
            )
          })}

          {filteredCandidates.length === 0 && (
            <div className="p-2 text-center text-gray-500 dark:text-gray-400 text-sm">No candidates found</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
