"use client"

import { useParams, useRouter } from "next/navigation"
import { mockPayments } from "@/lib/payments"
import { getBookingById, getBookingsWithDetails } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CreditCard, Receipt, Mail } from "lucide-react"
import { format } from "date-fns"

export default function PaymentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params.paymentId as string

  const payment = mockPayments.find((p) => p.id === paymentId)
  const booking = payment ? getBookingById(payment.bookingId) : null
  const [bookingWithDetails] = getBookingsWithDetails(booking ? [booking] : [])

  if (!payment || !bookingWithDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Not Found</h1>
        <p className="text-muted-foreground mb-8">The payment confirmation could not be found.</p>
        <Button onClick={() => router.push("/bookings")}>View My Bookings</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground">Your payment has been processed successfully</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Receipt
          </CardTitle>
          <CardDescription>Transaction #{payment.transactionId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Payment Status</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              {payment.status}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span>Amount Paid</span>
            <span className="font-semibold text-lg">${payment.amount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Payment Method</span>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>
                {payment.cardBrand} •••• {payment.cardLast4}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span>Transaction Date</span>
            <span>{format(payment.createdAt, "MMM dd, yyyy 'at' h:mm a")}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Room</span>
            <span>
              {bookingWithDetails.room?.number} - {bookingWithDetails.room?.type}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Check-in</span>
            <span>{format(new Date(bookingWithDetails.checkInDate), "MMM dd, yyyy")}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Check-out</span>
            <span>{format(new Date(bookingWithDetails.checkOutDate), "MMM dd, yyyy")}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Guests</span>
            <span>{bookingWithDetails.guests}</span>
          </div>
        </CardContent>
      </Card>

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
                A receipt and booking confirmation has been sent to your email address.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">Booking Confirmed</div>
              <div className="text-sm text-muted-foreground">
                Your reservation is now confirmed and ready for your arrival.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={() => router.push(`/booking/confirmation/${bookingWithDetails.id}`)} className="flex-1">
          View Booking Details
        </Button>
        <Button variant="outline" onClick={() => router.push("/rooms")} className="flex-1">
          Book Another Room
        </Button>
      </div>
    </div>
  )
}
