'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'  
import { format, parseISO } from 'date-fns'
import { use } from 'react'
import { Button } from '@/components/ui/button'
import { useEventsContext } from '@/contexts/EventContext'

function EventDetailContent({ eventId }: { eventId: string }) {
  const { events } = useEventsContext()
  const event = events.find(e => e.id === eventId)

  if (!event) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center min-h-screen bg-gray-100"
      >
        <div className="text-center">
          <p>Event not found</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Go back to calendar
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full relative"
      layout
      layoutId={`event-${event.id}`}
    >
      <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute -bottom-4 left-0 md:top-0 md:right-0 p-4"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Calendar
          </Link>
        </motion.div>
      <div className="min-h-screen flex flex-col md:flex-row">
        {event.imageUrl && (
          <motion.div
            layout
            layoutId={`event-image-${event.id}`}
            className="w-full h-64 relative md:w-1/2 md:h-auto"
          >
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        )}
        <motion.div 
          layoutId={`event-title-${event.id}`}
          className="p-8 bg-white md:w-1/2 flex flex-col justify-center"
        >
          <h1 className="text-5xl tracking-tighter font-black text-gray-900 mb-4">
            {event.title}
          </h1>
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
              className="space-y-4 text-gray-700 px-2"
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                <span>
                  {event.date
                    ? format(parseISO(event.date), 'EEEE, MMMM d, yyyy')
                    : 'Date not specified'}
                </span>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-green-500" />
                <span>{event.time}</span>
              </div>

              <p className="text-gray-600 text-lg tracking-tight font-medium leading-relaxed">{event.description}</p>

              <Button className="w-full">
                <Calendar className="h-5 w-5 text-white" />
                <span className="text-white">
                  Add to Calendar
                </span>
              </Button>
            </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading event details...</p>
      </div>
    </motion.div>
  )
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = use(params)

  return (
    <Suspense fallback={<LoadingState />}>
      <EventDetailContent eventId={eventId} />
    </Suspense>
  )
}
