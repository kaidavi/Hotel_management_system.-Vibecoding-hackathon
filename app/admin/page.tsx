"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { RoomTypeChart } from "@/components/admin/room-type-chart"

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff"))) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff")) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here's what's happening at your hotel today.
        </p>
      </div>

      <div className="space-y-8">
        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Charts */}
        <RoomTypeChart />

        {/* Recent Bookings */}
        <RecentBookings />
      </div>
    </div>
  )
}
