"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock } from "lucide-react"

export default function AddFunctionDialog({ open, onOpenChange, onAddFunction, roomId, movies }) {
  const [newFunction, setNewFunction] = useState({
    date: "",
    time: "",
    movieId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewFunction({ ...newFunction, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setNewFunction({ ...newFunction, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const functionData = {
      date: newFunction.date,
      time: `${newFunction.time}:00`, // Añadimos segundos para el formato "HH:MM:SS"
      movieId: newFunction.movieId,
      roomId: roomId.toString(), // Convertimos a string para el backend
    }

    try {
      const response = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/functions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(functionData),
      })

      if (!response.ok) {
        throw new Error(`Error al agregar la función: ${response.status}`)
      }

      const addedFunction = await response.json()
      onAddFunction({
        id: addedFunction.id,
        date: newFunction.date,
        time: newFunction.time,
        movieId: Number(newFunction.movieId),
        movieTitle: movies.find((m) => m.id === Number(newFunction.movieId)).title,
      })

      setNewFunction({
        date: "",
        time: "",
        movieId: "",
      })
      onOpenChange(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-xl bg-slate-800 text-white">
        <DialogHeader className="text-center">
          <div className="mx-auto bg-blue-800 p-3 rounded-full w-fit mb-2">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Agregar Nueva Función</DialogTitle>
          <DialogDescription className="text-base text-white/80">
            Configure los detalles de la función para la sala.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right font-medium text-white">
                Fecha
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newFunction.date}
                onChange={handleChange}
                className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-blue-700"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right font-medium text-white">
                Hora
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={newFunction.time}
                onChange={handleChange}
                className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-blue-700"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="movieId" className="text-right font-medium text-white">
                Película
              </Label>
              <Select
                value={newFunction.movieId}
                onValueChange={(value) => handleSelectChange("movieId", value)}
              >
                <SelectTrigger className="col-span-3 bg-white/10 border-white/20 text-white focus:ring-blue-700">
                  <SelectValue placeholder="Seleccionar película" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20 text-white">
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id.toString()}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Función"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}