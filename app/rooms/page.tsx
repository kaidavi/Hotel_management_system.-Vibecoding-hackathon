"use client"

import { useState, useMemo } from "react"
import { RoomCard } from "@/components/rooms/room-card"
import { RoomFiltersComponent } from "@/components/rooms/room-filters"
import { getRooms, getAvailableRooms, type Room } from "@/lib/rooms"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface RoomFilters {
  search: string
  type: "standard" | "deluxe" | "suite" | "presidential" | "all"
  status: "available" | "occupied" | "maintenance" | "cleaning" | "all"
  minPrice: string
  maxPrice: string
  capacity: string
}

export default function RoomsPage() {
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

  // Get rooms based on user role
  const allRooms = user?.role === "admin" || user?.role === "staff" ? getRooms() : getAvailableRooms()

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

      // Status filter (admin/staff only)
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
    if (user?.role === "customer") {
      router.push(`/booking?roomId=${room.id}`)
    } else {
      router.push(`/rooms/${room.id}`)
    }
  }

  const handleRoomEdit = (room: Room) => {
    router.push(`/admin/rooms/${room.id}/edit`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-hotel-gold">Our Rooms</h1>
            <p className="text-muted-foreground">
              {user?.role === "customer" ? "Discover our luxurious accommodations" : "Manage hotel room inventory"}
            </p>
          </div>
          {!isAuthenticated && <Button onClick={() => router.push("/login")}>Sign In to Book</Button>}
        </div>

        <RoomFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          showStatus={user?.role === "admin" || user?.role === "staff"}
        />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredRooms.length} of {allRooms.length} rooms
        </p>
        {user?.role === "admin" && <Button onClick={() => router.push("/admin/rooms/new")}>Add New Room</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onSelect={handleRoomSelect}
            onEdit={handleRoomEdit}
            variant={user?.role === "admin" || user?.role === "staff" ? "admin" : "customer"}
          />
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
