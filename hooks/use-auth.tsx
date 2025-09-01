"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User, type AuthState, authenticateUser, generateToken, verifyToken, mockUsers } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("hotel_auth_token")
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        const user = mockUsers.find((u) => u.id === decoded.userId)
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          return
        }
      }
      localStorage.removeItem("hotel_auth_token")
    }
    setAuthState((prev) => ({ ...prev, isLoading: false }))
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = authenticateUser(email, password)
    if (user) {
      const token = generateToken(user)
      localStorage.setItem("hotel_auth_token", token)
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("hotel_auth_token")
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simple registration - in real app, this would create user in database
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "customer",
      createdAt: new Date(),
    }

    mockUsers.push(newUser)
    const token = generateToken(newUser)
    localStorage.setItem("hotel_auth_token", token)
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    })
    return true
  }

  return <AuthContext.Provider value={{ ...authState, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
