"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Film, MapPin, Calendar, Ticket, Popcorn, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import MoviesList from "@/app/movies/movies-list"
import TheatersList from "@/app/theaters/theaters-list"
import ReservationsList from "@/app/reservations/reservations-list"
import { useMediaQuery } from "@/app/hooks/use-media-query"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("welcome")
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    setMounted(true)

    // Set sidebar open by default on desktop
    if (isDesktop) {
      setSidebarOpen(true)
    }
  }, [isDesktop])

  const handleTabChange = (value) => {
    setActiveTab(value)
    if (!isDesktop) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-800/90 backdrop-blur-md transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-white/10",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Ticket className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">CinePlus</h1>
              </div>
              {!isDesktop && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-auto py-6 px-4">
              <nav className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xs uppercase tracking-wider text-white/60 px-2">Principal</h2>
                  <div className="space-y-1">
                    <SidebarItem
                      icon={<Popcorn className="h-5 w-5" />}
                      label="Inicio"
                      active={activeTab === "welcome"}
                      onClick={() => handleTabChange("welcome")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xs uppercase tracking-wider text-white/60 px-2">Gestión</h2>
                  <div className="space-y-1">
                    <SidebarItem
                      icon={<Film className="h-5 w-5" />}
                      label="Películas"
                      active={activeTab === "movies"}
                      onClick={() => handleTabChange("movies")}
                    />
                    <SidebarItem
                      icon={<MapPin className="h-5 w-5" />}
                      label="Salas"
                      active={activeTab === "theaters"}
                      onClick={() => handleTabChange("theaters")}
                    />
                    <SidebarItem
                      icon={<Calendar className="h-5 w-5" />}
                      label="Reservas"
                      active={activeTab === "reservations"}
                      onClick={() => handleTabChange("reservations")}
                    />
                  </div>
                </div>
              </nav>
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="rounded-lg bg-primary/20 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/20 p-2">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">CinePlus</p>
                    <p className="text-xs text-white/60">Sistema de Gestión</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-white/10 bg-slate-900/80 backdrop-blur-md px-4">
            {!isDesktop && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold">
                {activeTab === "welcome" && "Dashboard"}
                {activeTab === "movies" && "Películas"}
                {activeTab === "theaters" && "Salas"}
                {activeTab === "reservations" && "Reservas"}
              </h1>
            </div>
          </header>

          <main className="p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="welcome" className="mt-0 animate-in fade-in-50 duration-300">
                <WelcomeContent />
              </TabsContent>

              <TabsContent value="movies" className="mt-0 animate-in fade-in-50 duration-300">
                <MoviesList />
              </TabsContent>

              <TabsContent value="theaters" className="mt-0 animate-in fade-in-50 duration-300">
                <TheatersList />
              </TabsContent>

              <TabsContent value="reservations" className="mt-0 animate-in fade-in-50 duration-300">
                <ReservationsList />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "bg-blue-900 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white"></span>}
    </button>
  )
}

function WelcomeContent() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl bg-blue-900 p-6 shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-4 py-6 px-6 md:px-10">
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="h-8 w-8 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">CinePlus</h1>
            <Popcorn className="h-8 w-8 text-white" />
          </div>
          <div className="h-1 w-24 bg-white/30 rounded-full"></div>
          <p className="text-lg max-w-[700px] text-white">
            Tu sistema completo para la gestión de cines. Administra películas, salas y reservas de manera eficiente.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard
          icon={<Film className="h-8 w-8 text-blue-800" />}
          title="Películas"
          description="Gestione el catálogo de películas disponibles"
          value="movies"
        />
        <DashboardCard
          icon={<MapPin className="h-8 w-8 text-blue-800" />}
          title="Salas"
          description="Configure las salas y sus horarios de proyección"
          value="theaters"
        />
        <DashboardCard
          icon={<Calendar className="h-8 w-8 text-blue-800" />}
          title="Reservas"
          description="Vea y gestione las reservas de los clientes"
          value="reservations"
        />
      </div>
    </div>
  )
}

function DashboardCard({ icon, title, description, value }) {
  const [activeTab, setActiveTab] = useState("welcome")

  return (
    <Card
      className="group cursor-pointer border-none bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1"
      onClick={() => setActiveTab(value)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="rounded-full bg-blue-900/20 p-2 transition-all duration-300 group-hover:bg-blue-900/30">
            {icon}
          </div>
        </div>
        <p className="text-white">{description}</p>
        <div className="mt-4 flex items-center text-white bg-blue-900/20 px-3 py-1.5 rounded-md hover:bg-blue-900/30 transition-colors">
          <span className="text-sm font-medium">Explorar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-lg bg-white/5 p-4">
      <p className="text-sm text-white/70">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function ActivityItem({ title, description, time, icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-full bg-white/10 p-2 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <p className="text-xs text-white/50">{time}</p>
    </div>
  )
}

