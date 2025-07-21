"use client"

import { useDraggable } from "@dnd-kit/core"
import { motion, type HTMLMotionProps } from "framer-motion"
import { Clock } from "lucide-react"
import type { Event } from "@/lib/events"
import Image from "next/image"
import { useMemo, useState, memo, useCallback } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface EventCardProps {
  event: Event
  onClick?: () => void
  isOverlay?: boolean
  enableLayoutId?: boolean
}

export const EventCard = memo(function EventCard({ 
  event, 
  onClick, 
  isOverlay = false,
  enableLayoutId = false
}: EventCardProps) {
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

  const handleClick = useCallback(() => {
    if (onClick) onClick()
  }, [onClick])

  const handleTouchStart = useCallback(() => {
    setIsDraggingMobile(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDraggingMobile(false)
  }, [])

  const cardLayoutId = useMemo(() => `event-${event.id}`, [event.id])
  const imageLayoutId = useMemo(() => `event-image-${event.id}`, [event.id])
  const titleLayoutId = useMemo(() => `event-title-${event.id}`, [event.id])

  const motionProps: HTMLMotionProps<"div"> = useMemo(() => {
    if (isOverlay) {
      return {
        className: "rounded-lg border select-none overflow-hidden bg-gradient-active text-white shadow-lg cursor-grabbing",
        animate: {
          scale: 1.05,
          boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
        },
        transition: { duration: 0.2, ease: "easeInOut" }
      }
    }

    return {
      ref: setNodeRef,
      style: {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0 : 1,
      },
      className: "rounded-lg border cursor-pointer select-none overflow-hidden bg-gradient-active text-white shadow-sm hover:shadow-md",
      layout: isMobile,
      ...(enableLayoutId && { layout: true, layoutId: cardLayoutId }),
      onClick: handleClick,
      animate: {
        scale: isDraggingMobile ? 1.05 : 1,
        boxShadow: isDraggingMobile ? "0px 0px 15px rgba(0,0,0,0.2)" : "0px 0px 10px rgba(0,0,0,0.1)",
      },
      transition: { duration: 0.2, ease: "easeInOut" },
      whileHover: !isMobile ? { scale: 1.02 } : undefined,
      ...listeners,
      ...attributes,
      onTouchStartCapture: handleTouchStart,
      onTouchEndCapture: handleTouchEnd,
    }
  }, [
    isOverlay, setNodeRef, transform, isDragging, isMobile, enableLayoutId, cardLayoutId,
    handleClick, isDraggingMobile, listeners, attributes, handleTouchStart, handleTouchEnd
  ])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }), [])

  return (
    <>
      <motion.div {...motionProps}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {event.imageUrl && (
            <motion.div
              {...(enableLayoutId && { layout: true, layoutId: imageLayoutId })}
              className="h-32 w-full overflow-hidden"
            >
              <Image width={100} height={150} src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" priority unoptimized />
            </motion.div>
          )}
          <motion.div
            className="p-3"
            variants={{
              show: {
                opacity: 1,
                transition: {
                  duration: 0.5,
                  delay: 0.3
                }
              },
              hidden: {
                opacity: 0,
                transition: {
                  duration: 0.1
                }
              }
            }}
            initial="show"
            {...(enableLayoutId && { layout: true, layoutId: titleLayoutId })}
          >
            <div className="flex-col items-start justify-between w-full">
              <div className="flex flex-row md:flex-col justify-between md:space-y-1 w-full">
                <h3 className="font-medium text-sm truncate tracking-tighter">
                  {event.title}
                </h3>
                <div className="flex items-center text-xs opacity-90 tracking-tighter font-semibold">
                  <Clock className="h-3 w-3 mr-0.5" />
                  {event.time}
                </div>
              </div>
              <p className="text-xs opacity-90 mt-2 line-clamp-2">
                {event.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
})