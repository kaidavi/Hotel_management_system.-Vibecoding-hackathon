export type UserRole = "admin" | "staff" | "customer"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@hotel.com",
    name: "Hotel Admin",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "staff@hotel.com",
    name: "Front Desk Staff",
    role: "staff",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    email: "customer@example.com",
    name: "John Customer",
    role: "customer",
    createdAt: new Date("2024-02-01"),
  },
]

// Simple JWT-like token simulation
export const generateToken = (user: User): string => {
  return btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 24 * 60 * 60 * 1000 }))
}

export const verifyToken = (token: string): { userId: string; role: UserRole } | null => {
  try {
    const decoded = JSON.parse(atob(token))
    if (decoded.exp < Date.now()) return null
    return { userId: decoded.userId, role: decoded.role }
  } catch {
    return null
  }
}

export const authenticateUser = (email: string, password: string): User | null => {
  // Simple authentication - in real app, this would hash passwords
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password123") {
    return user
  }
  return null
}
