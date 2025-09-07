"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, Clock, AlertCircle } from "lucide-react"
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

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      await axios.post("http://127.0.0.1:8000/register", {
        event_id: event.id,
        student_id: 1,
      })
      setIsRegistered(true)
      alert(`Registration Successful!\nYou've been registered for ${event.title}`)
    } catch (error) {
      alert("Registration Failed. Please try again later.")
    } finally {
      setIsRegistering(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <div className="flex items-start justify-between pb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(event.date)}</span>
            </div>
          </div>
        </div>
        {event.category && (
          <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded ml-2">
            {event.category}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed flex-grow">{event.description}</p>

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
        {event.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        )}
        {event.capacity && (
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>
              {event.registered || 0}/{event.capacity}
            </span>
          </div>
        )}
      </div>

      <button
        className={`mt-3 w-full py-2 rounded ${
          isRegistered
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        onClick={handleRegister}
        disabled={isRegistering || isRegistered}
      >
        {isRegistering ? "Registering..." : isRegistered ? "Registered ✓" : "Register"}
      </button>
    </div>
  )
}

export function EventPages() {
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
            setError(
              "Cannot connect to the API server. Make sure your backend is running on http://127.0.0.1:8000"
            )
          } else if (err.response?.status === 404) {
            setError("API endpoint not found. Check if /events endpoint exists on your backend.")
          } else if (err.response?.status && err.response.status >= 500) {
            setError("Server error. Check your backend logs for details.")
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-64 bg-gray-300 mb-2 rounded"></div>
          <div className="h-4 w-96 bg-gray-300 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 border rounded p-4 bg-gray-300"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-red-50 rounded text-red-700 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
        <p className="text-gray-600 mt-2">
          Discover and register for exciting events happening on campus
        </p>
      </div>

      <section id="events">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500">No events found</h3>
            <p className="text-sm text-gray-400 mt-2">Check back later for upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
