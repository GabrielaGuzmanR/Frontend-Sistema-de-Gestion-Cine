"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Film, Calendar, Star, Clapperboard } from "lucide-react"
import ReservationDialog from "@/app/reservations/reservation-dialog"

export default function ViewMovieDialog({ movie, open, onOpenChange }) {
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch functions from the backend when the dialog opens
  useEffect(() => {
    if (!open || !movie) return

    const fetchSchedules = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/functions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        let data = [];
        if (response.status === 404) {
          data = []; // Tratar 404 como lista vacía
        } else if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        } else {
          data = await response.json();
        }

        // Filter functions by movieId and map to the expected structure
        const movieFunctions = data
          .filter((func) => func.movieId === movie.id)
          .map((func) => ({
            id: func.id,
            time: func.time.slice(0, 5), // Take only "HH:MM" from "HH:MM:SS"
            theater: func.Room.name,
            date: func.date.split("T")[0], // Take only "YYYY-MM-DD"
          }))

        setSchedules(movieFunctions)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchedules()
  }, [open, movie])

  // Group schedules by date
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.date]) {
      acc[schedule.date] = []
    }
    acc[schedule.date].push(schedule)
    return acc
  }, {})

  const dates = Object.keys(schedulesByDate)

  const handleReserve = (schedule) => {
    setSelectedSchedule(schedule)
    setIsReservationOpen(true)
  }

  if (!movie) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] border-none shadow-xl bg-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{movie.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-primary/20 text-white hover:bg-primary/30 flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {movie.rating}
              </Badge>
              <DialogDescription className="m-0 text-white">
                Detalles de la película y horarios disponibles
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-6 py-4">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-primary/20 text-white hover:bg-primary/30">{movie.classification}</Badge>
                <Badge className="bg-primary/20 text-white hover:bg-primary/30 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {movie.duration} min
                </Badge>
                <Badge className="bg-primary/20 text-white hover:bg-primary/30 flex items-center gap-1">
                  <Film className="h-3 w-3" /> {movie.category || "Sin categoría"}
                </Badge>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">Horarios Disponibles</h3>

                {isLoading ? (
                  <p className="text-white text-sm">Cargando horarios...</p>
                ) : error ? (
                  <p className="text-red-400 text-sm">Error: {error}</p>
                ) : schedules.length === 0 ? (
                  <div className="relative flex flex-col items-center justify-center py-8 bg-gradient-to-b from-gray-900/50 to-gray-800/50 rounded-lg border border-gray-800/50 shadow-md">
                    {/* Fondo decorativo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-lg blur-3xl -z-10 opacity-50" />

                    {/* Ícono grande */}
                    <Clapperboard className="h-16 w-16 text-blue-400 mb-4 animate-pulse" />

                    {/* Título */}
                    <h4 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      ¡No hay horarios disponibles!
                    </h4>
                  </div>
                ) : (
                  <Tabs defaultValue={dates[0]} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4 bg-white/10">
                      {dates.map((date) => (
                        <TabsTrigger
                          key={date}
                          value={date}
                          className="data-[state=active]:bg-primary data-[state=active]:text-white"
                        >
                          {new Date(date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric" })}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {dates.map((date) => (
                      <TabsContent key={date} value={date} className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-3">
                          {schedulesByDate[date].map((schedule) => (
                            <Button
                              key={schedule.id}
                              variant="outline"
                              className="justify-between border-primary/30 hover:bg-primary hover:text-white transition-colors"
                              onClick={() => handleReserve(schedule)}
                            >
                              <span className="font-bold">{schedule.time}</span>
                              <span className="text-xs">{schedule.theater}</span>
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-white/10">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4 text-white" />
                  Información Adicional
                </h4>
                <p className="text-sm text-white">
                  Seleccione un horario para reservar sus entradas. Las reservas deben realizarse con al menos 2 horas
                  de anticipación.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedSchedule && (
        <ReservationDialog
          open={isReservationOpen}
          onOpenChange={setIsReservationOpen}
          movie={movie}
          schedule={selectedSchedule}
        />
      )}
    </>
  )
}