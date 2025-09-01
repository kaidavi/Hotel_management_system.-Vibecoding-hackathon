"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Hotel, User, LogOut, Settings, Calendar, Users, BarChart3, Mail } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Hotel className="h-6 w-6 text-hotel-gold" />
            <span className="text-xl font-bold text-hotel-gold">Grand Hotel</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/rooms")}>
              Rooms
            </Button>

            {isAuthenticated ? (
              <>
                {user?.role === "customer" && (
                  <Button variant="ghost" onClick={() => router.push("/bookings")}>
                    My Bookings
                  </Button>
                )}

                {(user?.role === "admin" || user?.role === "staff") && (
                  <>
                    <Button variant="ghost" onClick={() => router.push("/admin")}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" onClick={() => router.push("/admin/bookings")}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Bookings
                    </Button>
                    <Button variant="ghost" onClick={() => router.push("/admin/rooms")}>
                      <Hotel className="h-4 w-4 mr-2" />
                      Rooms
                    </Button>
                    {user?.role === "admin" && (
                      <Button variant="ghost" onClick={() => router.push("/admin/emails")}>
                        <Mail className="h-4 w-4 mr-2" />
                        Emails
                      </Button>
                    )}
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">Role: {user?.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {user?.role === "customer" && (
                      <>
                        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/bookings")}>
                          <Calendar className="mr-2 h-4 w-4" />
                          My Bookings
                        </DropdownMenuItem>
                      </>
                    )}

                    {(user?.role === "admin" || user?.role === "staff") && (
                      <>
                        <DropdownMenuItem onClick={() => router.push("/admin")}>
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/admin/rooms")}>
                          <Hotel className="mr-2 h-4 w-4" />
                          Manage Rooms
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/admin/bookings")}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Manage Bookings
                        </DropdownMenuItem>
                        {user?.role === "admin" && (
                          <>
                            <DropdownMenuItem onClick={() => router.push("/admin/emails")}>
                              <Mail className="mr-2 h-4 w-4" />
                              Email Management
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/admin/users")}>
                              <Users className="mr-2 h-4 w-4" />
                              Manage Users
                            </DropdownMenuItem>
                          </>
                        )}
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => router.push("/register")}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
