"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecentBookings } from "@/lib/customer-analytics"
import { Calendar, MapPin, Star } from "lucide-react"
import { format } from "date-fns"

interface RecentActivityProps {
  userId: string
}

export function RecentActivity({ userId }: RecentActivityProps) {
  const recentBookings = getRecentBookings(userId, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked-out":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your booking history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.length > 0 ? (
            recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Room {booking.room?.number}</p>
                      <Badge className="capitalize">{booking.room?.type}</Badge>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(new Date(booking.checkInDate), "MMM dd")} -{" "}
                          {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${booking.totalAmount}</p>
                  {booking.status === "checked-out" && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" />
                      <span>Rate your stay</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
