"use client"

import { useState } from "react"
import { format } from "date-fns"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { useDroppable } from "@dnd-kit/core"
import { EventCard } from "./EventCard"
import type { Event } from "@/lib/events"

interface MobileDayViewProps {
  selectedDay: Date
  events: Event[]
  onNavigate: (direction: "prev" | "next") => void
  onEventClick: (event: Event) => void
}

export function MobileDayView({ selectedDay, events, onNavigate, onEventClick }: MobileDayViewProps) {
  const [panDirection, setPanDirection] = useState<"next" | "prev" | null>(null)
  const dateStr = format(selectedDay, "yyyy-MM-dd")

  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  })

  const handlePanEnd = (event: unknown, info: PanInfo) => {
    const threshold = 10

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        onNavigate("prev")
        setPanDirection("prev")
      } else {
        onNavigate("next")
        setPanDirection("next")
      }
    }
  }

  const variants = {
    enter: () => ({
      y: 2,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: () => ({
      y: 2,
      opacity: 0,
    }),
  }

  return (
    <div className="h-full overflow-hidden ">
      <motion.div
        ref={setNodeRef}
        className={`
          h-full p-4 space-y-3 overflow-y-auto
          ${isOver ? "bg-blue-50" : ""}
        `}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onPanEnd={handlePanEnd}
        // Removed animate={{ x: dragX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* <div className="text-center py-4">
          <h2 className="text-lg font-semibold text-gray-900">{format(selectedDay, "EEEE, MMMM d")}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {events.length} {events.length === 1 ? "event" : "events"}
          </p>
        </div> */}
        <AnimatePresence initial={false} custom={panDirection}>
          <motion.div
            key={dateStr} // Key changes with the day, triggering re-render and animation
            custom={panDirection}
            variants={variants}
            className="flex flex-col gap-6"
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 500, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No events scheduled</p>
              </div>
            ) : (
              events.map((event) => <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />)
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
