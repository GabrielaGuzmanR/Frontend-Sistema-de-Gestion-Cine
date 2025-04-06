"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, Calendar, Clock, MapPin, Ticket } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Generate a 10x8 seat grid
const generateSeats = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const seats = []

  for (let i = 0; i < rows.length; i++) {
    for (let j = 1; j <= 10; j++) {
      seats.push({
        id: `${rows[i]}${j}`,
        row: rows[i],
        number: j,
        status: Math.random() > 0.8 ? "occupied" : "available",
      })
    }
  }

  return seats
}

export default function ReservationDialog({ movie, schedule, open, onOpenChange }) {
  const [seats] = useState(generateSeats())
  const [selectedSeats, setSelectedSeats] = useState([])
  const [email, setEmail] = useState("")
  const [name, setName] = useState("") // Añadimos estado para el nombre
  const [currentStep, setCurrentStep] = useState("select-seats")
  const [reservationComplete, setReservationComplete] = useState(false)

  const handleSeatClick = (seat) => {
    if (seat.status === "occupied") return

    if (selectedSeats.find((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const handleContinue = () => {
    if (currentStep === "select-seats" && selectedSeats.length > 0) {
      setCurrentStep("confirm")
    }
  }

  const handleReservation = () => {
    if (!email || !name || selectedSeats.length === 0) return // Añadimos validación para name

    console.log("Sending reservation confirmation email to:", email, {
      name, // Incluimos el nombre en el log
      movie: movie.title,
      theater: schedule.theater,
      date: schedule.date,
      time: schedule.time,
      seats: selectedSeats.map((s) => s.id),
    })

    setReservationComplete(true)
  }

  const handleClose = () => {
    setSelectedSeats([])
    setEmail("")
    setName("") // Reiniciamos el nombre
    setCurrentStep("select-seats")
    setReservationComplete(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] border-none shadow-xl bg-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Reservar Entradas</DialogTitle>
          <DialogDescription className="text-base text-white">
            {movie.title} - {schedule.theater} - {new Date(schedule.date).toLocaleDateString("es-ES")} {schedule.time}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 rounded-lg bg-white/10">
            <TabsTrigger
              value="select-seats"
              disabled={currentStep === "confirm"}
              className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Seleccionar Asientos
            </TabsTrigger>
            <TabsTrigger
              value="confirm"
              disabled={currentStep === "select-seats"}
              className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Confirmar Reserva
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select-seats" className="space-y-6 mt-6 animate-fade-in">
            <div className="flex justify-center items-center gap-6 my-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                <span className="text-sm">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                <span className="text-sm">Seleccionado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white/10 rounded-sm"></div>
                <span className="text-sm">Ocupado</span>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-full max-w-md bg-gray-700/50 border border-gray-600/50 rounded-t-md p-2 text-center text-sm font-medium text-gray-300">
                Pantalla
              </div>
            </div>

            <div className="seat-grid">
              <div className="seat-grid-inner grid grid-cols-10 gap-2 max-w-md mx-auto">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                      seat.status === "occupied"
                        ? "bg-white/10 text-white/50 cursor-not-allowed opacity-50"
                        : selectedSeats.find((s) => s.id === seat.id)
                          ? "bg-green-500 text-white shadow-md transform -translate-y-1 hover:bg-green-600"
                          : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === "occupied"}
                  >
                    {seat.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
              <div>
                <p className="text-sm font-medium">Asientos seleccionados: {selectedSeats.length}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSeats.map((seat) => (
                    <Badge key={seat.id} className="bg-green-500 text-white hover:bg-green-600">
                      {seat.id}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continuar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="space-y-6 mt-6 animate-fade-in">
            {!reservationComplete ? (
              <>
                <Card className="border border-white/10 shadow-md bg-white/5">
                  <CardHeader className="bg-blue-600/10 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-white" />
                      <CardTitle className="text-white">Detalles de la Reserva</CardTitle>
                    </div>
                    <CardDescription className="text-white">Confirme los detalles de su reserva</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white">{movie.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-white" />
                          <span className="text-white">{schedule.theater}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-white" />
                          <span className="text-white">{new Date(schedule.date).toLocaleDateString("es-ES")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-white" />
                          <span className="text-white">{schedule.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-600/10 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-2 text-white">Asientos</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedSeats.map((seat) => (
                          <Badge key={seat.id} className="bg-green-500 text-white hover:bg-green-600">
                            {seat.id}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium text-white">
                          Nombre
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ingrese su nombre"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-blue-600"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium text-white">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ingrese su correo para recibir la confirmación"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-blue-600"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("select-seats")}
                    className="border-blue-600/30 text-white hover:bg-blue-600 hover:text-white"
                  >
                    Volver
                  </Button>
                  <Button
                    onClick={handleReservation}
                    disabled={!email || !name || selectedSeats.length === 0} // Actualizamos la validación
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Confirmar Reserva
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-6 ticket-pattern">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">¡Reserva Exitosa!</h2>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10 shadow-lg max-w-md w-full">
                  <p className="text-center text-white mb-4">
                    Hemos enviado un correo de confirmación a{" "}
                    <span className="font-medium text-white">{name}</span> (
                    <span className="font-medium text-white">{email}</span>) con los detalles de su reserva.
                  </p>
                  <div className="p-4 bg-blue-600/10 rounded-lg border border-white/10 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white">Película:</span>
                      <span className="text-sm text-white">{movie.title}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white">Sala:</span>
                      <span className="text-sm text-white">{schedule.theater}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white">Fecha:</span>
                      <span className="text-sm text-white">{new Date(schedule.date).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white">Hora:</span>
                      <span className="text-sm text-white">{schedule.time}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700 mt-4">
                  Cerrar
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}