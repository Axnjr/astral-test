'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { initialEvents } from '@/lib/events'
import { format, parseISO } from 'date-fns'
import { use } from 'react'

function fetchEventDetails(eventId: string) {
  const allEvents = Object.values(initialEvents).flat()
  const foundEvent = allEvents.find(e => e.id === eventId)
  return foundEvent
}

function EventDetailContent({ eventId }: { eventId: string }) {
  const event = fetchEventDetails(eventId)

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-white"
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Calendar
          </Link>
        </motion.div>

        <motion.div
          layoutId={`event-${event.id}`}
          className={`rounded-2xl overflow-hidden shadow-lg ${event.color}`}
        >
          {event.imageUrl && (
            <motion.div
              layoutId={`event-image-${event.id}`}
              className="w-full h-64 relative"
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

          <div className="p-6 bg-white">
            <motion.h1
              layoutId={`event-title-${event.id}`}
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              {event.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 text-gray-700"
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

              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </motion.div>
          </div>
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
