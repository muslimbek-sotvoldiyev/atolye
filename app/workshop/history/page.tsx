"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Filter, Download, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { format } from "date-fns"
import { uz } from "date-fns/locale"

interface HistoryTransaction {
  id: string
  type: "incoming" | "outgoing"
  materialType: "oltin" | "kumush" | "platina"
  weight: number
  purity: string
  from: string
  to: string
  description: string
  createdAt: string
  status: "completed" | "pending" | "rejected"
  trackingNumber: string
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<HistoryTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<HistoryTransaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [materialFilter, setMaterialFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [sortBy, setSortBy] = useState<"date" | "weight">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // Demo data - in real app this would come from API
    /*
    fetch('/api/workshop/history', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('workshopToken')}` }
    })
    .then(res => res.json())
    .then(data => setTransactions(data.transactions))
    */

    // Demo history data
    const demoTransactions: HistoryTransaction[] = [
      {
        id: "1",
        type: "incoming",
        materialType: "oltin",
        weight: 250.5,
        purity: "22K",
        from: "Bank Safe",
        to: "Sizning atolyengiz",
        description: "Tozalash uchun oltin",
        createdAt: "2024-01-15T10:30:00Z",
        status: "completed",
        trackingNumber: "TRK-2024-001",
      },
      {
        id: "2",
        type: "outgoing",
        materialType: "kumush",
        weight: 180.0,
        purity: "925",
        from: "Sizning atolyengiz",
        to: "Atolye B",
        description: "Qayta ishlangan kumush",
        createdAt: "2024-01-14T14:20:00Z",
        status: "completed",
        trackingNumber: "TRK-2024-002",
      },
      {
        id: "3",
        type: "incoming",
        materialType: "oltin",
        weight: 95.2,
        purity: "18K",
        from: "Bank Safe",
        to: "Sizning atolyengiz",
        description: "Buyum yaratish uchun",
        createdAt: "2024-01-13T16:45:00Z",
        status: "completed",
        trackingNumber: "TRK-2024-003",
      },
      {
        id: "4",
        type: "outgoing",
        materialType: "oltin",
        weight: 120.0,
        purity: "22K",
        from: "Sizning atolyengiz",
        to: "Admin",
        description: "Tozalangan oltin",
        createdAt: "2024-01-12T11:15:00Z",
        status: "completed",
        trackingNumber: "TRK-2024-004",
      },
      {
        id: "5",
        type: "incoming",
        materialType: "platina",
        weight: 50.0,
        purity: "950",
        from: "Atolye A",
        to: "Sizning atolyengiz",
        description: "Maxsus buyum uchun platina",
        createdAt: "2024-01-11T09:30:00Z",
        status: "pending",
        trackingNumber: "TRK-2024-005",
      },
    ]

    setTransactions(demoTransactions)
    setFilteredTransactions(demoTransactions)
  }, [])

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearch =
        searchTerm === "" ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.to.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || transaction.type === typeFilter
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
      const matchesMaterial = materialFilter === "all" || transaction.materialType === materialFilter

      const transactionDate = new Date(transaction.createdAt)
      const matchesDateFrom = !dateFrom || transactionDate >= dateFrom
      const matchesDateTo = !dateTo || transactionDate <= dateTo

      return matchesSearch && matchesType && matchesStatus && matchesMaterial && matchesDateFrom && matchesDateTo
    })

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "date") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "weight") {
        comparison = a.weight - b.weight
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, typeFilter, statusFilter, materialFilter, dateFrom, dateTo, sortBy, sortOrder])

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
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDirectionColor = (type: string) => {
    return type === "incoming"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200"
  }

  const exportData = () => {
    // In real app, this would generate and download CSV/Excel file
    const csvContent = [
      ["Tracking", "Turi", "Material", "Og'irlik", "Proba", "Dan", "Ga", "Tavsif", "Sana", "Holat"].join(","),
      ...filteredTransactions.map((t) =>
        [
          t.trackingNumber,
          t.type === "incoming" ? "Kiruvchi" : "Chiquvchi",
          t.materialType,
          t.weight,
          t.purity,
          t.from,
          t.to,
          `"${t.description}"`,
          new Date(t.createdAt).toLocaleDateString("uz-UZ"),
          t.status === "completed" ? "Bajarildi" : t.status === "pending" ? "Kutilmoqda" : "Rad etildi",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `atolye-tarix-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const toggleSort = (field: "date" | "weight") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field: "date" | "weight") => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaksiyalar tarixi</h1>
          <p className="text-muted-foreground">Barcha kiruvchi va chiquvchi materiallar tarixi</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Eksport
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Qidiruv</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tracking, tavsif, joy..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Turi</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="incoming">Kiruvchi</SelectItem>
                  <SelectItem value="outgoing">Chiquvchi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Material</label>
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="oltin">Oltin</SelectItem>
                  <SelectItem value="kumush">Kumush</SelectItem>
                  <SelectItem value="platina">Platina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Holat</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="completed">Bajarildi</SelectItem>
                  <SelectItem value="pending">Kutilmoqda</SelectItem>
                  <SelectItem value="rejected">Rad etildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dan</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: uz }) : "Sana tanlang"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gacha</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: uz }) : "Sana tanlang"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Natijalar ({filteredTransactions.length})</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleSort("date")}>
                Sana {getSortIcon("date")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleSort("weight")}>
                Og'irlik {getSortIcon("weight")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getDirectionColor(transaction.type)}>
                        {transaction.type === "incoming" ? "KIRUVCHI" : "CHIQUVCHI"}
                      </Badge>
                      <Badge className={getTypeColor(transaction.materialType)}>
                        {transaction.materialType.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{transaction.purity}</Badge>
                      <Badge variant="secondary">{transaction.weight}g</Badge>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status === "completed"
                          ? "Bajarildi"
                          : transaction.status === "pending"
                            ? "Kutilmoqda"
                            : "Rad etildi"}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.from} → {transaction.to}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{transaction.trackingNumber} •{" "}
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
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Natija topilmadi</h3>
                <p className="text-muted-foreground">Filtrlarni o'zgartirib qayta urinib ko'ring</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
