"use client"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { useDroppable } from "@dnd-kit/core"
import { EventCard } from "./EventCard"
import type { Event } from "@/lib/events"
import { isSameDay } from "date-fns"
import { useEventsContext } from "@/contexts/EventContext"

function DayColumn({
  day,
  events,
  isSelected
}: {
  day: Date
  events: Event[]
  isSelected?: boolean
}) {
  const { setSelectedEvent } = useEventsContext()
  const dateStr = format(day, "yyyy-MM-dd")
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 min-h-0 border-r border-gray-200 last:border-r-0 overflow-hidden
        ${isOver ? "bg-purple-100" : ""}
        ${isSelected ? "bg-purple-100 border-purple-100" : ""}
      `}
    >
      <div className="p-3 space-y-2 h-full">
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </div>
    </div>
  )
}

export function DesktopWeekView() {
  const { weekDays, getEventsForDay, selectedDay } = useEventsContext()
  return (
    <motion.div
      className="flex h-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {weekDays.map((day, index) => (
        <DayColumn
          key={index}
          day={day}
          events={getEventsForDay(day)}
          isSelected={selectedDay ? isSameDay(day, selectedDay) : false}
        />
      ))}
    </motion.div>
  )
}
