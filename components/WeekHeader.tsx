"use client"

import { format, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { AddEvent } from "./AddEvent"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useEventsContext } from "@/contexts/EventContext"

export function WeekHeader() {
  const { weekDays, selectedDay, setSelectedDay, navigateWeek } = useEventsContext()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="bg-gradient-surface shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gradient-surface backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-gradient-primary">
            Schedule | {format(new Date(), "EEE MMM d yyyy")}
          </h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateWeek("prev")}
              className="bg-gradient-surface hover:bg-gradient-surface-hover border-purple-200/50 hover:border-pink-300/50 transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateWeek("next")}
              className="bg-gradient-surface hover:bg-gradient-surface-hover border-purple-200/50 hover:border-pink-300/50 transition-all duration-200 shadow-sm"
            >
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
                setSelectedDay(day)
                setIsOpen(true)
              }}
              animate={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 500, damping: 100 }}
              className="relative p-2 rounded-lg text-center transition-all duration-300 overflow-hidden cursor-pointer bg-gradient-surface hover:bg-gradient-surface-hover shadow-sm hover:shadow-md">
              <div className="text-md font-medium relative z-10 flex-col items-center justify-center">
                <h2 className="text-xs text-gradient-primary font-medium">
                  {format(day, "EEE")}
                </h2>
                <div className={`md:text-xl text-xs mx-auto font-semibold relative z-10 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center 
                  rounded-full mt-0.5 transition-all duration-300 ${
                    isToday(day) 
                      ? "bg-gradient-primary-light shadow-sm" 
                      : "hover:bg-gradient-surface-hover"
                  }`}>
                  <span className="text-gradient-primary">
                    {format(day, "d")}
                  </span>
                  {selectedDay && isSameDay(day, selectedDay) && (
                    <motion.div
                      layoutId={`day-underline`}
                      className="absolute inset-0 bg-gradient-primary text-white rounded-full -z-10 w-7 h-7 md:w-10 md:h-10 mx-auto shadow-lg"
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
