"use client"

import { useState, useEffect } from "react"
import { EventCard } from "./event-card"
import { AlertCircle } from "lucide-react"
import axios from "axios"

interface Event {
  id: number
  title: string
  description: string
  date: string
  location?: string
  capacity?: number
  registered?: number
  category?: string
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("[v0] Attempting to fetch events from API...")
        const response = await axios.get("http://127.0.0.1:8000/events")
        console.log("[v0] API response received:", response.data)
        setEvents(response.data)
      } catch (err) {
        console.log("[v0] API error details:", err)
        if (axios.isAxiosError(err)) {
          if (err.code === "ERR_NETWORK") {
            setError("Cannot connect to API server. Make sure backend is running on http://127.0.0.1:8000")
          } else if (err.response?.status === 404) {
            setError("API endpoint not found. Check if /events endpoint exists on your backend.")
          } else if (err.response?.status && err.response.status >= 500) {
            setError("Server error. Check backend logs for details.")
          } else {
            setError(`API Error: ${err.response?.status} - ${err.response?.statusText}`)
          }
        } else {
          setError("Failed to load events. Please try again later.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3 border rounded p-4">
            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-20 w-full bg-gray-300 rounded"></div>
            <div className="h-10 w-full bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500">No events found</h3>
        <p className="text-sm text-gray-400 mt-2">Check back later for upcoming events!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
