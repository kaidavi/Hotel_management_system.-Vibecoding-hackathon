"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Booking } from "@/lib/bookings"
import { Calendar, Users, DollarSign } from "lucide-react"
import { format } from "date-fns"

interface BookingCardProps {
  booking: Booking
  onViewDetails?: (booking: Booking) => void
  onCancel?: (booking: Booking) => void
  onCheckIn?: (booking: Booking) => void
  onCheckOut?: (booking: Booking) => void
  variant?: "customer" | "admin"
}

export function BookingCard({
  booking,
  onViewDetails,
  onCancel,
  onCheckIn,
  onCheckOut,
  variant = "customer",
}: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "checked-in":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "checked-out":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "refunded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const canCancel = booking.status === "pending" || booking.status === "confirmed"
  const canCheckIn = booking.status === "confirmed"
  const canCheckOut = booking.status === "checked-in"

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {booking.room ? `Room ${booking.room.number}` : `Room ID: ${booking.roomId}`}
            </CardTitle>
            <CardDescription className="capitalize">
              {booking.room?.type || "Room"} • Booking #{booking.id}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            <Badge className={getPaymentStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Check-in</div>
              <div className="text-muted-foreground">{format(new Date(booking.checkInDate), "MMM dd, yyyy")}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Check-out</div>
              <div className="text-muted-foreground">{format(new Date(booking.checkOutDate), "MMM dd, yyyy")}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.guests} guest{booking.guests > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">${booking.totalAmount}</span>
          </div>
        </div>

        {variant === "admin" && booking.user && (
          <div className="text-sm">
            <div className="font-medium">Guest Information</div>
            <div className="text-muted-foreground">
              {booking.user.name} • {booking.user.email}
            </div>
          </div>
        )}

        {booking.specialRequests && (
          <div className="text-sm">
            <div className="font-medium">Special Requests</div>
            <div className="text-muted-foreground">{booking.specialRequests}</div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={() => onViewDetails?.(booking)} className="flex-1">
          View Details
        </Button>

        {variant === "admin" && (
          <>
            {canCheckIn && (
              <Button onClick={() => onCheckIn?.(booking)} className="flex-1">
                Check In
              </Button>
            )}
            {canCheckOut && (
              <Button onClick={() => onCheckOut?.(booking)} className="flex-1">
                Check Out
              </Button>
            )}
          </>
        )}

        {canCancel && (
          <Button variant="destructive" onClick={() => onCancel?.(booking)}>
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
