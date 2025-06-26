"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ViewSettings } from "@/lib/types"

interface ControlsProps {
  viewSettings: ViewSettings
  onViewSettingsChange: (settings: ViewSettings) => void
}

export function Controls({ viewSettings, onViewSettingsChange }: ControlsProps) {
  return (
    <div className="space-y-4">
      {/* Show Booked Only Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="show-booked" className="text-sm font-medium text-gray-700">
            Show all bookings
          </Label>
          <p className="text-xs text-gray-500 mt-1">Display only slots with confirmed bookings</p>
        </div>
        <Switch
          id="show-booked"
          checked={viewSettings.showBookedOnly}
          onCheckedChange={(checked) =>
            onViewSettingsChange({
              ...viewSettings,
              showBookedOnly: checked,
            })
          }
        />
      </div>
    </div>
  )
}
