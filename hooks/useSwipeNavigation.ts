import { useState, useCallback, useEffect } from "react";
import { type PanInfo } from "framer-motion";

export function useSwipeNavigation(
  onSwipe: (direction: "prev" | "next") => void,
  selectedDay: Date
) {
  const [dragX, setDragX] = useState(0);
  const [direction, setDirection] = useState(0);
  const [previousSelectedDay, setPreviousSelectedDay] = useState(selectedDay);

  useEffect(() => {
    if (selectedDay.getTime() > previousSelectedDay.getTime()) {
      setDirection(1); // Moving to next day
    } else if (selectedDay.getTime() < previousSelectedDay.getTime()) {
      setDirection(-1); // Moving to previous day
    }
    setPreviousSelectedDay(selectedDay);
  }, [selectedDay, previousSelectedDay]);

  const handlePanEnd = useCallback((event: unknown, info: PanInfo) => {
    const threshold = 100

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiping right (going to previous day)
        onSwipe("prev")
      } else {
        // Swiping left (going to next day)
        onSwipe("next")
      }
    }
    setDragX(0)
  }, [onSwipe])

  return { dragX, direction, handlePanEnd, previousSelectedDay, setPreviousSelectedDay };
}