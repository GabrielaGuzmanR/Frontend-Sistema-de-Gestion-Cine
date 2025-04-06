"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, MapPin, Calendar, Film, Clock, ArrowRight } from "lucide-react"
import AddTheaterDialog from "@/app/theaters/add-theater-dialog"
import AddFunctionDialog from "@/app/theaters/add-function-dialog"

export default function TheatersList() {
  const [theaters, setTheaters] = useState([])
  const [movies, setMovies] = useState([])
  const [isAddTheaterOpen, setIsAddTheaterOpen] = useState(false)
  const [isAddFunctionOpen, setIsAddFunctionOpen] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const roomsResponse = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/rooms", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (!roomsResponse.ok) throw new Error(`Error al obtener salas: ${roomsResponse.status}`)
      const roomsData = await roomsResponse.json()

      const functionsResponse = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/functions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (!functionsResponse.ok) throw new Error(`Error al obtener funciones: ${functionsResponse.status}`)
      const functionsData = await functionsResponse.json()

      const moviesResponse = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/movies", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (!moviesResponse.ok) throw new Error(`Error al obtener películas: ${moviesResponse.status}`)
      const moviesData = await moviesResponse.json()
      setMovies(moviesData.map((m) => ({ id: m.id, title: m.title })))

      const theatersWithSchedules = roomsData.map((room) => {
        const schedules = functionsData
          .filter((func) => func.roomId === room.id)
          .map((func) => ({
            id: func.id,
            movieId: func.movieId,
            movieTitle: func.Movie.title,
            time: func.time.slice(0, 5),
            date: func.date.split("T")[0],
          }))
        return {
          id: room.id,
          name: room.name,
          capacity: Number(room.capacity),
          schedules: schedules || [],
        }
      })

      setTheaters(theatersWithSchedules)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddTheater = (newTheater) => {
    setTheaters((prevTheaters) => [...prevTheaters, newTheater])
  }

  const handleAddFunction = (newFunction) => {
    setTheaters((prevTheaters) => {
      return prevTheaters.map((theater) =>
        theater.id === selectedRoomId
          ? { ...theater, schedules: [...theater.schedules, newFunction] }
          : theater
      )
    })
    fetchData()
  }

  const openAddFunctionDialog = (roomId) => {
    setSelectedRoomId(roomId)
    setIsAddFunctionOpen(true)
  }

  const groupSchedulesByDate = (schedules) => {
    const grouped = {}
    schedules.forEach((schedule) => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = []
      }
      grouped[schedule.date].push(schedule)
    })
    return grouped
  }

  const formatDate = (dateString) => {
    const options = { weekday: "long", day: "numeric", month: "long" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  if (isLoading) {
    return <div className="text-white text-center py-10">Cargando salas...</div>
  }

  if (error) {
    return <div className="text-red-400 text-center py-10">Error: {error}</div>
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl blur-3xl -z-10 opacity-70" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Salas Disponibles</h2>
            <p className="text-gray-300 mt-2">Gestiona las salas y sus horarios de proyección</p>
          </div>
          <Button
            onClick={() => setIsAddTheaterOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-700/10 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar Sala
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters.map((theater) => (
          <Card
            key={theater.id}
            className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 rounded-lg group"
          >
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-blue-500/10 border-b border-white/10 p-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-700/20 group-hover:shadow-blue-600/30 transition-all duration-300">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors">
                      {theater.name}
                    </CardTitle>
                    <p className="text-gray-300 text-xs mt-0.5">ID: {theater.id}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                >
                  <Users className="h-3 w-3 text-blue-300" />
                  <span>
                    Capacidad: <span className="font-bold">{theater.capacity}</span>
                  </span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <h3 className="font-medium mb-3 text-md flex items-center gap-1.5 text-white border-b border-white/10 pb-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span>Horarios Programados</span>
                <Badge className="ml-1.5 bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border-none text-xs">
                  {theater.schedules.length}
                </Badge>
              </h3>

              {theater.schedules.length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(groupSchedulesByDate(theater.schedules)).map(([date, schedules]) => (
                    <div key={date} className="space-y-2">
                      <h4 className="text-gray-200 font-medium flex items-center gap-1.5 text-sm">
                        <Calendar className="h-3 w-3 text-blue-400" />
                        {formatDate(date)}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {schedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="flex justify-between items-center p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group/item"
                          >
                            <div className="flex items-start gap-2">
                              <div className="bg-blue-500/20 p-1.5 rounded-md">
                                <Film className="h-4 w-4 text-blue-300" />
                              </div>
                              <div>
                                <p className="font-medium text-white group-hover/item:text-blue-100 transition-colors text-sm">
                                  {schedule.movieTitle}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-300 mt-0.5">
                                  <Clock className="h-3 w-3" />
                                  <span>{schedule.time}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full p-1"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-white/5 rounded-lg text-center border border-dashed border-white/20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-300 text-sm">No hay horarios programados para esta sala</p>
                </div>
              )}
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white text-xs"
                  onClick={() => openAddFunctionDialog(theater.id)}
                >
                  <Plus className="h-3 w-3 mr-1" /> Agregar Horario
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddTheaterDialog
        open={isAddTheaterOpen}
        onOpenChange={setIsAddTheaterOpen}
        onAddTheater={handleAddTheater}
      />
      <AddFunctionDialog
        open={isAddFunctionOpen}
        onOpenChange={setIsAddFunctionOpen}
        onAddFunction={handleAddFunction}
        roomId={selectedRoomId}
        movies={movies}
      />
    </div>
  )
}