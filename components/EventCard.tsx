"use client"

import { useDraggable } from "@dnd-kit/core"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import type { Event } from "@/lib/events"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface EventCardProps {
  event: Event
  onClick?: () => void
  isDragging?: boolean
}

export function EventCard({ event, onClick, isDragging = false }: EventCardProps) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: event.id,
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleClick = () => {
    // If onClick is provided, call it first
    if (onClick) {
      onClick()
    }
    
    // Then navigate to event details
    router.push(`/events/${event.id}`)
  }

  if (!isClient) {
    return null
  }

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      layoutId={`event-${event.id}`}
      className={`
        rounded-lg border cursor-pointer select-none overflow-hidden
        ${event.color || "bg-blue-500"} text-white
        ${isBeingDragged || isDragging ? "opacity-50 shadow-lg" : "shadow-sm hover:shadow-md"}
        `}
        // transition-shadow duration-200 // Remove as framer-motion will handle transitions
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {event.imageUrl && (
          <motion.div variants={itemVariants} className="h-24 w-full overflow-hidden">
            <Image 
              width={100} 
              height={100} 
              src={event.imageUrl || "/placeholder.svg"} 
              alt={event.title} 
              className="w-full h-full object-cover" 
              priority 
              unoptimized 
            />
          </motion.div>
        )}

        <div className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <motion.h3 variants={itemVariants} className="font-medium text-sm truncate">{event.title}</motion.h3>
              <motion.p variants={itemVariants} className="text-xs opacity-90 mt-1 line-clamp-2">{event.description}</motion.p>
            </div>
          </div>

          <motion.div variants={itemVariants} className="flex items-center mt-2 text-xs opacity-90">
            <Clock className="h-3 w-3 mr-1" />
            {event.time}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
