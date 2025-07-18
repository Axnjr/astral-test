import { useState, useCallback } from 'react'
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO } from 'date-fns'
import { Event, initialEvents, transformEventsData } from '@/lib/events' // Import from lib

export function useEvents() {
    const [currentDate, setCurrentDate] = useState(new Date())
    // The `events` state is now the single source of truth. It's initialized once.
    const [events, setEvents] = useState<Event[]>(() => transformEventsData(initialEvents))
    const [selectedDay, setSelectedDay] = useState<Date>(new Date())
    const [activeEvent, setActiveEvent] = useState<Event | null>(null)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    const navigateWeek = useCallback((direction: 'prev' | 'next') => {
        setCurrentDate((current) => (direction === 'next' ? addWeeks(current, 1) : subWeeks(current, 1)))
    }, [])

    const navigateDay = useCallback((direction: 'prev' | 'next') => {
        setSelectedDay((prev) => addDays(prev, direction === 'next' ? 1 : -1))
    }, [])

    const getEventsForDay = useCallback((date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return events
            .filter((event) => event.date === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time))
    }, [events])

    const updateEventDate = useCallback((eventId: string, newDate: string) => {
        setEvents((prev) =>
            prev.map((event) =>
                event.id === eventId ? { ...event, date: newDate } : event
            )
        )
    }, [])

    const addEvent = useCallback((newEvent: Omit<Event, 'id'>) => {
        const dateStr = format(parseISO(newEvent.date as string), 'yyyy-MM-dd')
        const newEventWithId = {
            ...newEvent,
            id: `event-${dateStr}`,
            imageUrl: "https://framerusercontent.com/images/B0K9QMUiWeDySxhGs5D2pwZro.jpg?scale-down-to=1200",
        }
        console.log("adding event", newEventWithId)
        setEvents((prev) => [...prev, newEventWithId])
    }, [])

    const deleteEvent = useCallback((eventId: string) => {
        setEvents((prev) => prev.filter((event) => event.id !== eventId))
    }, [])

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return {
        currentDate,
        selectedDay,
        events,
        activeEvent,
        selectedEvent,
        weekDays,
        setSelectedDay,
        setActiveEvent,
        setSelectedEvent,
        navigateWeek,
        navigateDay,
        getEventsForDay,
        updateEventDate,
        addEvent,
        deleteEvent
    }
}