"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCustomerStats } from "@/lib/customer-analytics"
import { User, Mail, Calendar, Award, Edit, Save, X } from "lucide-react"
import { format } from "date-fns"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  if (!isAuthenticated || !user) {
    router.push("/login")
    return null
  }

  const stats = getCustomerStats(user.id)

  const handleSave = () => {
    // In a real app, this would update the user profile
    alert("Profile updated successfully!")
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Role</Label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <Badge className="capitalize">{user.role}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(stats.memberSince, "MMMM dd, yyyy")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Your booking and communication preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Room Type</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <span className="capitalize">{stats.favoriteRoomType}</span>
                  <Badge variant="secondary">Based on booking history</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Communication Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email-notifications" defaultChecked />
                    <Label htmlFor="email-notifications" className="text-sm">
                      Email notifications for bookings
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="promotional-emails" defaultChecked />
                    <Label htmlFor="promotional-emails" className="text-sm">
                      Promotional offers and updates
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sms-notifications" />
                    <Label htmlFor="sms-notifications" className="text-sm">
                      SMS notifications
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Your membership overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <Award className="h-8 w-8 text-hotel-gold mx-auto mb-2" />
                <Badge className="bg-hotel-gold text-white mb-2">
                  {stats.totalBookings >= 10 ? "VIP Guest" : stats.totalBookings >= 5 ? "Gold Member" : "Silver Member"}
                </Badge>
                <p className="text-sm text-muted-foreground">Membership Status</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                  <span className="font-medium">{stats.totalBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed Stays</span>
                  <span className="font-medium">{stats.completedStays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <span className="font-medium">${stats.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Loyalty Points</span>
                  <span className="font-medium text-hotel-gold">{stats.loyaltyPoints.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/bookings")}>
                View My Bookings
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/rooms")}>
                Book New Room
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => alert("Support: (555) 123-4567")}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
