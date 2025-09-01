import { mockRooms } from "./rooms"
import { mockBookings, getBookingsWithDetails } from "./bookings"
import { mockUsers } from "./auth"
import { mockPayments } from "./payments"

export interface DashboardStats {
  totalRooms: number
  availableRooms: number
  occupiedRooms: number
  maintenanceRooms: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  checkedInGuests: number
  totalRevenue: number
  monthlyRevenue: number
  totalCustomers: number
  occupancyRate: number
}

export interface RevenueData {
  month: string
  revenue: number
  bookings: number
}

export interface RoomTypeStats {
  type: string
  total: number
  occupied: number
  available: number
  revenue: number
}

export const getDashboardStats = (): DashboardStats => {
  const totalRooms = mockRooms.length
  const availableRooms = mockRooms.filter((room) => room.status === "available").length
  const occupiedRooms = mockRooms.filter((room) => room.status === "occupied").length
  const maintenanceRooms = mockRooms.filter((room) => room.status === "maintenance").length

  const totalBookings = mockBookings.length
  const pendingBookings = mockBookings.filter((booking) => booking.status === "pending").length
  const confirmedBookings = mockBookings.filter((booking) => booking.status === "confirmed").length
  const checkedInGuests = mockBookings.filter((booking) => booking.status === "checked-in").length

  const totalRevenue = mockPayments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const currentMonth = new Date().getMonth()
  const monthlyRevenue = mockPayments
    .filter((payment) => payment.status === "completed" && new Date(payment.createdAt).getMonth() === currentMonth)
    .reduce((sum, payment) => sum + payment.amount, 0)

  const totalCustomers = mockUsers.filter((user) => user.role === "customer").length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    checkedInGuests,
    totalRevenue,
    monthlyRevenue,
    totalCustomers,
    occupancyRate,
  }
}

export const getRevenueData = (): RevenueData[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Generate mock revenue data for the last 6 months
  return months.slice(-6).map((month, index) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    bookings: Math.floor(Math.random() * 100) + 50,
  }))
}

export const getRoomTypeStats = (): RoomTypeStats[] => {
  const roomTypes = ["standard", "deluxe", "suite", "presidential"]

  return roomTypes.map((type) => {
    const roomsOfType = mockRooms.filter((room) => room.type === type)
    const total = roomsOfType.length
    const occupied = roomsOfType.filter((room) => room.status === "occupied").length
    const available = roomsOfType.filter((room) => room.status === "available").length

    // Calculate revenue for this room type
    const revenue = mockPayments
      .filter((payment) => {
        const booking = mockBookings.find((b) => b.id === payment.bookingId)
        if (!booking) return false
        const room = mockRooms.find((r) => r.id === booking.roomId)
        return room?.type === type && payment.status === "completed"
      })
      .reduce((sum, payment) => sum + payment.amount, 0)

    return {
      type: type.charAt(0).toUpperCase() + type.slice(1),
      total,
      occupied,
      available,
      revenue,
    }
  })
}

export const getRecentBookings = (limit = 5) => {
  const bookingsWithDetails = getBookingsWithDetails()
  return bookingsWithDetails
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}
