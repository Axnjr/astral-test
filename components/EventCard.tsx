"use client"

import { useDraggable } from "@dnd-kit/core"
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion"
import { ArrowLeft, Clock } from "lucide-react"
import type { Event } from "@/lib/events"
import Image from "next/image"
import { useMemo, useState } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Button } from "./ui/button"

interface EventCardProps {
  event: Event
  onClick?: () => void
  isOverlay?: boolean
  deleteEvent?: (eventId: string) => void
}

export function EventCard({ 
  event, 
  onClick, 
  isOverlay = false, 
  deleteEvent
}: EventCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isDraggingMobile, setIsDraggingMobile] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

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
    setModalOpen(true)
  }

  // Only apply layoutId on mobile for exit animations
  // On desktop, we don't want exit animations, only modal transitions
  const cardLayoutId = isMobile ? `event-card-${event.id}` : undefined
  const imageLayoutId = isMobile ? `event-image-${event.id}` : undefined

  const motionProps: HTMLMotionProps<"div"> = isOverlay
    ? {
      className: "rounded-lg border select-none overflow-hidden bg-gradient-primary text-white opacity-75 shadow-lg cursor-grabbing",
      animate: {
        scale: 1.05,
        boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
      },
      transition: { duration: 0.2 }
    }
    : {
      ref: setNodeRef,
      style: {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        visibility: isDragging ? 'hidden' : 'visible',
      },
      className: "rounded-lg border cursor-pointer select-none overflow-hidden bg-gradient-primary text-white shadow-sm hover:shadow-md",
      layout: isMobile, // Only enable layout on mobile for exit animations
      layoutId: cardLayoutId,
      onClick: handleClick,
      animate: {
        scale: isDraggingMobile ? 1.05 : 1,
        boxShadow: isDraggingMobile ? "0px 0px 15px rgba(0,0,0,0.2)" : "0px 0px 10px rgba(0,0,0,0.1)",
      },
      transition: { duration: 0.2 },
      whileHover: !isMobile ? { scale: 1.02 } : undefined,
      ...listeners,
      ...attributes,
      onTouchStartCapture: () => setIsDraggingMobile(true),
      onTouchEndCapture: () => setIsDraggingMobile(false),
      onTouchCancelCapture: () => setIsDraggingMobile(false)
    }

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
              layoutId={imageLayoutId}
              layout={isMobile}
              className="h-24 w-full overflow-hidden"
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
            animate={modalOpen ? 'hidden' : 'show'}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 max-w-32">
                <h3 className="font-medium text-sm truncate">
                  {event.title}
                </h3>
                <p className="text-xs opacity-90 mt-1 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs opacity-90">
              <Clock className="h-3 w-3 mr-1" />
              {event.time}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="w-full h-full flex flex-col md:flex-row fixed top-0 left-0 bg-white z-20 overflow-y-auto"
            onClick={() => setModalOpen(false)}
            layoutId={cardLayoutId || `event-card-${event.id}`} // Always use layoutId for modal transition
            layout={isMobile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative w-full h-full flex flex-col md:flex-row">
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                setModalOpen(false)
              }}
              className="absolute bottom-3 left-3 md:top-3 md:right-3 p-1 w-auto h-12
              inline-flex items-center text-gray-600 hover:text-gray-900 mb-2 justify-end"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Calendar
            </motion.button>
            <motion.div
              layoutId={imageLayoutId || `event-image-${event.id}`} // Always use layoutId for modal transition
              layout={isMobile}
              className="h-64 w-full md:w-1/2 md:h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.4,
                  delay: 0.1
                }
              }}
            >
              <Image
                src={event.imageUrl as string}
                alt={event.title}
                width={400}
                height={250}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
            <div className="flex-1 relative flex flex-col justify-start md:justify-center p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, transform: 'translateY(20px)' }}
                animate={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: {
                    duration: 0.5,
                    delay: 0.4
                  }
                }}
              >
                <h1 className="text-gray-800 text-3xl md:text-5xl tracking-tighter font-black mb-6">
                  {event.title}
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, transform: 'translateY(20px)' }}
                animate={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: {
                    duration: 0.5,
                    delay: 0.5
                  }
                }}
              >
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-green-500" />
                    <span className="text-gray-700 text-lg">{event.time}</span>
                  </div>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    {event.description}, adding some more text just for better looking pls ignore after this lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                  </p>
                  <Button 
                    className="w-full md:w-auto md:px-8 bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => {
                      deleteEvent?.(event.id)                      
                      setModalOpen(false)
                    }}
                  >
                    Cancel Event
                  </Button>
                </div>
              </motion.div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}