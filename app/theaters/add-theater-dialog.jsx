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
import { MapPin } from "lucide-react"

export default function AddTheaterDialog({ open, onOpenChange, onAddTheater }) {
  const [newTheater, setNewTheater] = useState({
    name: "",
    capacity: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewTheater({ ...newTheater, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const theaterData = {
      name: newTheater.name,
      capacity: newTheater.capacity.toString(), // String para el backend
    }

    try {
      const response = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(theaterData),
      })

      if (!response.ok) {
        throw new Error(`Error al agregar la sala: ${response.status}`)
      }

      const addedTheater = await response.json()
      // Pasamos schedules como array vacío para compatibilidad con TheatersList
      onAddTheater({
        ...newTheater,
        capacity: Number.parseInt(newTheater.capacity, 10),
        id: addedTheater.id,
        schedules: [], // Añadimos esto
      })

      setNewTheater({
        name: "",
        capacity: "",
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
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Agregar Nueva Sala</DialogTitle>
          <DialogDescription className="text-base text-white/80">
            Configure los detalles básicos de la sala.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium text-white">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={newTheater.name}
                onChange={handleChange}
                className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-blue-700"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right font-medium text-white">
                Capacidad
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={newTheater.capacity}
                onChange={handleChange}
                className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-blue-700"
                required
                min="1"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Sala"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}