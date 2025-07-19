"use client"

import { useState, useEffect } from "react";
import { 
  DndContext, 
  type DragEndEvent, 
  DragOverlay, 
  type DragStartEvent, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  TouchSensor 
} from "@dnd-kit/core"
import { WeekHeader } from "./WeekHeader"
import { DesktopWeekView } from "./DesktopWeekView"
import { MobileDayView } from "./MobileDayView"
import { EventCard } from "./EventCard"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useEventsContext } from "@/contexts/EventContext"
import { format } from "date-fns"

export function CalendarKanban() {
  const [hasMounted, setHasMounted] = useState(false);

  const {
    selectedDay,
    events,
    activeEvent,
    weekDays,
    setSelectedDay,
    setActiveEvent,
    setSelectedEvent,
    navigateWeek,
    navigateDay,
    getEventsForDay,
    updateEventDate
  } = useEventsContext()

  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ... (sensors and handlers remain the same) ...
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
  )

  const handleDragStart = (event: DragStartEvent) => {
    console.log("handleDragStart", event)
    const draggedEvent = events.find((e) => e.id === event.active.id)
    setActiveEvent(draggedEvent || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event

    if (!over || !active) {
      setActiveEvent(null)
      return
    }

    let newDate = over.id as string

    if (isMobile) {
      const dayIndex = weekDays.findIndex(day => format(day, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd"))
      const swipeThreshold = 50 // minimum pixels to trigger day change
      
      let newDayIndex = dayIndex
      if (Math.abs(delta.x) > swipeThreshold) {
        if (delta.x > 0) {
          // Swipe right - go to next day
          newDayIndex = Math.min(dayIndex + 1, weekDays.length - 1)
        } else {
          // Swipe left - go to previous day
          newDayIndex = Math.max(dayIndex - 1, 0)
        }
      }
      
      const targetDay = weekDays[newDayIndex]
      if (targetDay) {
        newDate = format(targetDay, "yyyy-MM-dd")
        setSelectedDay(targetDay)
      }
    }

    const eventId = active.id as string

    updateEventDate(eventId, newDate)
    setActiveEvent(null)
  }

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      <WeekHeader
        weekDays={weekDays}
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
        onNavigate={navigateWeek}
      />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-hidden">
          {/* This part now renders safely on the client */}
          {isMobile ? (
            <MobileDayView
              selectedDay={selectedDay}
              events={getEventsForDay(selectedDay)}
              onNavigateDay={navigateDay}
              onNavigateWeek={navigateWeek}
              onEventClick={setSelectedEvent}
            />
          ) : (
            <DesktopWeekView
              weekDays={weekDays}
              getEventsForDay={getEventsForDay}
              onEventClick={setSelectedEvent}
              selectedDay={selectedDay}
            />
          )}
        </div>

        <DragOverlay>
          {activeEvent && (
            <EventCard event={activeEvent} isOverlay />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
