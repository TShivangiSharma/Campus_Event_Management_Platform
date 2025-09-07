import { Navbar } from "./components/navbar"
import { EventsList } from "./components/events-list"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">Campus Events</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Discover and register for exciting events happening on campus
          </p>
        </div>

        <section id="events">
          <EventsList />
        </section>
      </main>
    </div>
  )
}
