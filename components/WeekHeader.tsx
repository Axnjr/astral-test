"use client"

import { format, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { AddEvent } from "./AddEvent"
import { useState } from "react"
import { useEventsContext } from "@/contexts/EventContext"

export function WeekHeader() {
  const { weekDays, selectedDay, setSelectedDay, navigateWeek } = useEventsContext()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="bg-gradient-header shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gradient-header backdrop-blur-sm">
          <h1 className="text-lg text-white tracking-tighter font-bold">
            Schedule | {format(selectedDay, "EEE MMM d yyyy")}
          </h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateWeek("prev")}
              className="bg-white/20 hover:bg-white/30 hover:border-white/50 transition-all duration-200 shadow-sm text-white hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateWeek("next")}
              className="bg-white/20 hover:bg-white/30 hover:border-white/50 transition-all duration-200 shadow-sm text-white hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 md:gap-6 px-2 md:px-4 py-2">
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
              className="relative p-2 rounded-lg text-center transition-all duration-300 overflow-hidden cursor-pointer 
              bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-sm hover:shadow-md flex items-center justify-center">
              <div className="text-md font-medium relative z-10 flex-col items-center justify-center">
                <h2 className="text-xs text-white font-medium">
                  {format(day, "EEE")}
                </h2>
                <div className={`md:text-xl text-xs mx-auto font-semibold relative z-10 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center 
                  rounded-full mt-0.5 transition-all duration-300 ${
                    isToday(day) 
                      ? "bg-white shadow-sm text-black" 
                      : "hover:bg-gradient-surface-hover"
                  }`}>
                  <span className={`${isToday(day) ? "text-black" : "text-white"}`}>
                    {format(day, "d")}
                  </span>
                  {selectedDay && isSameDay(day, selectedDay) && (
                    <motion.div
                      layoutId={`day-underline`}
                      className="absolute inset-0 bg-gradient-active rounded-full -z-10 w-7 h-7 md:w-10 md:h-10 mx-auto shadow-lg"
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
