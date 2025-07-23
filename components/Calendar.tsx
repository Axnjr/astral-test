"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { EventModal } from "./EventModal"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useEventsContext } from "@/contexts/EventContext"
import { format } from "date-fns"

export function Calendar() {
  const [hasMounted, setHasMounted] = useState(false);

  const {
    selectedDay,
    events,
    activeEvent,
    weekDays,
    setSelectedDay,
    setActiveEvent,
    updateEventDate,
    selectedEvent,
    setSelectedEvent,
    deleteEvent
  } = useEventsContext()

  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log("handleDragStart", event)
    const draggedEvent = events.find((e) => e.id === event.active.id)
    setActiveEvent(draggedEvent || null)
  }, [events, setActiveEvent])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
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
  }, [isMobile, weekDays, selectedDay, setSelectedDay, updateEventDate, setActiveEvent])

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null)
  }, [setSelectedEvent])

  const handleDeleteEvent = useCallback((eventId: string) => {
    deleteEvent(eventId)
  }, [deleteEvent])

  const dragOverlay = useMemo(() => {
    if (!activeEvent) return null
    return <EventCard event={activeEvent} isOverlay />
  }, [activeEvent])

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-surface overflow-x-hidden">
      <WeekHeader />
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-hidden">
          {isMobile ? (
            <MobileDayView />
          ) : (
            <DesktopWeekView />
          )}
        </div>
        <DragOverlay {...(isMobile && { dropAnimation: null })}>
          {dragOverlay}
        </DragOverlay>
      </DndContext>
      
      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={handleCloseModal}
        onDelete={handleDeleteEvent}
      />
    </div>
  )
}
