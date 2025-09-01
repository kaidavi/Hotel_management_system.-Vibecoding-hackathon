"use client"

import { useParams, useRouter } from "next/navigation"
import { getBookingById, getBookingsWithDetails } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Users, DollarSign, Mail, Phone } from "lucide-react"
import { format } from "date-fns"

export default function BookingConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const booking = getBookingById(bookingId)
  const [bookingWithDetails] = getBookingsWithDetails(booking ? [booking] : [])

  if (!bookingWithDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-muted-foreground mb-8">The booking confirmation could not be found.</p>
        <Button onClick={() => router.push("/rooms")}>Browse Rooms</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">Your reservation has been successfully created</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Booking Details</CardTitle>
              <CardDescription>Confirmation #{bookingWithDetails.id}</CardDescription>
            </div>
            <Badge
              className={
                bookingWithDetails.status === "confirmed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              }
            >
              {bookingWithDetails.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Room Information */}
          <div className="space-y-2">
            <h3 className="font-semibold">Room Information</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  Room {bookingWithDetails.room?.number} - {bookingWithDetails.room?.type}
                </span>
                <span className="text-primary font-semibold">${bookingWithDetails.room?.price}/night</span>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="space-y-2">
            <h3 className="font-semibold">Stay Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Check-in</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(bookingWithDetails.checkInDate), "EEEE, MMM dd, yyyy")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Check-out</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(bookingWithDetails.checkOutDate), "EEEE, MMM dd, yyyy")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-2">
            <h3 className="font-semibold">Guest Information</h3>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {bookingWithDetails.guests} guest{bookingWithDetails.guests > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Special Requests */}
          {bookingWithDetails.specialRequests && (
            <div className="space-y-2">
              <h3 className="font-semibold">Special Requests</h3>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {bookingWithDetails.specialRequests}
              </p>
            </div>
          )}

          {/* Payment Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold">Payment Summary</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Total Amount
                </span>
                <span className="text-primary">${bookingWithDetails.totalAmount}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Payment Status:{" "}
                <Badge className="ml-1" variant={bookingWithDetails.paymentStatus === "paid" ? "default" : "secondary"}>
                  {bookingWithDetails.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">Confirmation Email</div>
              <div className="text-sm text-muted-foreground">
                A confirmation email has been sent to your registered email address with all booking details.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">Need Help?</div>
              <div className="text-sm text-muted-foreground">
                Contact our front desk at (555) 123-4567 for any questions or special arrangements.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/bookings")} className="flex-1">
          View My Bookings
        </Button>
        <Button variant="outline" onClick={() => router.push("/rooms")} className="flex-1">
          Book Another Room
        </Button>
      </div>
    </div>
  )
}
