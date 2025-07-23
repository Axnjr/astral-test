"use client"

import { useCallback, useMemo } from "react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useDroppable } from "@dnd-kit/core"
import { EventCard } from "./EventCard"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useEventsContext } from "@/contexts/EventContext"
import { Event } from "@/lib/events"
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation"

export function MobileDayView() {
  const { selectedDay, getEventsForDay, navigateDay, setSelectedEvent } = useEventsContext()
  const events = getEventsForDay(selectedDay)
  const dateStr = format(selectedDay, "yyyy-MM-dd")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  })

  const { dragX, direction, handlePanEnd } = useSwipeNavigation(navigateDay, selectedDay)

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event)
  }, [setSelectedEvent])

  const variants = useMemo(() => ({
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
    },
  }), [])

  const memoizedEvents = useMemo(() => events, [events])

  return (
    <div className="mobile-events-container h-full overflow-hidden relative">
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
        style={{ touchAction: 'pan-y pinch-zoom' }}
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
            className="w-full h-[90%] space-y-6 overflow-hidden"
          >
            {memoizedEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No events scheduled</p>
              </div>
            ) : (
              memoizedEvents.map((event) => (
                <div
                  key={event.id}
                  onPointerDownCapture={(e) => e.stopPropagation()}
                >
                  <EventCard 
                    event={event} 
                    onClick={() => handleEventClick(event)} 
                    enableLayoutId={true}
                  />
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
