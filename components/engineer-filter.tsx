"use client"

import { useState } from "react"
import { ChevronDown, Search, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
// Removed getEngineerColor, getEngineerInitials, generateEmail imports
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

  const clearAll = () => {
    onSelectionChange([])
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-purple-300 dark:border-purple-600 rounded-full h-12 px-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedEngineers.length === 0
                    ? "All Engineers"
                    : selectedEngineers.length === 1
                      ? selectedEngineers[0].name
                      : `${selectedEngineers.length} Engineers`}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Filter by availability</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-96 p-0 shadow-lg border-gray-200 dark:border-gray-700 rounded-xl" align="start">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filter Engineers</h3>
              {selectedEngineers.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search engineers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {filteredEngineers.map((engineer) => {
              const isSelected = selectedEngineers.some((e) => e.id === engineer.id)
              // Use engineer.color and engineer.email directly, initials from name
              const initials = engineer.name.split(" ").map(n => n[0]).join("").slice(0,2)

              return (
                <div
                  key={engineer.id}
                  className={`flex items-center gap-3 p-3 m-1 rounded-lg transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                  }`}
                  onClick={() => toggleEngineer(engineer)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className={`w-4 h-4 rounded border-2 focus:ring-2 focus:ring-purple-500 ${
                      isSelected
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${engineer.color}`}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{engineer.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{engineer.email}</div>
                  </div>
                </div>
              )
            })}

            {filteredEngineers.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No engineers found</div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedEngineers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEngineers.map((engineer) => (
            <Badge
              key={engineer.id}
              variant="secondary"
              className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
            >
              <div className={`w-2 h-2 rounded-full ${engineer.color}`} />
              <span className="text-xs font-medium">{engineer.name}</span>
              <button
                onClick={() => removeEngineer(engineer.id)}
                className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors"
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
