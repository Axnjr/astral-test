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

// Array of 20 diverse image URLs
const imageUrls = [
  "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1744018195752-276f4f77cc7a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1734683088770-1240dd2b7fde?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1752542362589-a5668de3b1c1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3N3x8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1752625323773-3e4de726adcd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1752588975082-5e68d7dfa5e7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1N3x8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1682687981907-170c006e3744?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MXx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1752482987681-5a5fc08a9f7b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1743456117605-e673068f0fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1744144501263-d51045ebec13?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1751800932672-2c3743e77062?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]

const eventTemplates = [
  {
    title: "Coffee Meeting",
    description: "Casual meetup to discuss ideas and catch up.",
  },
  {
    title: "Team Standup",
    description: "Weekly team sync to align on priorities and progress.",
  },
  {
    title: "Product Review",
    description: "Comprehensive review of current product features and roadmap.",
  },
  {
    title: "Client Presentation",
    description: "Presenting quarterly progress and future plans.",
  },
  {
    title: "Yoga Session",
    description: "Relaxing yoga class to reduce stress and improve mindfulness.",
  }
]

const times = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"]

/**
 * Get a random image URL from the predefined list
 * @param seed Optional seed for consistent randomness
 * @returns A random image URL
 */
export function getRandomImage(seed?: number): string {
  // If seed is provided, use a seeded random for consistent selection
  if (seed !== undefined) {
    const seededIndex = Math.floor(Math.abs(Math.sin(seed)) * imageUrls.length)
    return imageUrls[seededIndex]
  }
  
  // Otherwise, use pure random selection
  return imageUrls[Math.floor(Math.random() * imageUrls.length)]
}

export function generateEventsForWeek(currentDate: Date): EventsByDate {
  const eventsByDate: EventsByDate = {}
  
  const start = startOfWeek(currentDate)
  const end = endOfWeek(currentDate)
  const weekDates = []
  for (let date = start; date <= end; date = addDays(date, 1)) {
    weekDates.push(date)
  }
  
  weekDates.forEach((date, dateIndex) => {
    const dateString = format(date, "yyyy-MM-dd")
    
    const numEvents = Math.floor(Math.random() * 2)
    
    const dateEvents: Event[] = []
    for (let j = 0; j < numEvents; j++) {
      // Randomly select an event template
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      const time = times[Math.floor(Math.random() * times.length)]
      
      const event: Event = {
        ...template,
        id: `event-${uuidv4()}`,
        time: time,
        date: dateString,
        imageUrl: getRandomImage(dateIndex + j)  // Use a seed for consistent image selection
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

// Utility functions for event management
export function transformEventsData(eventsByDate: EventsByDate): Event[] {
  const allEvents: Event[] = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(eventsByDate).forEach(([_, dayEvents]) => {
    allEvents.push(...dayEvents)
  })
  return allEvents
}


export function intiateEventFetch(currentDate: Date) {
  const eventsByDate = generateEventsForWeek(currentDate)
  return transformEventsData(eventsByDate)
}