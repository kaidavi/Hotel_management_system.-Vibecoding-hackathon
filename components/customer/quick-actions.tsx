"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Calendar, Hotel, User, Phone, Mail, Gift } from "lucide-react"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Book a Room",
      description: "Find and reserve your perfect stay",
      icon: Hotel,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      action: () => router.push("/rooms"),
    },
    {
      title: "My Bookings",
      description: "View and manage your reservations",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      action: () => router.push("/bookings"),
    },
    {
      title: "Profile Settings",
      description: "Update your account information",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      action: () => router.push("/profile"),
    },
    {
      title: "Contact Concierge",
      description: "Get assistance with your stay",
      icon: Phone,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
      action: () => alert("Concierge service: Call (555) 123-4567"),
    },
    {
      title: "Special Offers",
      description: "View exclusive deals and packages",
      icon: Gift,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
      action: () => router.push("/offers"),
    },
    {
      title: "Newsletter",
      description: "Subscribe to hotel updates",
      icon: Mail,
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900",
      action: () => alert("Newsletter subscription coming soon!"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your hotel experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-muted/50 bg-transparent"
              onClick={action.action}
            >
              <div className={`p-2 rounded-full ${action.bgColor}`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
