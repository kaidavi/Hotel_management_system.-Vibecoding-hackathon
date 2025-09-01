"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, DollarSign } from "lucide-react"
import type { Room } from "@/lib/rooms"
import { calculateNights, calculateTotalAmount, createBooking } from "@/lib/bookings"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface BookingFormProps {
  room: Room
  initialCheckIn?: string
  initialCheckOut?: string
  initialGuests?: number
}

export function BookingForm({ room, initialCheckIn, initialCheckOut, initialGuests }: BookingFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    checkInDate: initialCheckIn || "",
    checkOutDate: initialCheckOut || "",
    guests: initialGuests || 1,
    specialRequests: "",
  })

  const checkInDate = formData.checkInDate ? new Date(formData.checkInDate) : null
  const checkOutDate = formData.checkOutDate ? new Date(formData.checkOutDate) : null
  const nights = checkInDate && checkOutDate ? calculateNights(checkInDate, checkOutDate) : 0
  const totalAmount = checkInDate && checkOutDate ? calculateTotalAmount(room.price, checkInDate, checkOutDate) : 0

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const validateForm = (): boolean => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      setError("Please select check-in and check-out dates")
      return false
    }

    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkIn < today) {
      setError("Check-in date cannot be in the past")
      return false
    }

    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date")
      return false
    }

    if (formData.guests > room.capacity) {
      setError(`This room can accommodate maximum ${room.capacity} guests`)
      return false
    }

    if (formData.guests < 1) {
      setError("Number of guests must be at least 1")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push("/login")
      return
    }

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const booking = createBooking({
        userId: user.id,
        roomId: room.id,
        checkInDate: new Date(formData.checkInDate),
        checkOutDate: new Date(formData.checkOutDate),
        guests: formData.guests,
        specialRequests: formData.specialRequests,
      })

      router.push(`/payment/${booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking")
    } finally {
      setIsLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]
  // Get minimum checkout date (day after checkin)
  const minCheckOut = formData.checkInDate
    ? new Date(new Date(formData.checkInDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : today

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Room Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Room {room.number}</span>
            <Badge className="capitalize">{room.type}</Badge>
          </CardTitle>
          <CardDescription>{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={room.images[0] || "/placeholder.svg"}
              alt={`Room ${room.number}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Up to {room.capacity} guests</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>${room.price}/night</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Amenities</h4>
            <div className="flex flex-wrap gap-1">
              {room.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Book Your Stay</CardTitle>
          <CardDescription>Complete your reservation details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in Date</Label>
                <Input
                  id="checkIn"
                  type="date"
                  min={today}
                  value={formData.checkInDate}
                  onChange={(e) => handleInputChange("checkInDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out Date</Label>
                <Input
                  id="checkOut"
                  type="date"
                  min={minCheckOut}
                  value={formData.checkOutDate}
                  onChange={(e) => handleInputChange("checkOutDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={room.capacity}
                value={formData.guests}
                onChange={(e) => handleInputChange("guests", Number.parseInt(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">Maximum {room.capacity} guests for this room</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requests">Special Requests (Optional)</Label>
              <Textarea
                id="requests"
                placeholder="Any special requests or preferences..."
                value={formData.specialRequests}
                onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                rows={3}
              />
            </div>

            {/* Booking Summary */}
            {nights > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Duration
                      </span>
                      <span>
                        {nights} night{nights > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Rate
                      </span>
                      <span>${room.price}/night</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                      <span>Total Amount</span>
                      <span className="text-primary">${totalAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading || nights === 0}>
              {isLoading ? "Processing..." : `Continue to Payment - $${totalAmount}`}
            </Button>

            {!user && (
              <p className="text-sm text-muted-foreground text-center">
                <Button variant="link" onClick={() => router.push("/login")} className="p-0 h-auto">
                  Sign in
                </Button>{" "}
                to complete your booking
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
