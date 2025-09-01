export type BookingStatus = "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled"

export interface Booking {
  id: string
  userId: string
  roomId: string
  checkInDate: Date
  checkOutDate: Date
  guests: number
  totalAmount: number
  status: BookingStatus
  specialRequests?: string
  paymentStatus: "pending" | "paid" | "refunded"
  createdAt: Date
  updatedAt: Date
  // Populated fields
  user?: {
    id: string
    name: string
    email: string
  }
  room?: {
    id: string
    number: string
    type: string
    price: number
  }
}

export interface BookingRequest {
  roomId: string
  checkInDate: Date
  checkOutDate: Date
  guests: number
  specialRequests?: string
}

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: "1",
    userId: "3",
    roomId: "1",
    checkInDate: new Date("2024-12-15"),
    checkOutDate: new Date("2024-12-18"),
    guests: 2,
    totalAmount: 450,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    id: "2",
    userId: "3",
    roomId: "2",
    checkInDate: new Date("2024-12-20"),
    checkOutDate: new Date("2024-12-23"),
    guests: 3,
    totalAmount: 750,
    status: "pending",
    paymentStatus: "pending",
    specialRequests: "Late check-in requested",
    createdAt: new Date("2024-12-02"),
    updatedAt: new Date("2024-12-02"),
  },
  {
    id: "3",
    userId: "3",
    roomId: "3",
    checkInDate: new Date("2024-11-10"),
    checkOutDate: new Date("2024-11-13"),
    guests: 2,
    totalAmount: 1350,
    status: "checked-out",
    paymentStatus: "paid",
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-11-13"),
  },
]

// Utility functions
export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const calculateTotalAmount = (roomPrice: number, checkIn: Date, checkOut: Date): number => {
  const nights = calculateNights(checkIn, checkOut)
  return roomPrice * nights
}

// Availability checking
export const isRoomAvailable = (roomId: string, checkIn: Date, checkOut: Date): boolean => {
  const conflictingBookings = mockBookings.filter((booking) => {
    if (booking.roomId !== roomId) return false
    if (booking.status === "cancelled") return false

    // Check for date overlap
    const bookingCheckIn = new Date(booking.checkInDate)
    const bookingCheckOut = new Date(booking.checkOutDate)

    return (
      (checkIn >= bookingCheckIn && checkIn < bookingCheckOut) ||
      (checkOut > bookingCheckIn && checkOut <= bookingCheckOut) ||
      (checkIn <= bookingCheckIn && checkOut >= bookingCheckOut)
    )
  })

  return conflictingBookings.length === 0
}

export const getAvailableRooms = (checkIn: Date, checkOut: Date, guests = 1) => {
  // Import getRooms here to avoid circular dependency
  const { getRooms } = require("./rooms")
  const allRooms = getRooms()

  return allRooms.filter((room) => {
    // Check if room has enough capacity
    if (room.capacity < guests) return false

    // Check if room is available (not in maintenance/cleaning for long periods)
    if (room.status === "maintenance") return false

    // Check availability against bookings
    return isRoomAvailable(room.id, checkIn, checkOut)
  })
}

import { NotificationService } from "./email"

// Booking CRUD operations
export const createBooking = async (bookingData: BookingRequest & { userId: string }): Promise<Booking> => {
  const { getRoomById } = require("./rooms")
  const { mockUsers } = require("./auth")
  const room = getRoomById(bookingData.roomId)

  if (!room) {
    throw new Error("Room not found")
  }

  if (!isRoomAvailable(bookingData.roomId, bookingData.checkInDate, bookingData.checkOutDate)) {
    throw new Error("Room is not available for the selected dates")
  }

  const totalAmount = calculateTotalAmount(room.price, bookingData.checkInDate, bookingData.checkOutDate)

  const newBooking: Booking = {
    id: Date.now().toString(),
    userId: bookingData.userId,
    roomId: bookingData.roomId,
    checkInDate: bookingData.checkInDate,
    checkOutDate: bookingData.checkOutDate,
    guests: bookingData.guests,
    totalAmount,
    status: "pending",
    paymentStatus: "pending",
    specialRequests: bookingData.specialRequests,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockBookings.push(newBooking)

  try {
    const user = mockUsers.find((u) => u.id === bookingData.userId)
    if (user) {
      const notificationService = new NotificationService()
      await notificationService.sendBookingConfirmation(
        { ...newBooking, nights: calculateNights(newBooking.checkInDate, newBooking.checkOutDate) },
        user,
        room,
      )
    }
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error)
  }

  return newBooking
}

