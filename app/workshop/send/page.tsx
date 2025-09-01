"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, Package, AlertTriangle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Material {
  id: string
  type: "oltin" | "kumush" | "platina"
  weight: number
  purity: string
  receivedFrom: string
  receivedAt: string
  description: string
  status: "processing" | "ready"
}

interface SendForm {
  materialId: string
  recipient: string
  sendWeight: number
  description: string
  estimatedDelivery: string
}

export default function SendMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [form, setForm] = useState<SendForm>({
    materialId: "",
    recipient: "",
    sendWeight: 0,
    description: "",
    estimatedDelivery: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Demo data - in real app this would come from API
    /*
    fetch('/api/workshop/materials', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
    })
    .then(res => res.json())
    .then(data => setMaterials(data.materials.filter(m => m.status === 'ready')))
    */

    // Demo materials (only ready ones)
    setMaterials([
      {
        id: "2",
        type: "kumush",
        weight: 200.0,
        purity: "925",
        receivedFrom: "Atolye A",
        receivedAt: "2024-01-14T14:20:00Z",
        description: "Qayta ishlangan kumush",
        status: "ready",
      },
      {
        id: "4",
        type: "oltin",
        weight: 120.5,
        purity: "22K",
        receivedFrom: "Bank Safe",
        receivedAt: "2024-01-12T11:30:00Z",
        description: "Tozalangan oltin",
        status: "ready",
      },
    ])
  }, [])

  const handleMaterialSelect = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId)
    if (material) {
      setSelectedMaterial(material)
      setForm((prev) => ({
        ...prev,
        materialId,
        sendWeight: material.weight, // Default to full weight
      }))
    }
  }

  const handleWeightChange = (value: string) => {
    const weight = Number.parseFloat(value) || 0
    setForm((prev) => ({ ...prev, sendWeight: weight }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMaterial || form.sendWeight <= 0 || form.sendWeight > selectedMaterial.weight) {
      return
    }

    setIsSubmitting(true)

    // API call would go here
    /*
    try {
      await fetch('/api/workshop/send-material', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` 
        },
        body: JSON.stringify(form)
      })
    } catch (error) {
      console.error('Failed to send material:', error)
    }
    */

    // Demo delay
    setTimeout(() => {
      setSuccess(true)
      setIsSubmitting(false)

      // Reset form after success
      setTimeout(() => {
        router.push("/workshop")
      }, 2000)
    }, 1500)
  }

  const goBack = () => {
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

  const recipients = ["Bank Safe", "Atolye A", "Atolye B", "Atolye C", "Admin"]

  const isFormValid =
    selectedMaterial &&
    form.recipient &&
    form.sendWeight > 0 &&
    form.sendWeight <= selectedMaterial.weight &&
    form.description.trim()

  if (success) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Muvaffaqiyatli yuborildi!</h3>
            <p className="text-muted-foreground mb-4">
              Material {form.recipient}ga yuborildi. Bosh sahifaga qaytilmoqda...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Orqaga
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Material yuborish</h1>
          <p className="text-muted-foreground">Tayyor materiallarni boshqa atolye yoki bankga yuboring</p>
        </div>
      </div>

      {materials.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Hozirda yuborish uchun tayyor materiallar yo'q. Avval materiallarni qayta ishlab tayyor holatga keltiring.
          </AlertDescription>
        </Alert>
      )}

      {materials.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Material Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Material tanlash
              </CardTitle>
              <CardDescription>Yubormoqchi bo'lgan materialni tanlang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedMaterial?.id === material.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => handleMaterialSelect(material.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getTypeColor(material.type)}>{material.type.toUpperCase()}</Badge>
                      <Badge variant="outline">{material.purity}</Badge>
                      <Badge variant="secondary">{material.weight}g</Badge>
                    </div>
                    <div>
                      <p className="font-medium">{material.description}</p>
                      <p className="text-sm text-muted-foreground">{material.receivedFrom}dan qabul qilindi</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Send Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Yuborish ma'lumotlari
              </CardTitle>
              <CardDescription>Material yuborish uchun ma'lumotlarni kiriting</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Qabul qiluvchi</Label>
                  <Select
                    value={form.recipient}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, recipient: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Qabul qiluvchini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipients.map((recipient) => (
                        <SelectItem key={recipient} value={recipient}>
                          {recipient}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Yuborish miqdori (gramm)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={selectedMaterial?.weight || 0}
                    value={form.sendWeight || ""}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    placeholder="Miqdorni kiriting"
                    disabled={!selectedMaterial}
                  />
                  {selectedMaterial && (
                    <p className="text-xs text-muted-foreground">
                      Maksimal: {selectedMaterial.weight}g
                      {form.sendWeight > 0 && form.sendWeight < selectedMaterial.weight && (
                        <span className="ml-2 text-orange-600">
                          Qoladi: {(selectedMaterial.weight - form.sendWeight).toFixed(1)}g
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tavsif</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Material haqida qo'shimcha ma'lumot..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery">Taxminiy yetkazib berish vaqti</Label>
                  <Select
                    value={form.estimatedDelivery}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, estimatedDelivery: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vaqtni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 soat">1-2 soat</SelectItem>
                      <SelectItem value="3-6 soat">3-6 soat</SelectItem>
                      <SelectItem value="1 kun">1 kun</SelectItem>
                      <SelectItem value="2-3 kun">2-3 kun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.sendWeight > 0 && selectedMaterial && form.sendWeight > selectedMaterial.weight && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Yuborish miqdori mavjud materialdan ko'p bo'lishi mumkin emas.</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Yuborilmoqda..." : "Material yuborish"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
