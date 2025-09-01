import { getBookingsByUserId, getBookingsWithDetails, type Booking } from "./bookings"
import { mockPayments } from "./payments"

export interface CustomerStats {
  totalBookings: number
  upcomingBookings: number
  completedStays: number
  totalSpent: number
  favoriteRoomType: string
  memberSince: Date
  loyaltyPoints: number
}

export interface UpcomingBooking extends Booking {
  daysUntilCheckIn: number
  room?: {
    id: string
    number: string
    type: string
    price: number
  }
  user?: {
    id: string
    name: string
    email: string
  }
}

export const getCustomerStats = (userId: string): CustomerStats => {
  const userBookings = getBookingsByUserId(userId)
  const bookingsWithDetails = getBookingsWithDetails(userBookings)

  const totalBookings = userBookings.length
  const upcomingBookings = userBookings.filter((booking) => {
    const checkInDate = new Date(booking.checkInDate)
    const today = new Date()
    return checkInDate > today && booking.status !== "cancelled"
  }).length

  const completedStays = userBookings.filter((booking) => booking.status === "checked-out").length

  const totalSpent = mockPayments
    .filter((payment) => {
      const booking = userBookings.find((b) => b.id === payment.bookingId)
      return booking && payment.status === "completed"
    })
    .reduce((sum, payment) => sum + payment.amount, 0)

  // Calculate favorite room type
  const roomTypeCounts = bookingsWithDetails.reduce(
    (acc, booking) => {
      if (booking.room?.type) {
        acc[booking.room.type] = (acc[booking.room.type] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const favoriteRoomType = Object.entries(roomTypeCounts).reduce(
    (max, [type, count]) => (count > max.count ? { type, count } : max),
    { type: "standard", count: 0 },
  ).type

  // Mock member since date (first booking or account creation)
  const memberSince =
    userBookings.length > 0
      ? new Date(Math.min(...userBookings.map((b) => new Date(b.createdAt).getTime())))
      : new Date()

  // Mock loyalty points (based on total spent)
  const loyaltyPoints = Math.floor(totalSpent / 10)

  return {
    totalBookings,
    upcomingBookings,
    completedStays,
    totalSpent,
    favoriteRoomType,
    memberSince,
    loyaltyPoints,
  }
}

export const getUpcomingBookings = (userId: string): UpcomingBooking[] => {
  const userBookings = getBookingsByUserId(userId)
  const bookingsWithDetails = getBookingsWithDetails(userBookings)
  const today = new Date()

  return bookingsWithDetails
    .filter((booking) => {
      const checkInDate = new Date(booking.checkInDate)
      return checkInDate > today && booking.status !== "cancelled"
    })
    .map((booking) => {
      const checkInDate = new Date(booking.checkInDate)
      const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      return {
        ...booking,
        daysUntilCheckIn,
      }
    })
    .sort((a, b) => a.daysUntilCheckIn - b.daysUntilCheckIn)
}

export const getRecentBookings = (userId: string, limit = 3): Booking[] => {
  const userBookings = getBookingsByUserId(userId)
  const bookingsWithDetails = getBookingsWithDetails(userBookings)

  return bookingsWithDetails
    .filter((booking) => booking.status === "checked-out" || booking.status === "cancelled")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}
