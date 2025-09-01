// Email service for hotel management system
// In production, this would integrate with services like SendGrid, Mailgun, or AWS SES

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailData {
  to: string
  from: string
  subject: string
  html: string
  text: string
  attachments?: Array<{
    filename: string
    content: string
    type: string
  }>
}

// Mock email service - in production, replace with actual email provider
export class EmailService {
  private static instance: EmailService
  private sentEmails: EmailData[] = []

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock success/failure (95% success rate)
      const success = Math.random() > 0.05

      if (success) {
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        this.sentEmails.push({ ...emailData, subject: emailData.subject })

        console.log(`[Email Sent] To: ${emailData.to}, Subject: ${emailData.subject}`)
        return { success: true, messageId }
      } else {
        return { success: false, error: "Failed to send email" }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  getSentEmails(): EmailData[] {
    return [...this.sentEmails]
  }

  clearSentEmails(): void {
    this.sentEmails = []
  }
}

// Email template generator
export class EmailTemplates {
  private static hotelInfo = {
    name: "Grand Luxury Hotel",
    address: "123 Hotel Street, City, State 12345",
    phone: "(555) 123-4567",
    email: "info@grandluxuryhotel.com",
    website: "www.grandluxuryhotel.com",
  }

  static bookingConfirmation(data: {
    guestName: string
    bookingId: string
    roomType: string
    roomNumber: string
    checkInDate: string
    checkOutDate: string
    nights: number
    guests: number
    totalAmount: number
  }): EmailTemplate {
    const subject = `Booking Confirmation - ${data.bookingId} | ${this.hotelInfo.name}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 18px; color: #8B4513; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${this.hotelInfo.name}</h1>
              <h2>Booking Confirmation</h2>
            </div>
            
            <div class="content">
              <p>Dear ${data.guestName},</p>
              
              <p>Thank you for choosing ${this.hotelInfo.name}! We're delighted to confirm your reservation.</p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span>Booking ID:</span>
                  <span><strong>${data.bookingId}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Room Type:</span>
                  <span>${data.roomType}</span>
                </div>
                <div class="detail-row">
                  <span>Room Number:</span>
                  <span>${data.roomNumber}</span>
                </div>
                <div class="detail-row">
                  <span>Check-in:</span>
                  <span>${data.checkInDate}</span>
                </div>
                <div class="detail-row">
                  <span>Check-out:</span>
                  <span>${data.checkOutDate}</span>
                </div>
                <div class="detail-row">
                  <span>Nights:</span>
                  <span>${data.nights}</span>
                </div>
                <div class="detail-row">
                  <span>Guests:</span>
                  <span>${data.guests}</span>
                </div>
                <div class="detail-row total">
                  <span>Total Amount:</span>
                  <span>$${data.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <p><strong>Check-in Time:</strong> 3:00 PM<br>
              <strong>Check-out Time:</strong> 11:00 AM</p>
              
              <p>We look forward to welcoming you to ${this.hotelInfo.name}. If you have any questions or special requests, please don't hesitate to contact us.</p>
            </div>
            
            <div class="footer">
              <p>${this.hotelInfo.name}<br>
              ${this.hotelInfo.address}<br>
              Phone: ${this.hotelInfo.phone} | Email: ${this.hotelInfo.email}</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      ${this.hotelInfo.name} - Booking Confirmation
      
      Dear ${data.guestName},
      
      Thank you for choosing ${this.hotelInfo.name}! We're delighted to confirm your reservation.
      
      Booking Details:
      - Booking ID: ${data.bookingId}
      - Room Type: ${data.roomType}
      - Room Number: ${data.roomNumber}
      - Check-in: ${data.checkInDate}
      - Check-out: ${data.checkOutDate}
      - Nights: ${data.nights}
      - Guests: ${data.guests}
      - Total Amount: $${data.totalAmount.toLocaleString()}
      
      Check-in Time: 3:00 PM
      Check-out Time: 11:00 AM
      
      We look forward to welcoming you to ${this.hotelInfo.name}.
      
      ${this.hotelInfo.name}
      ${this.hotelInfo.address}
      Phone: ${this.hotelInfo.phone}
      Email: ${this.hotelInfo.email}
    `

    return { subject, html, text }
  }

