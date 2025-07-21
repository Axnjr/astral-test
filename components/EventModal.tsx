"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import type { Event } from "@/lib/events"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Button } from "./ui/button"
import { parseISO, format } from "date-fns"

interface EventModalProps {
    event: Event | null
    isOpen: boolean
    onClose: () => void
    onDelete?: (eventId: string) => void
}

export function EventModal({ event, isOpen, onClose, onDelete }: EventModalProps) {
    const isMobile = useMediaQuery("(max-width: 768px)")

    if (!event) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="w-full h-full flex flex-col md:flex-row fixed top-0 left-0 bg-white z-20 overflow-y-auto"
                    onClick={onClose}
                    layoutId={`event-${event.id}`} // Match the card's layoutId for smooth transition
                    layout={isMobile}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="relative w-full h-full flex flex-col md:flex-row">
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation()
                                onClose()
                            }}
                            className="absolute bottom-3 left-3 md:top-3 md:right-3 p-1 w-auto h-12
              inline-flex items-center text-gray-600 hover:text-gray-900 mb-2 justify-end"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Calendar
                        </motion.button>
                        <motion.div
                            layoutId={`event-image-${event.id}`} // Match the card's image layoutId
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
                                unoptimized
                                quality={100}
                            />
                        </motion.div>
                        <div className="flex-1 relative flex flex-col justify-start md:justify-center p-6 md:p-8">
                            <motion.div
                                layoutId={`event-title-${event.id}`} // Match the card's title layoutId
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
                                <div className="space-y-4">
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
                                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                        {event.description}, adding some more text just for better looking pls ignore after this lorem ipsum dolor.
                                    </p>
                                    <Button
                                        className="w-full md:w-auto md:px-8 bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => {
                                            onDelete?.(event.id)
                                            onClose()
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
    )
}
