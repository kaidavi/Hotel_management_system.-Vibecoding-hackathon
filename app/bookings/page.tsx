"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getBookingsByUserId, getBookingsWithDetails, cancelBooking, type Booking } from "@/lib/bookings"
import { BookingCard } from "@/components/booking/booking-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function BookingsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [refreshKey, setRefreshKey] = useState(0)

  const userBookings = user?.id ? getBookingsByUserId(user.id) : []
  const bookingsWithDetails = getBookingsWithDetails(userBookings)

  const filteredBookings = useMemo(() => {
    return bookingsWithDetails.filter((booking) => {
      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          booking.id.toLowerCase().includes(searchLower) ||
          booking.room?.number.toLowerCase().includes(searchLower) ||
          booking.room?.type.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [bookingsWithDetails, statusFilter, searchTerm])

  const handleViewDetails = (booking: Booking) => {
    router.push(`/booking/confirmation/${booking.id}`)
  }

  const handleCancel = (booking: Booking) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(booking.id)
      setRefreshKey((prev) => prev + 1)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-8">You need to be signed in to view your bookings.</p>
        <Button onClick={() => router.push("/login")}>Sign In</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" key={refreshKey}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your hotel reservations</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked-in">Checked In</SelectItem>
            <SelectItem value="checked-out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={handleViewDetails}
              onCancel={handleCancel}
              variant="customer"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            {searchTerm || statusFilter !== "all" ? "No bookings found matching your criteria." : "No bookings yet."}
          </p>
          <Button onClick={() => router.push("/rooms")}>Browse Rooms</Button>
        </div>
      )}
    </div>
  )
}