  static paymentConfirmation(data: {
    guestName: string
    bookingId: string
    paymentId: string
    amount: number
    paymentMethod: string
    transactionDate: string
  }): EmailTemplate {
    const subject = `Payment Confirmation - ${data.paymentId} | ${this.hotelInfo.name}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #228B22 0%, #32CD32 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .amount { font-weight: bold; font-size: 24px; color: #228B22; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Payment Confirmed</h1>
              <h2>${this.hotelInfo.name}</h2>
            </div>
            
            <div class="content">
              <p>Dear ${data.guestName},</p>
              
              <p>Your payment has been successfully processed. Thank you for your payment!</p>
              
              <div class="payment-details">
                <h3>Payment Details</h3>
                <div class="detail-row">
                  <span>Payment ID:</span>
                  <span><strong>${data.paymentId}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Booking ID:</span>
                  <span>${data.bookingId}</span>
                </div>
                <div class="detail-row">
                  <span>Payment Method:</span>
                  <span>${data.paymentMethod}</span>
                </div>
                <div class="detail-row">
                  <span>Transaction Date:</span>
                  <span>${data.transactionDate}</span>
                </div>
                <div class="detail-row amount">
                  <span>Amount Paid:</span>
                  <span>$${data.amount.toLocaleString()}</span>
                </div>
              </div>
              
              <p>This email serves as your receipt. Please keep it for your records.</p>
              
              <p>If you have any questions about this payment, please contact us immediately.</p>
            </div>
            
            <div class="footer">
              <p>${this.hotelInfo.name}<br>
              ${this.hotelInfo.address}<br>
              Phone: ${this.hotelInfo.phone} | Email: ${this.hotelInfo.email}</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Payment Confirmation - ${this.hotelInfo.name}
      
      Dear ${data.guestName},
      
      Your payment has been successfully processed. Thank you for your payment!
      
      Payment Details:
      - Payment ID: ${data.paymentId}
      - Booking ID: ${data.bookingId}
      - Payment Method: ${data.paymentMethod}
      - Transaction Date: ${data.transactionDate}
      - Amount Paid: $${data.amount.toLocaleString()}
      
      This email serves as your receipt. Please keep it for your records.
      
      ${this.hotelInfo.name}
      ${this.hotelInfo.address}
      Phone: ${this.hotelInfo.phone}
      Email: ${this.hotelInfo.email}
    `

    return { subject, html, text }
  }

  static checkInReminder(data: {
    guestName: string
    bookingId: string
    roomNumber: string
    checkInDate: string
    checkInTime: string
  }): EmailTemplate {
    const subject = `Check-in Reminder - Tomorrow at ${this.hotelInfo.name}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Check-in Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4169E1 0%, #87CEEB 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .reminder-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4169E1; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Check-in Reminder</h1>
              <h2>${this.hotelInfo.name}</h2>
            </div>
            
            <div class="content">
              <p>Dear ${data.guestName},</p>
              
              <p>We're excited to welcome you to ${this.hotelInfo.name} tomorrow!</p>
              
              <div class="reminder-box">
                <h3>Your Check-in Details</h3>
                <p><strong>Date:</strong> ${data.checkInDate}<br>
                <strong>Time:</strong> ${data.checkInTime}<br>
                <strong>Room:</strong> ${data.roomNumber}<br>
                <strong>Booking ID:</strong> ${data.bookingId}</p>
              </div>
              
              <p><strong>What to bring:</strong></p>
              <ul>
                <li>Valid photo ID (driver's license or passport)</li>
                <li>Credit card for incidentals</li>
                <li>Booking confirmation (this email)</li>
              </ul>
              
              <p><strong>Check-in Process:</strong></p>
              <ul>
                <li>Visit our front desk in the main lobby</li>
                <li>Present your ID and booking confirmation</li>
                <li>Receive your room key and welcome packet</li>
              </ul>
              
              <p>If you need to modify your arrival time or have any special requests, please contact us as soon as possible.</p>
              
              <p>We look forward to providing you with an exceptional stay!</p>
            </div>
            
            <div class="footer">
              <p>${this.hotelInfo.name}<br>
              ${this.hotelInfo.address}<br>
              Phone: ${this.hotelInfo.phone} | Email: ${this.hotelInfo.email}</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Check-in Reminder - ${this.hotelInfo.name}
      
      Dear ${data.guestName},
      
      We're excited to welcome you to ${this.hotelInfo.name} tomorrow!
      
      Your Check-in Details:
      - Date: ${data.checkInDate}
      - Time: ${data.checkInTime}
      - Room: ${data.roomNumber}
      - Booking ID: ${data.bookingId}
      
      What to bring:
      - Valid photo ID (driver's license or passport)
      - Credit card for incidentals
      - Booking confirmation (this email)
      
      Check-in Process:
      - Visit our front desk in the main lobby
      - Present your ID and booking confirmation
      - Receive your room key and welcome packet
      
      We look forward to providing you with an exceptional stay!
      
      ${this.hotelInfo.name}
      ${this.hotelInfo.address}
      Phone: ${this.hotelInfo.phone}
      Email: ${this.hotelInfo.email}
    `

    return { subject, html, text }
  }

