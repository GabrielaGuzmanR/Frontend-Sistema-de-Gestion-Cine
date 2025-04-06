"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Ticket, User } from "lucide-react"

export default function ReservationsList() {
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/reservations", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error(`Error al obtener reservas: ${response.status}`)
        }

        const data = await response.json()
        const formattedReservations = data.map((reservation) => ({
          id: reservation.id,
          movieTitle: reservation.Function.Movie.title,
          theater: reservation.Function.Room.name,
          date: reservation.Function.date.split("T")[0], // "YYYY-MM-DD"
          time: reservation.Function.time.slice(0, 5), // "HH:MM"
          seats: reservation.Seats.map((seat) => seat.number.toString()),
          email: reservation.email,
          name: reservation.name, // Añadimos el nombre
        }))

        // Ordenar por fecha (opcional)
        formattedReservations.sort((a, b) => new Date(a.date) - new Date(b.date))

        setReservations(formattedReservations)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const formatDate = (dateString) => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  if (isLoading) {
    return <div className="text-white text-center py-10">Cargando reservas...</div>
  }

  if (error) {
    return <div className="text-red-400 text-center py-10">Error: {error}</div>
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl blur-3xl -z-10 opacity-70" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Reservas Realizadas</h2>
            <p className="text-gray-300 mt-1 text-sm">Visualiza todas las reservas activas</p>
          </div>
          <Badge className="bg-blue-600/20 text-blue-100 border-none px-2 py-1 text-xs">
            Total: {reservations.length} reservas
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((reservation) => (
          <Card
            key={reservation.id}
            className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 rounded-lg group"
          >
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-blue-500/10 border-b border-white/10 p-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-700/20 group-hover:shadow-blue-600/30 transition-all duration-300">
                    <Ticket className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors">
                      {reservation.movieTitle}
                    </CardTitle>
                    <p className="text-gray-300 text-xs mt-0.5">Reserva #{reservation.id}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                >
                  <MapPin className="h-3 w-3 text-blue-300" />
                  <span>{reservation.theater}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/20 p-1.5 rounded-md">
                      <Calendar className="h-3 w-3 text-blue-300" />
                    </div>
                    <span className="text-white text-sm">{formatDate(reservation.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/20 p-1.5 rounded-md">
                      <Clock className="h-3 w-3 text-blue-300" />
                    </div>
                    <span className="text-white text-sm">{reservation.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/20 p-1.5 rounded-md">
                      <User className="h-3 w-3 text-blue-300" />
                    </div>
                    <span className="text-gray-300 text-xs">
                      {reservation.name} ({reservation.email})
                    </span>
                  </div>
                </div>

                <div className="md:ml-auto bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h4 className="font-medium mb-2 text-xs text-white flex items-center gap-1.5">
                    <span className="h-1 w-3 bg-blue-500 rounded-full"></span>
                    Asientos Reservados
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {reservation.seats.map((seat) => (
                      <Badge
                        key={seat}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-white border border-blue-500/30 text-xs px-2 py-0.5"
                      >
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}