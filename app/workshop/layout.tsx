"use client"

import type React from "react"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Home, History, User, LogOut, Send } from "lucide-react"
import Link from "next/link"

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [workshopName, setWorkshopName] = useState("")
  const [notificationCount, setNotificationCount] = useState(3) // Demo count
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("workshopToken")
    const name = localStorage.getItem("workshopName")
    if (token && name) {
      setIsAuthenticated(true)
      setWorkshopName(name)
    } else if (pathname !== "/workshop/login") {
      router.push("/workshop/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("workshopToken")
    localStorage.removeItem("workshopName")
    router.push("/workshop/login")
  }

  if (pathname === "/workshop/login") {
    return <ReduxProvider>{children}</ReduxProvider>
  }

  if (!isAuthenticated) {
    return (
      <ReduxProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        </div>
      </ReduxProvider>
    )
  }

  const navItems = [
    { href: "/workshop", icon: Home, label: "Bosh sahifa", active: pathname === "/workshop" },
    {
      href: "/workshop/notifications",
      icon: Bell,
      label: "Bildirishnomalar",
      active: pathname.startsWith("/workshop/notifications"),
      badge: notificationCount,
    },
    { href: "/workshop/send", icon: Send, label: "Yuborish", active: pathname === "/workshop/send" },
    { href: "/workshop/history", icon: History, label: "Tarix", active: pathname === "/workshop/history" },
    { href: "/workshop/account", icon: User, label: "Akkaunt", active: pathname === "/workshop/account" },
  ]

  return (
    <ReduxProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg text-foreground">{workshopName}</h1>
            <p className="text-xs text-muted-foreground">Zargarlik Atolyesi</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <main className="flex-1 p-4 pb-20">{children}</main>

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
    </ReduxProvider>
  )
}
