"use client"

import { format, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WeekHeaderProps {
  weekDays: Date[]
  selectedDay: Date
  onDaySelect: (day: Date) => void
  onNavigate: (direction: "prev" | "next") => void
  isMobile: boolean
}

export function WeekHeader({ weekDays, selectedDay, onDaySelect, onNavigate, isMobile }: WeekHeaderProps) {
  return (
    <div className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900">{format(weekDays[0], "MMMM yyyy")}</h1>

        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onNavigate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <button
            key={index}
            onClick={() => onDaySelect(day)}
            className={`
              p-2 rounded-lg text-center transition-colors
              ${
                isSameDay(day, selectedDay)
                  ? "bg-blue-500 text-white"
                  : isToday(day)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <div className="text-xs font-medium">{format(day, "EEE")}</div>
            <div className="text-sm font-semibold">{format(day, "d")}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
