"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { getRooms, type Room } from "@/lib/rooms"
import { RoomCard } from "@/components/rooms/room-card"
import { RoomFiltersComponent } from "@/components/rooms/room-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Hotel, Plus } from "lucide-react"

interface RoomFilters {
  search: string
  type: "standard" | "deluxe" | "suite" | "presidential" | "all"
  status: "available" | "occupied" | "maintenance" | "cleaning" | "all"
  minPrice: string
  maxPrice: string
  capacity: string
}

export default function AdminRoomsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [filters, setFilters] = useState<RoomFilters>({
    search: "",
    type: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
    capacity: "",
  })

  const allRooms = getRooms()

  // Filter rooms based on current filters
  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const matchesSearch =
          room.number.toLowerCase().includes(searchTerm) ||
          room.type.toLowerCase().includes(searchTerm) ||
          room.description.toLowerCase().includes(searchTerm) ||
          room.amenities.some((amenity) => amenity.toLowerCase().includes(searchTerm))

        if (!matchesSearch) return false
      }

      // Type filter
      if (filters.type !== "all" && room.type !== filters.type) {
        return false
      }

      // Status filter
      if (filters.status !== "all" && room.status !== filters.status) {
        return false
      }

      // Price filters
      if (filters.minPrice && room.price < Number.parseInt(filters.minPrice)) {
        return false
      }
      if (filters.maxPrice && room.price > Number.parseInt(filters.maxPrice)) {
        return false
      }

      // Capacity filter
      if (filters.capacity && room.capacity < Number.parseInt(filters.capacity)) {
        return false
      }

      return true
    })
  }, [allRooms, filters])

  const handleRoomSelect = (room: Room) => {
    router.push(`/admin/rooms/${room.id}`)
  }

  const handleRoomEdit = (room: Room) => {
    router.push(`/admin/rooms/${room.id}/edit`)
  }

  // Calculate summary stats
  const stats = {
    total: allRooms.length,
    available: allRooms.filter((r) => r.status === "available").length,
    occupied: allRooms.filter((r) => r.status === "occupied").length,
    maintenance: allRooms.filter((r) => r.status === "maintenance").length,
    cleaning: allRooms.filter((r) => r.status === "cleaning").length,
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff")) {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-hotel-gold mb-2">Room Management</h1>
            <p className="text-muted-foreground">Manage hotel room inventory and status</p>
          </div>
          {user?.role === "admin" && (
            <Button onClick={() => router.push("/admin/rooms/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Room
            </Button>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Hotel className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold text-blue-600">{stats.occupied}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cleaning</p>
                <p className="text-2xl font-bold text-purple-600">{stats.cleaning}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <RoomFiltersComponent filters={filters} onFiltersChange={setFilters} showStatus={true} />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredRooms.length} of {allRooms.length} rooms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} onSelect={handleRoomSelect} onEdit={handleRoomEdit} variant="admin" />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No rooms found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                search: "",
                type: "all",
                status: "all",
                minPrice: "",
                maxPrice: "",
                capacity: "",
              })
            }
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
