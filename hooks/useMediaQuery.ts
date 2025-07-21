"use client"

import { useMemo } from "react"

// Efficient memoized media query hook
export function useMediaQuery(query: string): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  }, [query])
}
