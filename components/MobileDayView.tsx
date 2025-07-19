"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { useDroppable } from "@dnd-kit/core"
import { EventCard } from "./EventCard"
import type { Event } from "@/lib/events"
import { startOfWeek, endOfWeek, addDays, subDays } from "date-fns"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface MobileDayViewProps {
  selectedDay: Date
  events: Event[]
  onNavigateDay: (direction: "prev" | "next") => void
  onNavigateWeek: (direction: "prev" | "next") => void
  onEventClick: (event: Event) => void
}

export function MobileDayView({ selectedDay, events, onNavigateDay, onNavigateWeek, onEventClick }: MobileDayViewProps) {
  const [dragX, setDragX] = useState(0)
  const dateStr = format(selectedDay, "yyyy-MM-dd")
  const [direction, setDirection] = useState(0) // 1 for next, -1 for prev
  const isMobile = useMediaQuery("(max-width: 768px)")

  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  })

  const [previousSelectedDay, setPreviousSelectedDay] = useState(selectedDay);

  useEffect(() => {
    if (selectedDay.getTime() > previousSelectedDay.getTime()) {
      setDirection(1); // Moving to next day
    } else if (selectedDay.getTime() < previousSelectedDay.getTime()) {
      setDirection(-1); // Moving to previous day
    }
    setPreviousSelectedDay(selectedDay);
  }, [selectedDay, previousSelectedDay]);

  const handlePanEnd = (event: unknown, info: PanInfo) => {
    const threshold = 100

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiping right (going to previous day)
        const prevDay = subDays(selectedDay, 1)
        if (prevDay < startOfWeek(selectedDay)) {
          onNavigateWeek("prev")
        } else {
          onNavigateDay("prev")
        }
      } else {
        // Swiping left (going to next day)
        const nextDay = addDays(selectedDay, 1)
        if (nextDay > endOfWeek(selectedDay)) {
          onNavigateWeek("next")
        } else {
          onNavigateDay("next")
        }
      }
    }
    setDragX(0)
  }

  const variants = {
    enter: {
      opacity: 0,
      y: 20,
      borderRadius: "15px",
    },
    center: {
      opacity: 1,
      y: 0,
      borderRadius: "8px",
    },
    exit: {
      opacity: 0,
      y: -20,
      borderRadius: "15px",
      position: "absolute",
    },
  }

  return (
    <div className="h-full overflow-hidden">
      <motion.div
        ref={setNodeRef}
        className={`
          h-full p-4 space-y-3 overflow-y-auto relative
          ${isOver && !isMobile ? "bg-blue-50" : ""}
        `}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onPanEnd={handlePanEnd}
        animate={{ x: dragX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={dateStr}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              borderRadius: { duration: 0.5 }
            }}
            className="w-full h-full space-y-6"
          >
            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No events scheduled</p>
              </div>
            ) : (
              events.map((event) => <div
              key={event.id}
              onPointerDownCapture={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <EventCard event={event} onClick={() => onEventClick(event)} />
            </div>)
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
