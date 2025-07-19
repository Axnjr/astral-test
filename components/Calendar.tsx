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
    if (isMobile) return
    const draggedEvent = events.find((e) => e.id === event.active.id)
    setActiveEvent(draggedEvent || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (isMobile) return
    const { active, over } = event

    if (!over || !active) {
      setActiveEvent(null)
      return
    }

    const eventId = active.id as string
    const newDate = over.id as string

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
              onNavigate={navigateDay}
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
          {activeEvent && !isMobile && (
            <EventCard event={activeEvent} isOverlay />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
