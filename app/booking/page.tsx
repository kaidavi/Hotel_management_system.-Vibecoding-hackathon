"use client"

import { useSearchParams } from "next/navigation"
import { getRoomById } from "@/lib/rooms"
import { BookingForm } from "@/components/booking/booking-form"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function BookingPage() {
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const roomId = searchParams.get("roomId")
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const guests = searchParams.get("guests")

  if (!roomId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
        <p className="text-muted-foreground mb-8">Please select a room to book.</p>
        <Button onClick={() => router.push("/rooms")}>Browse Rooms</Button>
      </div>
    )
  }

  const room = getRoomById(roomId)

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
        <p className="text-muted-foreground mb-8">The selected room could not be found.</p>
        <Button onClick={() => router.push("/rooms")}>Browse Rooms</Button>
      </div>
    )
  }

  if (room.status !== "available") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Room Unavailable</h1>
        <p className="text-muted-foreground mb-8">
          This room is currently {room.status} and cannot be booked at this time.
        </p>
        <Button onClick={() => router.push("/rooms")}>Browse Available Rooms</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">Review room details and confirm your reservation</p>
      </div>

      <BookingForm
        room={room}
        initialCheckIn={checkIn || undefined}
        initialCheckOut={checkOut || undefined}
        initialGuests={guests ? Number.parseInt(guests) : undefined}
      />
    </div>
  )
}
