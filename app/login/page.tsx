import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hotel-cream to-secondary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-hotel-gold mb-2">Grand Hotel</h1>
          <p className="text-muted-foreground">Luxury Hospitality Management</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
