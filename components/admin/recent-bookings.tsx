"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getRecentBookings } from "@/lib/analytics"
import { format } from "date-fns"
import { Calendar, Users, DollarSign, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function RecentBookings() {
  const recentBookings = getRecentBookings(5)
  const router = useRouter()

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest reservations and their status</CardDescription>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/bookings")}>
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {booking.user?.name || "Guest"} - Room {booking.room?.number}
                    </p>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(booking.checkInDate), "MMM dd")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{booking.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/bookings/${booking.id}`)}>
                View Details
              </Button>
            </div>
          ))}
          {recentBookings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent bookings found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
