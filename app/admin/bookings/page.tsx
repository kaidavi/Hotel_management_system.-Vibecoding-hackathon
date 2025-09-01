"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { getAllBookings, getBookingsWithDetails, updateBookingStatus, type Booking } from "@/lib/bookings"
import { BookingCard } from "@/components/booking/booking-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar, Users, DollarSign } from "lucide-react"

export default function AdminBookingsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [refreshKey, setRefreshKey] = useState(0)

  const allBookings = getAllBookings()
  const bookingsWithDetails = getBookingsWithDetails(allBookings)

  const filteredAndSortedBookings = useMemo(() => {
    const filtered = bookingsWithDetails.filter((booking) => {
      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          booking.id.toLowerCase().includes(searchLower) ||
          booking.user?.name.toLowerCase().includes(searchLower) ||
          booking.user?.email.toLowerCase().includes(searchLower) ||
          booking.room?.number.toLowerCase().includes(searchLower)
        )
      }

      return true
    })

    // Sort bookings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "checkin":
          return new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
        case "amount":
          return b.totalAmount - a.totalAmount
        default:
          return 0
      }
    })

    return filtered
  }, [bookingsWithDetails, statusFilter, searchTerm, sortBy])

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff")) {
    router.push("/login")
    return null
  }

  const handleViewDetails = (booking: Booking) => {
    router.push(`/admin/bookings/${booking.id}`)
  }

  const handleCheckIn = (booking: Booking) => {
    if (confirm(`Check in ${booking.user?.name} to Room ${booking.room?.number}?`)) {
      updateBookingStatus(booking.id, "checked-in")
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleCheckOut = (booking: Booking) => {
    if (confirm(`Check out ${booking.user?.name} from Room ${booking.room?.number}?`)) {
      updateBookingStatus(booking.id, "checked-out")
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleCancel = (booking: Booking) => {
    if (confirm(`Cancel booking for ${booking.user?.name}? This action cannot be undone.`)) {
      updateBookingStatus(booking.id, "cancelled")
      setRefreshKey((prev) => prev + 1)
    }
  }

  // Calculate summary stats
  const stats = {
    total: filteredAndSortedBookings.length,
    pending: filteredAndSortedBookings.filter((b) => b.status === "pending").length,
    confirmed: filteredAndSortedBookings.filter((b) => b.status === "confirmed").length,
    checkedIn: filteredAndSortedBookings.filter((b) => b.status === "checked-in").length,
    totalRevenue: filteredAndSortedBookings.reduce((sum, b) => sum + b.totalAmount, 0),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">Booking Management</h1>
        <p className="text-muted-foreground">Manage all hotel reservations and guest check-ins</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">{stats.pending}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Guests</p>
                <p className="text-2xl font-bold text-blue-600">{stats.checkedIn}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest name, email, or room number..."
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
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="checkin">Check-in Date</SelectItem>
                <SelectItem value="amount">Amount (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredAndSortedBookings.length > 0 ? (
        <div className="grid gap-6">
          {filteredAndSortedBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={handleViewDetails}
              onCancel={handleCancel}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              variant="admin"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No bookings found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
              setSortBy("newest")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
