"use client"
import { format } from "date-fns"
import { motion } from "motion/react"
import { useDroppable } from "@dnd-kit/core"
import { EventCard } from "./EventCard"
import type { Event } from "@/lib/events"
import { isSameDay } from "date-fns"

interface DesktopWeekViewProps {
  weekDays: Date[]
  getEventsForDay: (date: Date) => Event[]
  onEventClick: (event: Event) => void
  selectedDay?: Date
}

function DayColumn({
  day,
  events,
  onEventClick,
  isSelected,
}: {
  day: Date
  events: Event[]
  onEventClick: (event: Event) => void
  isSelected?: boolean
}) {
  const dateStr = format(day, "yyyy-MM-dd")
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 min-h-0 border-r border-gray-200 last:border-r-0 
        ${isOver ? "bg-neutral-50" : ""}
        ${isSelected ? "bg-blue-50 border-blue-100" : ""}
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

export function DesktopWeekView({
  weekDays,
  getEventsForDay,
  onEventClick,
  selectedDay
}: DesktopWeekViewProps) {
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
          isSelected={selectedDay && isSameDay(day, selectedDay)}
        />
      ))}
    </motion.div>
  )
}
