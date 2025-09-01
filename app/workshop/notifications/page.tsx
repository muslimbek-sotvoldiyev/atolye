"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Package, Clock, CheckCircle, XCircle, Eye, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface Transaction {
  id: string
  type: "incoming" | "outgoing"
  materialType: "oltin" | "kumush" | "platina"
  weight: number
  purity: string
  from: string
  to: string
  description: string
  createdAt: string
  status: "pending" | "accepted" | "rejected"
  estimatedProcessingTime?: string
}

export default function NotificationsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Demo data - in real app this would come from API
    /*
    fetch('/api/workshop/notifications', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
    })
    .then(res => res.json())
    .then(data => setTransactions(data.transactions))
    */

    // Demo notifications
    setTransactions([
      {
        id: "1",
        type: "incoming",
        materialType: "oltin",
        weight: 250.5,
        purity: "22K",
        from: "Bank Safe",
        to: "Sizning atolyengiz",
        description: "Tozalash va probani o'zgartirish uchun oltin",
        createdAt: "2024-01-15T10:30:00Z",
        status: "pending",
        estimatedProcessingTime: "3-5 kun",
      },
      {
        id: "2",
        type: "incoming",
        materialType: "kumush",
        weight: 180.0,
        purity: "925",
        from: "Atolye B",
        to: "Sizning atolyengiz",
        description: "Qayta ishlangan kumush, keyingi bosqich uchun",
        createdAt: "2024-01-15T09:15:00Z",
        status: "pending",
        estimatedProcessingTime: "2-3 kun",
      },
      {
        id: "3",
        type: "incoming",
        materialType: "oltin",
        weight: 95.2,
        purity: "18K",
        from: "Bank Safe",
        to: "Sizning atolyengiz",
        description: "Maxsus buyum yaratish uchun oltin",
        createdAt: "2024-01-14T16:45:00Z",
        status: "accepted",
      },
    ])
  }, [])

  const handleAccept = async (transactionId: string) => {
    setLoading(transactionId)

    // API call would go here
    /*
    try {
      await fetch(`/api/workshop/transactions/${transactionId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
      })
    } catch (error) {
      console.error('Failed to accept transaction:', error)
    }
    */

    // Demo delay
    setTimeout(() => {
      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? { ...t, status: "accepted" as const } : t)))
      setLoading(null)
    }, 1000)
  }

  const handleReject = async (transactionId: string) => {
    setLoading(transactionId)

    // API call would go here
    /*
    try {
      await fetch(`/api/workshop/transactions/${transactionId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
      })
    } catch (error) {
      console.error('Failed to reject transaction:', error)
    }
    */

    // Demo delay
    setTimeout(() => {
      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? { ...t, status: "rejected" as const } : t)))
      setLoading(null)
    }, 1000)
  }

  const viewDetails = (transactionId: string) => {
    router.push(`/workshop/notifications/${transactionId}`)
  }

  const goToHome = () => {
    router.push("/workshop")
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "oltin":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "kumush":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "platina":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const pendingTransactions = transactions.filter((t) => t.status === "pending")
  const processedTransactions = transactions.filter((t) => t.status !== "pending")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bildirishnomalar</h1>
          <p className="text-muted-foreground">Kiruvchi va chiquvchi transaksiyalar</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Bell className="h-4 w-4 mr-1" />
          {pendingTransactions.length} yangi
        </Badge>
      </div>

      {pendingTransactions.length > 0 && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            Sizda {pendingTransactions.length} ta yangi transaksiya kutilmoqda. Ularni ko'rib chiqing va javob bering.
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Transactions */}
      {pendingTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Kutilayotgan transaksiyalar
            </CardTitle>
            <CardDescription>Tasdiqlanishi kerak bo'lgan transaksiyalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getTypeColor(transaction.materialType)}>
                          {transaction.materialType.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{transaction.purity}</Badge>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status === "pending" ? "Kutilmoqda" : transaction.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          <Package className="h-4 w-4 inline mr-1" />
                          {transaction.from} → {transaction.to} • {transaction.weight}g
                        </p>
                        {transaction.estimatedProcessingTime && (
                          <p className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Taxminiy vaqt: {transaction.estimatedProcessingTime}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString("uz-UZ", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" onClick={() => viewDetails(transaction.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Batafsil
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(transaction.id)}
                        disabled={loading === transaction.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rad etish
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(transaction.id)}
                        disabled={loading === transaction.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {loading === transaction.id ? "Qabul qilinmoqda..." : "Qabul qilish"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processed Transactions */}
      {processedTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Qayta ishlangan transaksiyalar
            </CardTitle>
            <CardDescription>Qabul qilingan yoki rad etilgan transaksiyalar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors opacity-75"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getTypeColor(transaction.materialType)}>
                          {transaction.materialType.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{transaction.purity}</Badge>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status === "accepted" ? "Qabul qilindi" : "Rad etildi"}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.from} → {transaction.to} • {transaction.weight}g
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {transaction.status === "accepted" && (
                        <Button size="sm" onClick={goToHome}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Bosh sahifaga
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {transactions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Bildirishnomalar yo'q</h3>
            <p className="text-muted-foreground">Hozircha yangi transaksiyalar yo'q</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
