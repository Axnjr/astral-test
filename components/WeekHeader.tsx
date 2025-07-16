"use client"

import { format, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"

interface WeekHeaderProps {
  weekDays: Date[]
  selectedDay: Date
  onDaySelect: (day: Date) => void
  onNavigate: (direction: "prev" | "next") => void
}

export function WeekHeader({ weekDays, selectedDay, onDaySelect, onNavigate }: WeekHeaderProps) {
  return (
    <div className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900">{format(new Date(), "EEE MMM d yyyy")}</h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, index) => (
          <motion.button
            key={index}
            onClick={() => onDaySelect(day)}
            animate={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`
              relative p-2 rounded-lg text-center transition-colors overflow-hidden
              ${isToday(day) && "bg-blue-100 text-black"}
            `}
            layout
          >
            {isSameDay(day, selectedDay) && (
              <motion.div
                layoutId="selectedDayUnderline"
                className="absolute inset-0 bg-blue-500 rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <div className="text-xs font-medium relative z-10">{format(day, "EEE")}</div>
            <div className="text-sm font-semibold relative z-10">{format(day, "d")}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
