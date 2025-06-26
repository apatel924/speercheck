"use client"

import { useState } from "react"
import { ChevronDown, Search, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { getEngineerColor } from "@/lib/engineer-colors"
import type { Engineer } from "@/lib/types"

interface EngineerFilterProps {
  engineers: Engineer[]
  selectedEngineers: Engineer[]
  onSelectionChange: (engineers: Engineer[]) => void
}

export function EngineerFilter({ engineers, selectedEngineers, onSelectionChange }: EngineerFilterProps) {
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
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">
                {selectedEngineers.length === 0 ? "All Engineers" : `${selectedEngineers.length} selected`}
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
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => toggleEngineer(engineer)}
                >
                  <Checkbox checked={isSelected} readOnly />
                  <div className={`w-3 h-3 rounded-full ${getEngineerColor(engineer.id)}`} />
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

      {/* Filter Pills */}
      {selectedEngineers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEngineers.map((engineer) => (
            <Badge
              key={engineer.id}
              variant="secondary"
              className="flex items-center gap-2 bg-blue-50 text-blue-700 border-blue-200"
            >
              <div className={`w-2 h-2 rounded-full ${getEngineerColor(engineer.id)}`} />
              <span className="text-xs font-medium">{engineer.name}</span>
              <button
                onClick={() => removeEngineer(engineer.id)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
