"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gem, Lock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/lib/service/authApi"
import { useDispatch } from "react-redux"
// import { ReduxProvider } from "@/components/providers/redux-provider"
import api from "@/lib/service/api"
import StoreProvider from "@/lib/providers"

function WorkshopLoginForm() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const saveToLocalStorage = (data: {
    access: string
    refresh: string
    user: any
  }) => {
    // Workshop specific token storage
    localStorage.setItem("access", data.access)
    localStorage.setItem("refresh", data.refresh)
    localStorage.setItem("user", JSON.stringify(data.user))
    // Atolye nomini saqlash
    localStorage.setItem("username", data.user.workshop_name || formData.username)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const result = await login(formData).unwrap()

      if (result && result.access) {
        saveToLocalStorage(result)
        dispatch(api.util.resetApiState())
        router.push("/workshop")
      } else {
        setError("Tizimga kirishda xatolik. Qaytadan urinib ko'ring.")
      }
    } catch (err) {
      if (typeof err === "object" && err !== null && "data" in err) {
        setError((err.data as any).message || "Noto'g'ri atolye nomi yoki parol")
      } else {
        setError("Tizimga kirishda xatolik yuz berdi")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Gem className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Atolye Kirish</CardTitle>
            <CardDescription className="text-sm">Zargarlik materiallarini boshqarish</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Atolye nomi</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Atolye nomini kiriting"
                  className="pl-10"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Parolni kiriting"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Kirilmoqda..." : "Kirish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function WorkshopLogin() {
  return (
    <StoreProvider>
      <WorkshopLoginForm />
    </StoreProvider>
  )
}