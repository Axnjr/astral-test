import { format, addDays, startOfWeek } from "date-fns"

export const eventColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-yellow-500",
    "bg-cyan-500",
  ]

export interface Event {
  id: string
  title: string
  description: string
  imageUrl?: string
  time: string
  date?: string
  color?: string
}

export type EventsByDate = Record<string, Event[]>

const eventTemplates = [
  {
    title: "Coffee Meeting",
    description: "Casual meetup to discuss ideas and catch up.",
    imageUrl: "https://fastly.picsum.photos/id/312/1920/1080.jpg?hmac=OD_fP9MUQN7uJ8NBR7tlii78qwHPUROGgohG4w16Kjw",
  },
  {
    title: "Team Standup",
    description: "Weekly team sync to align on priorities and progress.",
    imageUrl: "http://fastly.picsum.photos/id/737/1920/1080.jpg?hmac=aFzER8Y4wcWTrXVx2wVKSj10IqnygaF33gESj0WGDwI",
  },
  {
    title: "Product Review",
    description: "Comprehensive review of current product features and roadmap.",
    imageUrl: "https://fastly.picsum.photos/id/249/1920/1080.jpg?hmac=cPMNdgGXRh6T_KhRMuaQjRtAx5cWRraELjtL2MHTfYs",
  },
  {
    title: "Client Presentation",
    description: "Presenting quarterly progress and future plans.",
    imageUrl: "https://fastly.picsum.photos/id/908/1920/1080.jpg?hmac=MeG_oA1s75hHAL_4JzCioh6--zyFTWSCTxOhe8ugvXo",
  },
  {
    title: "Yoga Session",
    description: "Relaxing yoga class to reduce stress and improve mindfulness.",
    imageUrl: "https://fastly.picsum.photos/id/392/1920/1080.jpg?hmac=Fvbf7C1Rcozg8EccwYPqsGkk_o6Bld2GQRDPZKWpd7g",
  }
]

const times = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"]

export function generateEventsForWeek(currentDate: Date): EventsByDate {
  const eventsByDate: EventsByDate = {}
  
  // Generate dates for the next 7 days
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentDate, i))
  
  weekDates.forEach((date) => {
    const dateString = format(date, "yyyy-MM-dd")
    
    // Randomly decide how many events to create for this date (0-2)
    const numEvents = Math.floor(Math.random() * 3)
    
    // Create events for this date
    const dateEvents: Event[] = []
    for (let j = 0; j < numEvents; j++) {
      // Randomly select an event template
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      
      const event: Event = {
        id: `event-${dateString}-${j + 1}`,
        ...template,
        time: times[Math.floor(Math.random() * times.length)],
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

export const initialEvents = generateEventsForWeek(startOfWeek(new Date()))