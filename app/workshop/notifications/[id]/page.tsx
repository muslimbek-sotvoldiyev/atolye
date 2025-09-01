"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Clock, User, FileText, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

interface TransactionDetail {
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
  notes?: string
  trackingNumber: string
  sender: {
    name: string
    contact: string
  }
  recipient: {
    name: string
    contact: string
  }
}

export default function TransactionDetailsPage() {
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const transactionId = params.id as string

    // Demo data - in real app this would come from API
    /*
    fetch(`/api/workshop/transactions/${transactionId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
    })
    .then(res => res.json())
    .then(data => setTransaction(data.transaction))
    */

    // Demo transaction detail
    setTransaction({
      id: transactionId,
      type: "incoming",
      materialType: "oltin",
      weight: 250.5,
      purity: "22K",
      from: "Bank Safe",
      to: "Sizning atolyengiz",
      description: "Tozalash va probani o'zgartirish uchun oltin. Mijoz maxsus buyum yaratishni so'ragan.",
      createdAt: "2024-01-15T10:30:00Z",
      status: "pending",
      estimatedProcessingTime: "3-5 kun",
      notes: "Ehtiyotkorlik bilan ishlash kerak. Materialda mayda zararlar bo'lishi mumkin.",
      trackingNumber: "TRK-2024-001",
      sender: {
        name: "Bank Safe Manager",
        contact: "+998 90 123 45 67",
      },
      recipient: {
        name: localStorage.getItem("workshopName") || "Atolye",
        contact: "+998 90 987 65 43",
      },
    })
  }, [params.id])

  const handleAccept = async () => {
    if (!transaction) return
    setLoading("accept")

    // API call would go here
    /*
    try {
      await fetch(`/api/workshop/transactions/${transaction.id}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
      })
    } catch (error) {
      console.error('Failed to accept transaction:', error)
    }
    */

    // Demo delay
    setTimeout(() => {
      setTransaction((prev) => (prev ? { ...prev, status: "accepted" } : null))
      setLoading(null)
    }, 1000)
  }

  const handleReject = async () => {
    if (!transaction) return
    setLoading("reject")

    // API call would go here
    /*
    try {
      await fetch(`/api/workshop/transactions/${transaction.id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
      })
    } catch (error) {
      console.error('Failed to reject transaction:', error)
    }
    */

    // Demo delay
    setTimeout(() => {
      setTransaction((prev) => (prev ? { ...prev, status: "rejected" } : null))
      setLoading(null)
    }, 1000)
  }

  const goToHome = () => {
    router.push("/workshop")
  }

  const goBack = () => {
    router.push("/workshop/notifications")
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    )
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Orqaga
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Transaksiya tafsilotlari</h1>
          <p className="text-muted-foreground">#{transaction.trackingNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Material ma'lumotlari
                </CardTitle>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status === "pending"
                    ? "Kutilmoqda"
                    : transaction.status === "accepted"
                      ? "Qabul qilindi"
                      : "Rad etildi"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getTypeColor(transaction.materialType)}>
                  {transaction.materialType.toUpperCase()}
                </Badge>
                <Badge variant="outline">{transaction.purity}</Badge>
                <Badge variant="secondary">{transaction.weight}g</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tavsif</h4>
                <p className="text-sm text-muted-foreground">{transaction.description}</p>
              </div>

              {transaction.notes && (
                <div>
                  <h4 className="font-medium mb-2">Qo'shimcha eslatmalar</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{transaction.notes}</p>
                </div>
              )}

              {transaction.estimatedProcessingTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Taxminiy ishlov berish vaqti: {transaction.estimatedProcessingTime}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transfer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Transfer ma'lumotlari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Yuboruvchi
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">{transaction.sender.name}</p>
                    <p>{transaction.from}</p>
                    <p>{transaction.sender.contact}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Qabul qiluvchi
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">{transaction.recipient.name}</p>
                    <p>{transaction.to}</p>
                    <p>{transaction.recipient.contact}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Yaratilgan vaqt:{" "}
                {new Date(transaction.createdAt).toLocaleDateString("uz-UZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Amallar</CardTitle>
              <CardDescription>Bu transaksiya bilan nima qilmoqchisiz?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {transaction.status === "pending" && (
                <>
                  <Button className="w-full" onClick={handleAccept} disabled={loading === "accept"}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {loading === "accept" ? "Qabul qilinmoqda..." : "Qabul qilish"}
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleReject}
                    disabled={loading === "reject"}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {loading === "reject" ? "Rad etilmoqda..." : "Rad etish"}
                  </Button>
                </>
              )}

              {transaction.status === "accepted" && (
                <Button className="w-full" onClick={goToHome}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Bosh sahifaga o'tish
                </Button>
              )}

              {transaction.status === "rejected" && (
                <div className="text-center py-4">
                  <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Bu transaksiya rad etilgan</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tracking raqami</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-sm bg-muted p-2 rounded block text-center">{transaction.trackingNumber}</code>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
