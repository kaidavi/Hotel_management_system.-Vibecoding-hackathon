"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CustomerStats } from "@/components/customer/customer-stats"
import { UpcomingBookings } from "@/components/customer/upcoming-bookings"
import { RecentActivity } from "@/components/customer/recent-activity"
import { QuickActions } from "@/components/customer/quick-actions"

export default function CustomerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "customer")) {
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

  if (!isAuthenticated || user?.role !== "customer") {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Manage your bookings and explore our luxury hotel services.</p>
      </div>

      <div className="space-y-8">
        {/* Customer Stats */}
        <CustomerStats userId={user.id} />

        {/* Upcoming Bookings */}
        <UpcomingBookings userId={user.id} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity userId={user.id} />
      </div>
    </div>
  )
}
