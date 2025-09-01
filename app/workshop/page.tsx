"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Send, Clock, Weight } from "lucide-react"

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

export default function WorkshopHome() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [workshopName, setWorkshopName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const name = localStorage.getItem("workshopName") || "Atolye"
    setWorkshopName(name)

    // Demo data - in real app this would come from API
    /*
    fetch('/api/workshop/materials', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
    })
    .then(res => res.json())
    .then(data => setMaterials(data.materials))
    */

    // Demo materials
    setMaterials([
      {
        id: "1",
        type: "oltin",
        weight: 150.5,
        purity: "22K",
        receivedFrom: "Bank Safe",
        receivedAt: "2024-01-15T10:30:00Z",
        description: "Tozalash uchun oltin",
        status: "processing",
      },
      {
        id: "2",
        type: "kumush",
        weight: 200.0,
        purity: "925",
        receivedFrom: "Atolye A",
        receivedAt: "2024-01-14T14:20:00Z",
        description: "Qayta ishlash uchun kumush",
        status: "ready",
      },
      {
        id: "3",
        type: "oltin",
        weight: 75.2,
        purity: "18K",
        receivedFrom: "Bank Safe",
        receivedAt: "2024-01-13T09:15:00Z",
        description: "Buyum yaratish uchun",
        status: "processing",
      },
    ])
  }, [])

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
      case "processing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const totalWeight = materials.reduce((sum, material) => sum + material.weight, 0)
  const processingCount = materials.filter((m) => m.status === "processing").length
  const readyCount = materials.filter((m) => m.status === "ready").length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Jami</p>
              <p className="text-lg font-bold">{materials.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Weight className="h-6 w-6 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Og'irlik</p>
              <p className="text-lg font-bold">{totalWeight.toFixed(1)}g</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Ishlanmoqda</p>
              <p className="text-lg font-bold">{processingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Send className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Tayyor</p>
              <p className="text-lg font-bold">{readyCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Materiallar</CardTitle>
              <CardDescription className="text-sm">Qabul qilingan materiallar</CardDescription>
            </div>
            <Button size="sm" onClick={() => router.push("/workshop/send")}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {materials.map((material) => (
            <div key={material.id} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(material.type)} variant="outline">
                    {material.type.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{material.purity}</Badge>
                </div>
                <Badge className={getStatusColor(material.status)} variant="outline">
                  {material.status === "processing" ? "Ishlanmoqda" : "Tayyor"}
                </Badge>
              </div>
              <div>
                <p className="font-medium text-sm">{material.description}</p>
                <p className="text-xs text-muted-foreground">
                  {material.receivedFrom} • {material.weight}g
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Batafsil
                </Button>
                {material.status === "ready" && (
                  <Button size="sm" onClick={() => router.push(`/workshop/send?material=${material.id}`)}>
                    <Send className="h-4 w-4 mr-1" />
                    Yuborish
                  </Button>
                )}
              </div>
            </div>
          ))}

          {materials.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Hozircha materiallar yo'q</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
