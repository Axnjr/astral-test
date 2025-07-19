"use client"

import { useDraggable } from "@dnd-kit/core"
import { motion, type HTMLMotionProps } from "framer-motion"
import { Clock } from "lucide-react"
import type { Event } from "@/lib/events"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface EventCardProps {
  event: Event
  onClick?: () => void
  isOverlay?: boolean
}

export function EventCard({ event, onClick, isOverlay = false }: EventCardProps) {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isDraggingMobile, setIsDraggingMobile] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: event.id
  })

  const handleClick = () => {
    if (onClick) onClick()
    router.push(`/events/${event.id}`)
  }

  const motionProps: HTMLMotionProps<"div"> = isOverlay
    ? {
      className: "rounded-lg border select-none overflow-hidden bg-blue-500 text-white opacity-75 shadow-lg cursor-grabbing",
      animate: {
        scale: 1.05,
        boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
      },
      transition: {
        duration: 0.2,
      },
      // layoutId: `event-card-${event.id}`,
    }
    : {
      ref: setNodeRef,
      style: {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        visibility: isDragging ? 'hidden' : 'visible',
      },
      className: "rounded-lg border cursor-pointer select-none overflow-hidden bg-blue-500 text-white shadow-sm hover:shadow-md",
      layout: true,
      // layoutId: `event-card-${event.id}`,
      onClick: handleClick,
      animate: {
        scale: isDraggingMobile ? 1.05 : 1,
        boxShadow: isDraggingMobile ? "0px 0px 15px rgba(0,0,0,0.2)" : "0px 0px 10px rgba(0,0,0,0.1)",
      },
      transition: {
        duration: 0.2,
      },
      whileHover: !isMobile ? { scale: 1.02 } : undefined,
      ...listeners,
      ...attributes,
      onTouchStartCapture: () => {
        setIsDraggingMobile(true)
      },
      onTouchEndCapture: () => {
        setIsDraggingMobile(false)
      },
      onTouchCancelCapture: () => {
        setIsDraggingMobile(false)
      }
    }

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }), [])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }), [])

  return (
    <motion.div {...motionProps}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {event.imageUrl && (
          <motion.div
            // {...(!isOverlay && { layoutId: `event-image-${event.id}` })}
            variants={itemVariants}
            className="h-24 w-full overflow-hidden"
          >
            <Image width={100} height={100} src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" priority unoptimized/>
          </motion.div>
        )}
        <div className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 max-w-32">
              <motion.h3
                // {...(!isOverlay && { layoutId: `event-title-${event.id}` })}
                variants={itemVariants}
                className="font-medium text-sm truncate"
              >
                {event.title}
              </motion.h3>
              <motion.p variants={itemVariants} className="text-xs opacity-90 mt-1 line-clamp-2">
                {event.description}
              </motion.p>
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