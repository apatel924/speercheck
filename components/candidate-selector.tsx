"use client"

import { useState } from "react"
import { ChevronDown, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
          className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="truncate text-gray-700">
              {selectedCandidate ? selectedCandidate.name : "Select Candidate"}
            </span>
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
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{candidate.name}</div>
            </button>
          ))}

          {filteredCandidates.length === 0 && <div className="p-4 text-center text-gray-500">No candidates found</div>}
        </div>
      </PopoverContent>
    </Popover>
  )
}
