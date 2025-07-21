import { useState, useCallback, useMemo } from 'react'
import { format, startOfWeek, addDays, addWeeks, subWeeks, subDays } from 'date-fns'
import { Event, getRandomImage, intiateEventFetch } from '@/lib/events'
import { v4 as uuidv4 } from 'uuid'

export function useEvents() {
    const [currentDate, setCurrentDate] = useState(new Date())

    const getMemoizedEvents = useMemo(() => {
        return intiateEventFetch(currentDate)
    }, [currentDate])

    const [events, setEvents] = useState<Event[]>(getMemoizedEvents)
    const [selectedDay, setSelectedDay] = useState<Date>(currentDate)
    const [activeEvent, setActiveEvent] = useState<Event | null>(null)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    const navigateWeek = useCallback((direction: 'prev' | 'next') => {
        const newDate = direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1)
        const newWeekStart = startOfWeek(newDate, { weekStartsOn: 0 })
        setCurrentDate(newDate)
        setSelectedDay(newWeekStart)
    }, [currentDate])

    const navigateDay = useCallback((direction: 'prev' | 'next') => {
        const newDay = direction === 'next' ? addDays(selectedDay, 1) : subDays(selectedDay, 1)
        setSelectedDay(newDay)
        
        // Update currentDate if we've moved to a different week
        const currentWeekStart = startOfWeek(selectedDay, { weekStartsOn: 0 })
        const newWeekStart = startOfWeek(newDay, { weekStartsOn: 0 })
        
        if (currentWeekStart.getTime() !== newWeekStart.getTime()) {
            setCurrentDate(newDay)
        }
    }, [selectedDay])

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

    const addEvent = useCallback(async (newEvent: Omit<Event, 'id'>) => {
        const newEventWithId = {
            ...newEvent,
            id: `event-${uuidv4()}`,
            imageUrl: getRandomImage(newEvent.title.length % 20 + 4),
        }
        console.log("adding event", newEventWithId)
        setEvents((prev) => [...prev, newEventWithId])
    }, [])

    const deleteEvent = useCallback((eventId: string) => {
        setEvents((prev) => prev.filter((event) => event.id !== eventId))
    }, [])

    const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate])
    const weekDays = useMemo(() => 
        Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), 
        [weekStart]
    )

    // Memoize the return object to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
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
    }), [
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
    ])

    return contextValue
}