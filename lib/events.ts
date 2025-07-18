import { format, addDays, startOfWeek, endOfWeek } from "date-fns"
import { v4 as uuidv4 } from 'uuid'

export interface Event {
  id: string
  title: string
  description: string
  imageUrl?: string
  time: string
  duration?: number
  // Unicode Technical Standard #35
  date?: string
  color?: string
}

export type EventsByDate = Record<string, Event[]>

const eventTemplates = [
  {
    title: "Coffee Meeting",
    description: "Casual meetup to discuss ideas and catch up.",
    imageUrl: "https://examples.motion.dev/photos/app-store/c.jpg",
  },
  {
    title: "Team Standup",
    description: "Weekly team sync to align on priorities and progress.",
    imageUrl: "https://examples.motion.dev/photos/app-store/a.jpg",
  },
  {
    title: "Product Review",
    description: "Comprehensive review of current product features and roadmap.",
    imageUrl: "https://examples.motion.dev/photos/app-store/d.jpg",
  },
  {
    title: "Client Presentation",
    description: "Presenting quarterly progress and future plans.",
    imageUrl: "https://framerusercontent.com/images/B0K9QMUiWeDySxhGs5D2pwZro.jpg?scale-down-to=1200",
  },
  {
    title: "Yoga Session",
    description: "Relaxing yoga class to reduce stress and improve mindfulness.",
    imageUrl: "https://framerusercontent.com/images/wpo2YWgUBC1S6zOjEXldRDKelKA.jpg?scale-down-to=1200",
  }
]

const times = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"]

export function generateEventsForWeek(currentDate: Date): EventsByDate {
  const eventsByDate: EventsByDate = {}
  
  const start = startOfWeek(currentDate)
  const end = endOfWeek(currentDate)
  const weekDates = []
  for (let date = start; date <= end; date = addDays(date, 1)) {
    weekDates.push(date)
  }
  
  weekDates.forEach((date) => {
    const dateString = format(date, "yyyy-MM-dd")
    
    const numEvents = Math.floor(Math.random() * 2)
    
    const dateEvents: Event[] = []
    for (let j = 0; j < numEvents; j++) {
      // Randomly select an event template
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      const time = times[Math.floor(Math.random() * times.length)]
      
      const event: Event = {
        id: `event-${uuidv4()}`,
        ...template,
        time: time,
        date: dateString
      }
      
      dateEvents.push(event)
    }
    
    // Only add the date to eventsByDate if there are events
    if (dateEvents.length > 0) {
      eventsByDate[dateString] = dateEvents
    }
  })
  
  return eventsByDate
}

export const initialEvents = generateEventsForWeek(new Date())

// Utility functions for event management
export function transformEventsData(eventsByDate: EventsByDate): Event[] {
  const allEvents: Event[] = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(eventsByDate).forEach(([_, dayEvents]) => {
    allEvents.push(...dayEvents)
  })
  return allEvents
}