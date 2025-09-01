"use client"

import { useParams, useRouter } from "next/navigation"
import { getBookingById, getBookingsWithDetails } from "@/lib/bookings"
import { PaymentForm } from "@/components/payment/payment-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const bookingId = params.bookingId as string

  const booking = getBookingById(bookingId)
  const [bookingWithDetails] = getBookingsWithDetails(booking ? [booking] : [])

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-8">You need to be signed in to make a payment.</p>
        <Button onClick={() => router.push("/login")}>Sign In</Button>
      </div>
    )
  }

  if (!bookingWithDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-muted-foreground mb-8">The booking could not be found.</p>
        <Button onClick={() => router.push("/bookings")}>View My Bookings</Button>
      </div>
    )
  }

  if (bookingWithDetails.userId !== user.id) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">You don't have permission to access this booking.</p>
        <Button onClick={() => router.push("/bookings")}>View My Bookings</Button>
      </div>
    )
  }

  if (bookingWithDetails.paymentStatus === "paid") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Already Completed</h1>
        <p className="text-muted-foreground mb-8">This booking has already been paid for.</p>
        <Button onClick={() => router.push(`/booking/confirmation/${bookingId}`)}>View Booking Details</Button>
      </div>
    )
  }

  const handlePaymentSuccess = (paymentId: string) => {
    router.push(`/payment/success/${paymentId}`)
  }

  const handlePaymentError = (error: string) => {
    // In a real app, you might want to show a toast or modal
    alert(error)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hotel-gold mb-2">Complete Payment</h1>
        <p className="text-muted-foreground">Secure payment for your hotel reservation</p>
      </div>

      <PaymentForm
        booking={bookingWithDetails}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  )
}
