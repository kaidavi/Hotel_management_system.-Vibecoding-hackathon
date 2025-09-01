export type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "bank_transfer"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"

export interface PaymentDetails {
  id: string
  bookingId: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  createdAt: Date
  updatedAt: Date
  // Card details (encrypted in real app)
  cardLast4?: string
  cardBrand?: string
  billingAddress?: BillingAddress
}

export interface BillingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface CreditCardInfo {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
}

export interface PaymentRequest {
  bookingId: string
  amount: number
  method: PaymentMethod
  cardInfo?: CreditCardInfo
  billingAddress: BillingAddress
}

// Mock payment data
export const mockPayments: PaymentDetails[] = [
  {
    id: "pay_1",
    bookingId: "1",
    amount: 450,
    currency: "USD",
    method: "credit_card",
    status: "completed",
    transactionId: "txn_abc123",
    cardLast4: "4242",
    cardBrand: "Visa",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    id: "pay_2",
    bookingId: "2",
    amount: 750,
    currency: "USD",
    method: "credit_card",
    status: "pending",
    cardLast4: "1234",
    cardBrand: "Mastercard",
    createdAt: new Date("2024-12-02"),
    updatedAt: new Date("2024-12-02"),
  },
]

import { NotificationService } from "./email"

// Payment processing functions
export const processPayment = async (paymentRequest: PaymentRequest): Promise<PaymentDetails> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock payment processing logic
  const isSuccessful = Math.random() > 0.1 // 90% success rate

  const payment: PaymentDetails = {
    id: `pay_${Date.now()}`,
    bookingId: paymentRequest.bookingId,
    amount: paymentRequest.amount,
    currency: "USD",
    method: paymentRequest.method,
    status: isSuccessful ? "completed" : "failed",
    transactionId: isSuccessful ? `txn_${Math.random().toString(36).substr(2, 9)}` : undefined,
    cardLast4: paymentRequest.cardInfo?.cardNumber.slice(-4),
    cardBrand: getCardBrand(paymentRequest.cardInfo?.cardNumber || ""),
    billingAddress: paymentRequest.billingAddress,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockPayments.push(payment)

  if (isSuccessful) {
    try {
      const { getBookingById } = require("./bookings")
      const { mockUsers } = require("./auth")
      const booking = getBookingById(paymentRequest.bookingId)

      if (booking) {
        const user = mockUsers.find((u) => u.id === booking.userId)
        if (user) {
          const notificationService = new NotificationService()
          await notificationService.sendPaymentConfirmation(
            { ...payment, cardNumber: paymentRequest.cardInfo?.cardNumber || "" },
            booking,
            user,
          )
        }
      }
    } catch (error) {
      console.error("Failed to send payment confirmation email:", error)
    }
  }

  return payment
}

export const getCardBrand = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, "")
  if (number.startsWith("4")) return "Visa"
  if (number.startsWith("5") || number.startsWith("2")) return "Mastercard"
  if (number.startsWith("3")) return "American Express"
  if (number.startsWith("6")) return "Discover"
  return "Unknown"
}

export const validateCardNumber = (cardNumber: string): boolean => {
  const number = cardNumber.replace(/\s/g, "")
  if (!/^\d{13,19}$/.test(number)) return false

  // Luhn algorithm
  let sum = 0
  let isEven = false
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(number[i])
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    isEven = !isEven
  }
  return sum % 10 === 0
}

export const validateExpiryDate = (month: string, year: string): boolean => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const expMonth = Number.parseInt(month)
  const expYear = Number.parseInt(year)

  if (expMonth < 1 || expMonth > 12) return false
  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false

  return true
}

export const validateCVV = (cvv: string, cardBrand: string): boolean => {
  if (cardBrand === "American Express") {
    return /^\d{4}$/.test(cvv)
  }
  return /^\d{3}$/.test(cvv)
}

export const formatCardNumber = (value: string): string => {
  const number = value.replace(/\s/g, "")
  const match = number.match(/\d{1,4}/g)
  return match ? match.join(" ") : ""
}

export const getPaymentByBookingId = (bookingId: string): PaymentDetails | undefined => {
  return mockPayments.find((payment) => payment.bookingId === bookingId)
}

export const refundPayment = async (paymentId: string): Promise<boolean> => {
  const paymentIndex = mockPayments.findIndex((payment) => payment.id === paymentId)
  if (paymentIndex !== -1) {
    mockPayments[paymentIndex].status = "refunded"
    mockPayments[paymentIndex].updatedAt = new Date()
    return true
  }
  return false
}
