"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { EmailService, type EmailData } from "@/lib/email"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Search, RefreshCw, Eye, Trash2 } from "lucide-react"

export default function AdminEmailsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [sentEmails, setSentEmails] = useState<EmailData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null)

  useEffect(() => {
    loadSentEmails()
  }, [])

  const loadSentEmails = () => {
    const emailService = EmailService.getInstance()
    setSentEmails(emailService.getSentEmails())
  }

  const clearAllEmails = () => {
    if (confirm("Are you sure you want to clear all sent emails? This action cannot be undone.")) {
      const emailService = EmailService.getInstance()
      emailService.clearSentEmails()
      setSentEmails([])
      setSelectedEmail(null)
    }
  }

  const filteredEmails = sentEmails.filter((email) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      email.to.toLowerCase().includes(searchLower) ||
      email.subject.toLowerCase().includes(searchLower) ||
      email.from.toLowerCase().includes(searchLower)
    )
  })

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-hotel-gold mb-2">Email Management</h1>
            <p className="text-muted-foreground">View and manage sent email notifications</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadSentEmails} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={clearAllEmails} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                  <p className="text-2xl font-bold">{sentEmails.length}</p>
                </div>
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Booking Confirmations</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {sentEmails.filter((e) => e.subject.includes("Booking Confirmation")).length}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Bookings</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Confirmations</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sentEmails.filter((e) => e.subject.includes("Payment Confirmation")).length}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Payments</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails by recipient, subject, or sender..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Email List</TabsTrigger>
          <TabsTrigger value="preview" disabled={!selectedEmail}>
            Email Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredEmails.length > 0 ? (
            <div className="space-y-4">
              {filteredEmails.map((email, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{email.subject}</h3>
                          <Badge variant="outline">
                            {email.subject.includes("Booking")
                              ? "Booking"
                              : email.subject.includes("Payment")
                                ? "Payment"
                                : email.subject.includes("Check-in")
                                  ? "Reminder"
                                  : email.subject.includes("Cancellation")
                                    ? "Cancellation"
                                    : "Other"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>To:</strong> {email.to}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>From:</strong> {email.from}
                        </p>
                        <p className="text-xs text-muted-foreground">Sent: {new Date().toLocaleString()}</p>
                      </div>
                      <Button onClick={() => setSelectedEmail(email)} variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchTerm ? "No emails found matching your search." : "No emails sent yet."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview">
          {selectedEmail ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Email Preview</span>
                  <Button onClick={() => setSelectedEmail(null)} variant="outline" size="sm">
                    Close Preview
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p>
                      <strong>Subject:</strong> {selectedEmail.subject}
                    </p>
                    <p>
                      <strong>To:</strong> {selectedEmail.to}
                    </p>
                    <p>
                      <strong>From:</strong> {selectedEmail.from}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Select an email to preview</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
