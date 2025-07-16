"use client"
import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core"
import { WeekHeader } from "./WeekHeader"
import { DesktopWeekView } from "./desktop-week-view"
import { MobileDayView } from "./mobile-day-view"
import { EventCard } from "./event-card"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Event, EventsByDate, initialEvents } from "@/lib/events"

export function CalendarKanban() {
  const [currentDate, setCurrentDate] = useState(new Date("2024-03-11"))
  const [selectedDay, setSelectedDay] = useState(new Date("2024-03-11"))
  const [events, setEvents] = useState<EventsByDate>(initialEvents)
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync selectedDay with currentDate when week changes
  useEffect(() => {
    if (!isMobile) {
      // On desktop, keep selectedDay in sync with currentDate week
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
      const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
      
      // If selectedDay is not in current week, set it to the first day of the week
      const isInCurrentWeek = weekDays.some(day => isSameDay(day, selectedDay))
      if (!isInCurrentWeek) {
        setSelectedDay(weekStart)
      }
    }
  }, [currentDate, isMobile, selectedDay])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: () => {
        return {
          x: 0,
          y: 0,
        }
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    // Find the dragged event across all dates
    let draggedEvent: Event | null = null
    for (const date in events) {
      const foundEvent = events[date].find((e) => e.id === event.active.id)
      if (foundEvent) {
        draggedEvent = foundEvent
        break
      }
    }
    setActiveEvent(draggedEvent)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !active) {
      setActiveEvent(null)
      return
    }

    const eventId = active.id as string
    const newDate = over.id as string

    setEvents((prev) => {
      const newEvents = { ...prev }
      
      // Find and remove the event from its current date
      for (const date in newEvents) {
        const eventIndex = newEvents[date].findIndex((e) => e.id === eventId)
        if (eventIndex !== -1) {
          const [movedEvent] = newEvents[date].splice(eventIndex, 1)
          
          // Add the event to the new date
          if (!newEvents[newDate]) {
            newEvents[newDate] = []
          }
          newEvents[newDate].push(movedEvent)
          break
        }
      }
      
      return newEvents
    })

    setActiveEvent(null)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => (direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)))
  }

  const navigateDay = (direction: "prev" | "next") => {
    setSelectedDay((prev) => addDays(prev, direction === "next" ? 1 : -1))
  }

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day)
    
    // On mobile, also update currentDate to keep week in sync
    if (isMobile) {
      setCurrentDate(day)
    }
  }

  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const dayEvents = events[dateStr] || []
    return dayEvents.sort((a, b) => a.time.localeCompare(b.time))
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <WeekHeader
        weekDays={weekDays}
        selectedDay={selectedDay}
        onDaySelect={handleDaySelect}
        onNavigate={navigateWeek}
        isMobile={isMobile}
      />

      {mounted && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-hidden">
            {isMobile ? (
              <MobileDayView
                selectedDay={selectedDay}
                events={getEventsForDay(selectedDay)}
                onNavigate={navigateDay}
                onEventClick={setSelectedEvent}
              />
            ) : (
              <DesktopWeekView 
                weekDays={weekDays} 
                getEventsForDay={getEventsForDay} 
                onEventClick={setSelectedEvent}
              />
            )}
          </div>

          <DragOverlay>
            {activeEvent && (
              <div className="rotate-3 scale-105">
                <EventCard event={activeEvent} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {!mounted && (
        <div className="flex-1 overflow-hidden">
          {isMobile ? (
            <MobileDayView
              selectedDay={selectedDay}
              events={getEventsForDay(selectedDay)}
              onNavigate={navigateDay}
              onEventClick={setSelectedEvent}
            />
          ) : (
            <DesktopWeekView 
              weekDays={weekDays} 
              getEventsForDay={getEventsForDay} 
              onEventClick={setSelectedEvent}
            />
          )}
        </div>
      )}
    </div>
  )
}
