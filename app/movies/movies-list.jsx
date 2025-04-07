"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Film, Plus, Eye, Star, Clapperboard } from "lucide-react"
import AddMovieDialog from "@/app/movies/add-movie-dialog"
import ViewMovieDialog from "@/app/movies/view-movie-dialog"

export default function MoviesList() {
  const [movies, setMovies] = useState([])
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("https://backend-sistema-de-gestion-cine.onrender.com/movies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener las películas")
        }

        const data = await response.json()
        console.log("Datos recibidos del backend:", data); // Para depuración
        const formattedMovies = data.map((movie) => ({
          id: movie.id,
          title: movie.title,
          classification: movie.classification,
          duration: movie.duration,
          category: movie.category || "Sin categoría",
          rating: 4.0,
        }))
        setMovies(formattedMovies)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const handleAddMovie = (newMovie) => {
    const movieWithId = {
      ...newMovie,
      rating: 4.0,
    }
    setMovies([...movies, movieWithId])
    console.log("Película añadida:", movieWithId); // Para depuración
  }

  const handleViewMovie = (movie) => {
    setSelectedMovie(movie)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-lg">Cargando películas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-400 text-lg">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/10 to-indigo-800/10 rounded-xl blur-3xl -z-10 opacity-50" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 shadow-lg">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Películas Disponibles
            </h2>
            <p className="text-gray-300 mt-1 text-sm">Explora y gestiona el catálogo de películas</p>
          </div>
          <Button
            onClick={() => setIsAddMovieOpen(true)}
            className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-700 text-white shadow-md shadow-blue-800/30 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar Película
          </Button>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-900/50 rounded-xl border border-gray-800/50">
          <Clapperboard className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-300 text-lg mb-4">No hay películas disponibles</p>
          <Button
            onClick={() => setIsAddMovieOpen(true)}
            className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir Película
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group flex flex-col bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:bg-gray-900/90 transition-all duration-300"
            >
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors duration-200">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full shadow-inner">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-medium text-sm">{movie.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-600/20 text-blue-100 border border-blue-500/30 hover:bg-blue-600/30 text-xs">
                    {movie.classification}
                  </Badge>
                  <Badge className="bg-gray-700/50 text-gray-200 border border-gray-600/50 hover:bg-gray-700/70 text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {movie.duration} min
                  </Badge>
                  <Badge className="bg-indigo-600/20 text-indigo-100 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs flex items-center gap-1">
                    <Film className="h-3 w-3" /> {movie.category || "Sin categoría"}
                  </Badge>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-800/50">
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-blue-800 to-indigo-600 hover:from-blue-900 hover:to-indigo-900 text-white shadow-md shadow-blue-800/20 group-hover:shadow-blue-600/30 transition-all duration-300"
                    onClick={() => handleViewMovie(movie)}
                  >
                    <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddMovieDialog open={isAddMovieOpen} onOpenChange={setIsAddMovieOpen} onAddMovie={handleAddMovie} />

      {selectedMovie && (
        <ViewMovieDialog
          movie={selectedMovie}
          open={!!selectedMovie}
          onOpenChange={(open) => !open && setSelectedMovie(null)}
        />
      )}
    </div>
  )
}