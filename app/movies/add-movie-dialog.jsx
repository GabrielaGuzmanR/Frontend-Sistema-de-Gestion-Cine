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
import { Film } from "lucide-react"

export default function AddMovieDialog({ open, onOpenChange, onAddMovie }) {
  const [newMovie, setNewMovie] = useState({
    title: "",
    classification: "PG",
    duration: "",
    category: "", // Cambiado de "genre" a "category" para coincidir con el backend
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewMovie({ ...newMovie, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setNewMovie({ ...newMovie, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Preparar los datos para el backend
    const movieData = {
      title: newMovie.title,
      category: newMovie.category, // Usamos "category" en lugar de "genre"
      duration: newMovie.duration.toString(), // Convertimos a string para el backend
      classification: newMovie.classification,
    }

    try {
      const response = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      })

      if (!response.ok) {
        throw new Error(`Error al agregar la película: ${response.status}`)
      }

      const addedMovie = await response.json()
      // Notificar al componente padre con los datos originales (duration como número)
      onAddMovie({
        ...newMovie,
        duration: Number.parseInt(newMovie.duration, 10),
        id: addedMovie.id, // Incluimos el ID devuelto por el backend
      })

      // Reiniciar el formulario
      setNewMovie({
        title: "",
        classification: "PG",
        duration: "",
        category: "",
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
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-2">
            <Film className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Agregar Nueva Película</DialogTitle>
          <DialogDescription className="text-base text-white">
            Complete los detalles de la nueva película. Se enviará una notificación por correo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium text-white">
                Título
              </Label>
              <Input
                id="title"
                name="title"
                value={newMovie.title}
                onChange={handleChange}
                className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classification" className="text-right font-medium text-white">
                Clasificación
              </Label>
              <Select
                value={newMovie.classification}
                onValueChange={(value) => handleSelectChange("classification", value)}
              >
                <SelectTrigger className="col-span-3 bg-white/10 border-white/20 text-white focus:ring-primary">
                  <SelectValue placeholder="Seleccionar clasificación" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20 text-white">
                  <SelectItem value="G">G (Público general)</SelectItem>
                  <SelectItem value="PG">PG (Guía parental)</SelectItem>
                  <SelectItem value="PG-13">PG-13 (Padres fuertemente advertidos)</SelectItem>
                  <SelectItem value="R">R (Restringido)</SelectItem>
                  <SelectItem value="18+">18+ (Adultos)</SelectItem> {/* Añadido para coincidir con el ejemplo */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right font-medium text-white">
                Duración (min)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={newMovie.duration}
                onChange={handleChange}
                className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right font-medium text-white">
                Categoría
              </Label>
              <Input
                id="category"
                name="category"
                value={newMovie.category}
                onChange={handleChange}
                className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Película"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}