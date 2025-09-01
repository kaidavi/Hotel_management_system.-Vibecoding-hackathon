"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCustomerStats } from "@/lib/customer-analytics"
import { Calendar, MapPin, DollarSign, Award, Star, Clock } from "lucide-react"
import { format } from "date-fns"

interface CustomerStatsProps {
  userId: string
}

export function CustomerStats({ userId }: CustomerStatsProps) {
  const stats = getCustomerStats(userId)

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      description: `${stats.completedStays} completed stays`,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toLocaleString()}`,
      description: "Lifetime spending",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Loyalty Points",
      value: stats.loyaltyPoints.toLocaleString(),
      description: "Available to redeem",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Member Since",
      value: format(stats.memberSince, "MMM yyyy"),
      description: "Valued guest",
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Preferences</CardTitle>
          <CardDescription>Your booking history and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg border">
              <div className="p-3 rounded-full bg-hotel-gold/10">
                <MapPin className="h-6 w-6 text-hotel-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorite Room Type</p>
                <p className="text-lg font-semibold capitalize">{stats.favoriteRoomType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg border">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Stays</p>
                <p className="text-lg font-semibold">{stats.upcomingBookings}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg border">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Guest Status</p>
                <Badge className="bg-hotel-gold text-white">
                  {stats.totalBookings >= 10 ? "VIP Guest" : stats.totalBookings >= 5 ? "Gold Member" : "Silver Member"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
