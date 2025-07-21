"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { Event } from '@/lib/events'
import { useEventsContext } from "@/contexts/EventContext"

interface AddEventProps {
  event: Date
  onClose: () => void
}

export function AddEvent({ event, onClose }: AddEventProps) {
  const { addEvent } = useEventsContext()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState(format(new Date(), "HH:mm"))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert("Event name is required.")
      return
    }

    const newEvent: Omit<Event, 'id'> = {
      title,
      description,
      date: format(event, 'yyyy-MM-dd'),
      time,
      color: 'blue',
    }

    addEvent(newEvent)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4"
      onClick={onClose}
      transition={{ type: "spring", stiffness: 500, damping: 30, duration: 1 }}
    >
      <motion.div
        layoutId={`event-card-${format(event, "yyyy-MM-dd")}`}
        className="w-full max-w-md rounded-xl p-6 text-white relative bg-gradient-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
        >
          <X className="h-5 w-5" />
        </motion.button>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-bold">{format(event, "EEEE, MMMM d")}</h2>
          <input type="text" placeholder="Event Name" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded-md bg-white/10 placeholder-white/70 text-white outline-none focus:ring-2 focus:ring-white/50" autoFocus />
          <textarea placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 rounded-md bg-white/10 placeholder-white/70 text-white outline-none focus:ring-2 focus:ring-white/50 h-24 resize-none" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 rounded-md bg-white/10 text-white outline-none focus:ring-2 focus:ring-white/50" />
          <button type="submit" className="bg-white text-blue-600 font-bold px-4 py-2 rounded-md w-full hover:bg-gray-200 transition-colors">Add Event</button>
        </form>
      </motion.div>
    </motion.div>
  )
}
