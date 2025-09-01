"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Building, Phone, Mail, MapPin, Clock, Shield, Save, CheckCircle } from "lucide-react"

interface WorkshopProfile {
  id: string
  name: string
  ownerName: string
  email: string
  phone: string
  address: string
  description: string
  specialties: string[]
  registeredAt: string
  lastActive: string
  status: "active" | "inactive"
  totalTransactions: number
  totalMaterialsProcessed: number
}

export default function AccountPage() {
  const [profile, setProfile] = useState<WorkshopProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editForm, setEditForm] = useState({
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  })

  useEffect(() => {
    // Demo data - in real app this would come from API
    /*
    fetch('/api/workshop/profile', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
    })
    .then(res => res.json())
    .then(data => setProfile(data.profile))
    */

    // Demo profile data
    const workshopName = localStorage.getItem("workshopName") || "Demo Atolye"
    const demoProfile: WorkshopProfile = {
      id: "workshop-1",
      name: workshopName,
      ownerName: "Akmal Karimov",
      email: "akmal@example.com",
      phone: "+998 90 123 45 67",
      address: "Toshkent sh., Chilonzor t., Bunyodkor ko'ch., 15-uy",
      description: "Oltin va kumush buyumlarini qayta ishlash bo'yicha ixtisoslashgan atolye. 15 yillik tajriba.",
      specialties: ["Oltin tozalash", "Kumush qayta ishlash", "Proba o'zgartirish", "Buyum yaratish"],
      registeredAt: "2020-03-15T10:00:00Z",
      lastActive: "2024-01-15T14:30:00Z",
      status: "active",
      totalTransactions: 247,
      totalMaterialsProcessed: 15420.5,
    }

    setProfile(demoProfile)
    setEditForm({
      ownerName: demoProfile.ownerName,
      email: demoProfile.email,
      phone: demoProfile.phone,
      address: demoProfile.address,
      description: demoProfile.description,
    })
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setSaved(false)
  }

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        ownerName: profile.ownerName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        description: profile.description,
      })
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // API call would go here
    /*
    try {
      await fetch('/api/workshop/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` 
        },
        body: JSON.stringify(editForm)
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
    */

    // Demo delay
    setTimeout(() => {
      if (profile) {
        setProfile({
          ...profile,
          ...editForm,
        })
      }
      setIsEditing(false)
      setIsSaving(false)
      setSaved(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Akkaunt ma'lumotlari</h1>
          <p className="text-muted-foreground">Atolye profili va sozlamalari</p>
        </div>
        <Badge variant={profile.status === "active" ? "default" : "secondary"} className="text-sm">
          <Shield className="h-4 w-4 mr-1" />
          {profile.status === "active" ? "Faol" : "Nofaol"}
        </Badge>
      </div>

      {saved && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Profil ma'lumotlari muvaffaqiyatli yangilandi!</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Asosiy ma'lumotlar
                </CardTitle>
                {!isEditing && (
                  <Button variant="outline" onClick={handleEdit}>
                    Tahrirlash
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Atolye nomi</Label>
                  <Input value={profile.name} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Egasi</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.ownerName}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, ownerName: e.target.value }))}
                    />
                  ) : (
                    <Input value={profile.ownerName} disabled />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <Input value={profile.email} disabled />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <Input value={profile.phone} disabled />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Manzil</Label>
                {isEditing ? (
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                  />
                ) : (
                  <Input value={profile.address} disabled />
                )}
              </div>

              <div className="space-y-2">
                <Label>Tavsif</Label>
                {isEditing ? (
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                ) : (
                  <Textarea value={profile.description} disabled rows={3} />
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Bekor qilish
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Ixtisosliklar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistika</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{profile.totalTransactions}</p>
                <p className="text-sm text-muted-foreground">Jami transaksiyalar</p>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{profile.totalMaterialsProcessed.toFixed(1)}g</p>
                <p className="text-sm text-muted-foreground">Qayta ishlangan materiallar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Faollik ma'lumotlari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Ro'yxatdan o'tgan</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.registeredAt).toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Oxirgi faollik</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.lastActive).toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aloqa ma'lumotlari</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{profile.address}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
