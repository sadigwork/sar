"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, CreditCard, Calendar, Eye } from "lucide-react"

export default function RegistrantBillingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock invoices data
  const invoices = [
    {
      id: "1",
      number: "INV-2024-001",
      description: "رسوم التسجيل الأولي",
      amount: 500,
      status: "paid",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      paidDate: "2024-01-20",
    },
    {
      id: "2",
      number: "INV-2024-002",
      description: "رسوم تجديد الترخيص",
      amount: 300,
      status: "pending",
      issueDate: "2024-01-25",
      dueDate: "2024-02-25",
      paidDate: null,
    },
    {
      id: "3",
      number: "INV-2024-003",
      description: "رسوم ترقية التصنيف",
      amount: 800,
      status: "overdue",
      issueDate: "2024-01-10",
      dueDate: "2024-01-25",
      paidDate: null,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع"
      case "pending":
        return "في انتظار الدفع"
      case "overdue":
        return "متأخر"
      default:
        return "غير محدد"
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidAmount = invoices.filter((inv) => inv.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingAmount = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">الفواتير والمدفوعات</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CreditCard className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalAmount} ريال</p>
                <p className="text-sm text-gray-600">إجمالي الفواتير</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CreditCard className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{paidAmount} ريال</p>
                <p className="text-sm text-gray-600">المبلغ المدفوع</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CreditCard className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{pendingAmount} ريال</p>
                <p className="text-sm text-gray-600">المبلغ المستحق</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الفواتير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="pending">في انتظار الدفع</SelectItem>
                <SelectItem value="overdue">متأخر</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فواتير</h3>
                <p className="text-gray-500">لم يتم العثور على فواتير تطابق معايير البحث</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <h3 className="text-lg font-medium">{invoice.number}</h3>
                      <Badge variant={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
                    </div>

                    <p className="text-gray-600 mb-2">{invoice.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="h-4 w-4" />
                        <span>تاريخ الإصدار: {invoice.issueDate}</span>
                      </div>
                      <div>
                        <span>تاريخ الاستحقاق: {invoice.dueDate}</span>
                      </div>
                      {invoice.paidDate && (
                        <div>
                          <span>تاريخ الدفع: {invoice.paidDate}</span>
                        </div>
                      )}
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">{invoice.amount} ريال</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 ml-2" />
                      عرض
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 ml-2" />
                      تحميل
                    </Button>
                    {invoice.status !== "paid" && <Button size="sm">دفع الآن</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
