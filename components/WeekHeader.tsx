"use client"

import { format, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { AddEvent } from "./AddEvent"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"

interface WeekHeaderProps {
  weekDays: Date[]
  selectedDay: Date | null
  onDaySelect: (day: Date) => void
  onNavigate: (direction: "prev" | "next") => void
}

export function WeekHeader({ weekDays, selectedDay, onDaySelect, onNavigate }: WeekHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="border-b bg-gradient-to-br from-[] via-muted/30 to-background">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h1 className="text-lg font-semibold text-gray-900">Schedule | {format(new Date(), "EEE MMM d yyyy")}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onNavigate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 md:gap-6 px-4 py-2">
          {weekDays.map((day, index) => (
            <motion.button
              key={index}
              // Added a unique layoutId for the shared layout animation.
              // This will connect the button to the modal.
              // layoutId={`event-card-${format(day, "yyyy-MM-dd")}`}
              onClick={() => {
                onDaySelect(day)
                setIsOpen(true)
              }}
              animate={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 500, damping: 100 }}
              className="relative p-2 rounded-lg text-center transition-colors overflow-hidden cursor-pointer">
              <div className="text-md font-medium relative z-10 flex-col items-center justify-center">
                <h2 className="text-xs">{format(day, "EEE")}</h2>
                <div className={`text-sm mx-auto font-semibold relative z-10 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center 
                  rounded-full mt-0.5 ${isToday(day) && "bg-blue-100"}`}>
                  {format(day, "d")}
                  {selectedDay && isSameDay(day, selectedDay) && (
                    <motion.div
                      layoutId={`day-underline`}
                      className="absolute inset-0 bg-blue-500 text-white rounded-full -z-10 w-7 h-7 md:w-10 md:h-10 mx-auto"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && selectedDay && (
          <AddEvent event={selectedDay} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