  static bookingCancellation(data: {
    guestName: string
    bookingId: string
    roomType: string
    checkInDate: string
    checkOutDate: string
    refundAmount?: number
  }): EmailTemplate {
    const subject = `Booking Cancellation Confirmation - ${data.bookingId} | ${this.hotelInfo.name}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Cancellation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #DC143C 0%, #FF6347 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .cancellation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
              <h2>${this.hotelInfo.name}</h2>
            </div>
            
            <div class="content">
              <p>Dear ${data.guestName},</p>
              
              <p>We have successfully cancelled your booking as requested. We're sorry to see you won't be staying with us this time.</p>
              
              <div class="cancellation-details">
                <h3>Cancelled Booking Details</h3>
                <p><strong>Booking ID:</strong> ${data.bookingId}<br>
                <strong>Room Type:</strong> ${data.roomType}<br>
                <strong>Check-in Date:</strong> ${data.checkInDate}<br>
                <strong>Check-out Date:</strong> ${data.checkOutDate}</p>
                
                ${
                  data.refundAmount
                    ? `<p><strong>Refund Amount:</strong> $${data.refundAmount.toLocaleString()}<br>
                <em>Refunds typically process within 3-5 business days.</em></p>`
                    : ""
                }
              </div>
              
              <p>We hope to have the opportunity to welcome you to ${this.hotelInfo.name} in the future. If you have any questions about this cancellation, please don't hesitate to contact us.</p>
            </div>
            
            <div class="footer">
              <p>${this.hotelInfo.name}<br>
              ${this.hotelInfo.address}<br>
              Phone: ${this.hotelInfo.phone} | Email: ${this.hotelInfo.email}</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Booking Cancellation Confirmation - ${this.hotelInfo.name}
      
      Dear ${data.guestName},
      
      We have successfully cancelled your booking as requested.
      
      Cancelled Booking Details:
      - Booking ID: ${data.bookingId}
      - Room Type: ${data.roomType}
      - Check-in Date: ${data.checkInDate}
      - Check-out Date: ${data.checkOutDate}
      ${data.refundAmount ? `- Refund Amount: $${data.refundAmount.toLocaleString()}` : ""}
      
      ${data.refundAmount ? "Refunds typically process within 3-5 business days." : ""}
      
      We hope to welcome you in the future!
      
      ${this.hotelInfo.name}
      ${this.hotelInfo.address}
      Phone: ${this.hotelInfo.phone}
      Email: ${this.hotelInfo.email}
    `

    return { subject, html, text }
  }
}

// Email notification service
export class NotificationService {
  private emailService: EmailService

  constructor() {
    this.emailService = EmailService.getInstance()
  }

  async sendBookingConfirmation(bookingData: any, userData: any, roomData: any): Promise<boolean> {
    try {
      const template = EmailTemplates.bookingConfirmation({
        guestName: userData.name,
        bookingId: bookingData.id,
        roomType: roomData.type,
        roomNumber: roomData.number,
        checkInDate: new Date(bookingData.checkInDate).toLocaleDateString(),
        checkOutDate: new Date(bookingData.checkOutDate).toLocaleDateString(),
        nights: bookingData.nights,
        guests: bookingData.guests,
        totalAmount: bookingData.totalAmount,
      })

      const result = await this.emailService.sendEmail({
        to: userData.email,
        from: "reservations@grandluxuryhotel.com",
        subject: template.subject,
        html: template.html,
        text: template.text,
      })

      return result.success
    } catch (error) {
      console.error("Failed to send booking confirmation:", error)
      return false
    }
  }

  async sendPaymentConfirmation(paymentData: any, bookingData: any, userData: any): Promise<boolean> {
    try {
      const template = EmailTemplates.paymentConfirmation({
        guestName: userData.name,
        bookingId: bookingData.id,
        paymentId: paymentData.id,
        amount: paymentData.amount,
        paymentMethod: `**** **** **** ${paymentData.cardNumber.slice(-4)}`,
        transactionDate: new Date(paymentData.createdAt).toLocaleDateString(),
      })

      const result = await this.emailService.sendEmail({
        to: userData.email,
        from: "payments@grandluxuryhotel.com",
        subject: template.subject,
        html: template.html,
        text: template.text,
      })

      return result.success
    } catch (error) {
      console.error("Failed to send payment confirmation:", error)
      return false
    }
  }

  async sendCheckInReminder(bookingData: any, userData: any, roomData: any): Promise<boolean> {
    try {
      const template = EmailTemplates.checkInReminder({
        guestName: userData.name,
        bookingId: bookingData.id,
        roomNumber: roomData.number,
        checkInDate: new Date(bookingData.checkInDate).toLocaleDateString(),
        checkInTime: "3:00 PM",
      })

      const result = await this.emailService.sendEmail({
        to: userData.email,
        from: "frontdesk@grandluxuryhotel.com",
        subject: template.subject,
        html: template.html,
        text: template.text,
      })

      return result.success
    } catch (error) {
      console.error("Failed to send check-in reminder:", error)
      return false
    }
  }

  async sendCancellationConfirmation(
    bookingData: any,
    userData: any,
    roomData: any,
    refundAmount?: number,
  ): Promise<boolean> {
    try {
      const template = EmailTemplates.bookingCancellation({
        guestName: userData.name,
        bookingId: bookingData.id,
        roomType: roomData.type,
        checkInDate: new Date(bookingData.checkInDate).toLocaleDateString(),
        checkOutDate: new Date(bookingData.checkOutDate).toLocaleDateString(),
        refundAmount,
      })

      const result = await this.emailService.sendEmail({
        to: userData.email,
        from: "reservations@grandluxuryhotel.com",
        subject: template.subject,
        html: template.html,
        text: template.text,
      })

      return result.success
    } catch (error) {
      console.error("Failed to send cancellation confirmation:", error)
      return false
    }
  }
}
