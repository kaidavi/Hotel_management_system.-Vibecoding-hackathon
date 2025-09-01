"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-cream to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-hotel-gold mb-4">Grand Hotel</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience luxury hospitality with our comprehensive hotel management system. Book rooms, manage
            reservations, and enjoy world-class service.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/rooms")}>
              View Rooms
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-hotel-gold">Room Management</CardTitle>
              <CardDescription>Comprehensive room inventory and availability tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage room types, pricing, amenities, and real-time availability with our intuitive dashboard.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-hotel-gold">Smart Booking</CardTitle>
              <CardDescription>Seamless reservation system with instant confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced booking engine with availability checking, payment processing, and automated confirmations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-hotel-gold">Multi-Role Access</CardTitle>
              <CardDescription>Tailored dashboards for admins, staff, and customers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Role-based access control with specialized interfaces for different user types and responsibilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
