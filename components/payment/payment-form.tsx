"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  processPayment,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  formatCardNumber,
  getCardBrand,
  type PaymentRequest,
  type BillingAddress,
  type CreditCardInfo,
} from "@/lib/payments"
import { updatePaymentStatus } from "@/lib/bookings"
import type { Booking } from "@/lib/bookings"
import { CreditCard, Lock, Shield } from "lucide-react"

interface PaymentFormProps {
  booking: Booking
  onPaymentSuccess: (paymentId: string) => void
  onPaymentError: (error: string) => void
}

export function PaymentForm({ booking, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [cardInfo, setCardInfo] = useState<CreditCardInfo>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  })

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  })

  const handleCardInfoChange = (field: keyof CreditCardInfo, value: string) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value)
      if (value.replace(/\s/g, "").length <= 19) {
        setCardInfo((prev) => ({ ...prev, [field]: value }))
      }
    } else if (field === "expiryMonth" || field === "expiryYear") {
      if (/^\d*$/.test(value)) {
        setCardInfo((prev) => ({ ...prev, [field]: value }))
      }
    } else if (field === "cvv") {
      if (/^\d*$/.test(value) && value.length <= 4) {
        setCardInfo((prev) => ({ ...prev, [field]: value }))
      }
    } else {
      setCardInfo((prev) => ({ ...prev, [field]: value }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleBillingChange = (field: keyof BillingAddress, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Card validation
    if (!cardInfo.cardNumber) {
      newErrors.cardNumber = "Card number is required"
    } else if (!validateCardNumber(cardInfo.cardNumber)) {
      newErrors.cardNumber = "Invalid card number"
    }

    if (!cardInfo.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required"
    }

    if (!cardInfo.expiryMonth || !cardInfo.expiryYear) {
      newErrors.expiry = "Expiry date is required"
    } else if (!validateExpiryDate(cardInfo.expiryMonth, cardInfo.expiryYear)) {
      newErrors.expiry = "Invalid or expired date"
    }

    const cardBrand = getCardBrand(cardInfo.cardNumber)
    if (!cardInfo.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (!validateCVV(cardInfo.cvv, cardBrand)) {
      newErrors.cvv = `Invalid CVV (${cardBrand === "American Express" ? "4" : "3"} digits required)`
    }

    // Billing validation
    if (!billingAddress.firstName.trim()) newErrors.firstName = "First name is required"
    if (!billingAddress.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!billingAddress.email.trim()) newErrors.email = "Email is required"
    if (!billingAddress.phone.trim()) newErrors.phone = "Phone is required"
    if (!billingAddress.address.trim()) newErrors.address = "Address is required"
    if (!billingAddress.city.trim()) newErrors.city = "City is required"
    if (!billingAddress.state.trim()) newErrors.state = "State is required"
    if (!billingAddress.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const paymentRequest: PaymentRequest = {
        bookingId: booking.id,
        amount: booking.totalAmount,
        method: "credit_card",
        cardInfo,
        billingAddress,
      }

      const payment = await processPayment(paymentRequest)

      if (payment.status === "completed") {
        updatePaymentStatus(booking.id, "paid")
        onPaymentSuccess(payment.id)
      } else {
        onPaymentError("Payment failed. Please try again or use a different card.")
      }
    } catch (error) {
      onPaymentError("An error occurred while processing your payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const cardBrand = getCardBrand(cardInfo.cardNumber)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Room {booking.room?.number}</span>
              <span>${booking.room?.price}/night</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>
                {Math.ceil(
                  (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                nights
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">${booking.totalAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Information */}
      <Card>
        <CardHeader>
          <CardTitle>Card Information</CardTitle>
          <CardDescription>Enter your payment details securely</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardInfo.cardNumber}
                onChange={(e) => handleCardInfoChange("cardNumber", e.target.value)}
                className={errors.cardNumber ? "border-destructive" : ""}
              />
              {cardBrand !== "Unknown" && cardInfo.cardNumber && (
                <Badge className="absolute right-2 top-1/2 transform -translate-y-1/2" variant="secondary">
                  {cardBrand}
                </Badge>
              )}
            </div>
            {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={cardInfo.cardholderName}
              onChange={(e) => handleCardInfoChange("cardholderName", e.target.value)}
              className={errors.cardholderName ? "border-destructive" : ""}
            />
            {errors.cardholderName && <p className="text-sm text-destructive">{errors.cardholderName}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Month</Label>
              <Input
                id="expiryMonth"
                placeholder="MM"
                maxLength={2}
                value={cardInfo.expiryMonth}
                onChange={(e) => handleCardInfoChange("expiryMonth", e.target.value)}
                className={errors.expiry ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryYear">Year</Label>
              <Input
                id="expiryYear"
                placeholder="YYYY"
                maxLength={4}
                value={cardInfo.expiryYear}
                onChange={(e) => handleCardInfoChange("expiryYear", e.target.value)}
                className={errors.expiry ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                maxLength={4}
                value={cardInfo.cvv}
                onChange={(e) => handleCardInfoChange("cvv", e.target.value)}
                className={errors.cvv ? "border-destructive" : ""}
              />
            </div>
          </div>
          {(errors.expiry || errors.cvv) && <p className="text-sm text-destructive">{errors.expiry || errors.cvv}</p>}
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>Enter the billing address for your card</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={billingAddress.firstName}
                onChange={(e) => handleBillingChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={billingAddress.lastName}
                onChange={(e) => handleBillingChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={billingAddress.email}
                onChange={(e) => handleBillingChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={billingAddress.phone}
                onChange={(e) => handleBillingChange("phone", e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={billingAddress.address}
              onChange={(e) => handleBillingChange("address", e.target.value)}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={billingAddress.city}
                onChange={(e) => handleBillingChange("city", e.target.value)}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={billingAddress.state}
                onChange={(e) => handleBillingChange("state", e.target.value)}
                className={errors.state ? "border-destructive" : ""}
              />
              {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={billingAddress.zipCode}
                onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                className={errors.zipCode ? "border-destructive" : ""}
              />
              {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Pay ${booking.totalAmount}
          </div>
        )}
      </Button>
    </form>
  )
}
