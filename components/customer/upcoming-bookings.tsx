"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUpcomingBookings } from "@/lib/customer-analytics"
import { Calendar, Users, MapPin, Clock, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface UpcomingBookingsProps {
  userId: string
}

export function UpcomingBookings({ userId }: UpcomingBookingsProps) {
  const upcomingBookings = getUpcomingBookings(userId)
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return "text-red-600"
    if (days <= 7) return "text-orange-600"
    return "text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Stays</CardTitle>
          <CardDescription>Your confirmed reservations</CardDescription>
        </div>
        <Button variant="outline" onClick={() => router.push("/bookings")}>
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Room {booking.room?.number}</p>
                      <Badge className="capitalize">{booking.room?.type}</Badge>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(booking.checkInDate), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{booking.guests} guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className={`h-3 w-3 ${getUrgencyColor(booking.daysUntilCheckIn)}`} />
                        <span className={getUrgencyColor(booking.daysUntilCheckIn)}>
                          {booking.daysUntilCheckIn === 0
                            ? "Today"
                            : booking.daysUntilCheckIn === 1
                              ? "Tomorrow"
                              : `${booking.daysUntilCheckIn} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold">${booking.totalAmount}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.ceil(
                        (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      nights
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/booking/confirmation/${booking.id}`)}>
                    View
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No upcoming bookings</p>
              <Button onClick={() => router.push("/rooms")}>Browse Rooms</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
