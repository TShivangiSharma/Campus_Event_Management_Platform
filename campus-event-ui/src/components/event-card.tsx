"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
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

export function EventCard({ event }: EventCardProps) {
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
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        {event.category && (
          <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
            {event.category}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-700 flex-grow">{event.description}</p>

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatTime(event.date)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
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
        className={`mt-6 w-full py-2 rounded ${
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