export const getBookingById = (id: string): Booking | undefined => {
  return mockBookings.find((booking) => booking.id === id)
}

export const getBookingsByUserId = (userId: string): Booking[] => {
  return mockBookings.filter((booking) => booking.userId === userId)
}

export const getAllBookings = (): Booking[] => {
  return mockBookings
}

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<boolean> => {
  const bookingIndex = mockBookings.findIndex((booking) => booking.id === bookingId)
  if (bookingIndex !== -1) {
    const oldStatus = mockBookings[bookingIndex].status
    mockBookings[bookingIndex].status = status
    mockBookings[bookingIndex].updatedAt = new Date()

    if (status === "confirmed" && oldStatus !== "confirmed") {
      try {
        const { getRoomById } = require("./rooms")
        const { mockUsers } = require("./auth")
        const booking = mockBookings[bookingIndex]
        const user = mockUsers.find((u) => u.id === booking.userId)
        const room = getRoomById(booking.roomId)

        if (user && room) {
          const notificationService = new NotificationService()
          // Send reminder one day before check-in (simulated)
          await notificationService.sendCheckInReminder(booking, user, room)
        }
      } catch (error) {
        console.error("Failed to send check-in reminder:", error)
      }
    }

    return true
  }
  return false
}

export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  const bookingIndex = mockBookings.findIndex((booking) => booking.id === bookingId)
  if (bookingIndex !== -1) {
    const booking = mockBookings[bookingIndex]
    const success = await updateBookingStatus(bookingId, "cancelled")

    if (success) {
      try {
        const { getRoomById } = require("./rooms")
        const { mockUsers } = require("./auth")
        const user = mockUsers.find((u) => u.id === booking.userId)
        const room = getRoomById(booking.roomId)

        if (user && room) {
          const notificationService = new NotificationService()
          // Calculate refund amount (simplified - 50% if more than 24 hours before check-in)
          const hoursUntilCheckIn = (new Date(booking.checkInDate).getTime() - new Date().getTime()) / (1000 * 60 * 60)
          const refundAmount = hoursUntilCheckIn > 24 ? booking.totalAmount * 0.5 : 0

          await notificationService.sendCancellationConfirmation(booking, user, room, refundAmount)
        }
      } catch (error) {
        console.error("Failed to send cancellation confirmation:", error)
      }
    }

    return success
  }
  return false
}

export const updatePaymentStatus = (bookingId: string, paymentStatus: "pending" | "paid" | "refunded"): boolean => {
  const bookingIndex = mockBookings.findIndex((booking) => booking.id === bookingId)
  if (bookingIndex !== -1) {
    mockBookings[bookingIndex].paymentStatus = paymentStatus
    mockBookings[bookingIndex].updatedAt = new Date()
    return true
  }
  return false
}

// Get bookings with populated room and user data
export const getBookingsWithDetails = (bookings: Booking[] = mockBookings): Booking[] => {
  const { getRoomById } = require("./rooms")
  const { mockUsers } = require("./auth")

  return bookings.map((booking) => {
    const room = getRoomById(booking.roomId)
    const user = mockUsers.find((u) => u.id === booking.userId)

    return {
      ...booking,
      room: room
        ? {
            id: room.id,
            number: room.number,
            type: room.type,
            price: room.price,
          }
        : undefined,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        : undefined,
    }
  })
}
