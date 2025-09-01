"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/lib/analytics"
import { Hotel, Users, Calendar, DollarSign, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react"

export function DashboardStats() {
  const stats = getDashboardStats()

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      description: `$${stats.monthlyRevenue.toLocaleString()} this month`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      description: `${stats.occupiedRooms} of ${stats.totalRooms} rooms occupied`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      description: `${stats.pendingBookings} pending approval`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Active Guests",
      value: stats.checkedInGuests.toString(),
      description: `${stats.confirmedBookings} arriving soon`,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
  ]

  const roomStatusCards = [
    {
      title: "Available Rooms",
      value: stats.availableRooms,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Occupied Rooms",
      value: stats.occupiedRooms,
      icon: Hotel,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Maintenance",
      value: stats.maintenanceRooms,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
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

      {/* Room Status */}
      <Card>
        <CardHeader>
          <CardTitle>Room Status Overview</CardTitle>
          <CardDescription>Current status of all hotel rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roomStatusCards.map((stat) => (
              <div key={stat.title} className="flex items-center space-x-4 p-4 rounded-lg border">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
