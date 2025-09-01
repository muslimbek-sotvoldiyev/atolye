"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Home, History, User, LogOut, Send } from "lucide-react"
import Link from "next/link"

interface WorkshopLayoutClientProps {
  children: React.ReactNode
}

export default function WorkshopLayoutClient({ children }: WorkshopLayoutClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [workshopName, setWorkshopName] = useState("")
  const [notificationCount, setNotificationCount] = useState(3) // Demo count
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Workshop authentication logic
  useEffect(() => {
    console.log("Workshop auth check - pathname:", pathname)
    
    // Login sahifasida auth tekshirmaslik
    if (pathname === "/login") {
      console.log("On workshop login page")
      setIsLoading(false)
      setIsAuthenticated(false)
      return
    }

    // Admin tokenlarni tekshirish (workshop uchun)
    const accessToken = localStorage.getItem("access")
    const user = localStorage.getItem("user")
    
    console.log("Access token:", accessToken ? "exists" : "not found")
    console.log("User:", user ? "exists" : "not found")

    if (accessToken && user) {
      try {
        const userData = JSON.parse(user)
        console.log("User data:", userData)
        
        setIsAuthenticated(true)
        setWorkshopName(userData.username || userData.name || "Workshop")
        setIsLoading(false)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setIsLoading(false)
        router.push("/login")
      }
    } else {
      console.log("No tokens found, redirecting to login")
      setIsLoading(false)
      router.push("/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Login sahifasi uchun
  if (pathname === "/login") {
    return <>{children}</>
  }

  // Loading holati
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { 
      href: "/workshop", 
      icon: Home, 
      label: "Bosh sahifa", 
      active: pathname === "/workshop" 
    },
    {
      href: "/workshop/notifications",
      icon: Bell,
      label: "Bildirishnomalar",
      active: pathname.startsWith("/workshop/notifications"),
      badge: notificationCount,
    },
    { 
      href: "/workshop/send", 
      icon: Send, 
      label: "Yuborish", 
      active: pathname === "/workshop/send" 
    },
    { 
      href: "/workshop/history", 
      icon: History, 
      label: "Tarix", 
      active: pathname === "/workshop/history" 
    },
    { 
      href: "/workshop/account", 
      icon: User, 
      label: "Akkaunt", 
      active: pathname === "/workshop/account" 
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg text-foreground">{workshopName}</h1>
          <p className="text-xs text-muted-foreground">Zargarlik Atolyesi</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">{children}</main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2">
        <nav className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button
                variant={item.active ? "default" : "ghost"}
                size="sm"
                className="w-full flex flex-col gap-1 h-auto py-2 px-2"
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}