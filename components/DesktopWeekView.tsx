"use client"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { useDroppable } from "@dnd-kit/core"
import { EventCard } from "./EventCard"
import type { Event } from "@/lib/events"

interface DesktopWeekViewProps {
  weekDays: Date[]
  getEventsForDay: (date: Date) => Event[]
  onEventClick: (event: Event) => void
  onNavigate?: (direction: "prev" | "next") => void
}

function DayColumn({
  day,
  events,
  onEventClick,
}: {
  day: Date
  events: Event[]
  onEventClick: (event: Event) => void
}) {
  const dateStr = format(day, "yyyy-MM-dd")
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 min-h-0 border-r border-gray-200 last:border-r-0 ${isOver ? "bg-blue-50" : ""}
      `}
    >
      <div className="p-3 space-y-2 h-full overflow-y-auto">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
        ))}
      </div>
    </div>
  )
}

export function DesktopWeekView({ weekDays, getEventsForDay, onEventClick, onNavigate }: DesktopWeekViewProps) {
  return (
    <motion.div 
      className="flex h-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {weekDays.map((day) => (
        <DayColumn
          key={format(day, "yyyy-MM-dd")}
          day={day}
          events={getEventsForDay(day)}
          onEventClick={onEventClick}
        />
      ))}
    </motion.div>
  )
}
