"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FileText, Calendar, Eye } from "lucide-react"
import Link from "next/link"

export default function RegistrantApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock applications data
  const applications = [
    {
      id: "1",
      type: "تسجيل أولي",
      status: "approved",
      submissionDate: "2024-01-15",
      lastUpdate: "2024-01-20",
      classification: "مهندس زراعي",
      reviewerNotes: "تم الموافقة على الطلب",
    },
    {
      id: "2",
      type: "تجديد ترخيص",
      status: "pending",
      submissionDate: "2024-01-25",
      lastUpdate: "2024-01-25",
      classification: "مهندس زراعي أول",
      reviewerNotes: "",
    },
    {
      id: "3",
      type: "ترقية تصنيف",
      status: "under_review",
      submissionDate: "2024-01-20",
      lastUpdate: "2024-01-22",
      classification: "مهندس زراعي خبير",
      reviewerNotes: "قيد المراجعة من قبل اللجنة الفنية",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "under_review":
        return "outline"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "موافق عليه"
      case "pending":
        return "في انتظار المراجعة"
      case "under_review":
        return "قيد المراجعة"
      case "rejected":
        return "مرفوض"
      default:
        return "غير محدد"
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.classification.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">طلباتي</h1>
        <Link href="/application/new">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            طلب جديد
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الطلبات..."
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
                <SelectItem value="pending">في انتظار المراجعة</SelectItem>
                <SelectItem value="under_review">قيد المراجعة</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                <p className="text-gray-500 mb-4">لم يتم العثور على طلبات تطابق معايير البحث</p>
                <Link href="/application/new">
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إنشاء طلب جديد
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <h3 className="text-lg font-medium">{application.type}</h3>
                      <Badge variant={getStatusColor(application.status)}>{getStatusText(application.status)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="h-4 w-4" />
                        <span>تاريخ التقديم: {application.submissionDate}</span>
                      </div>
                      <div>
                        <span>التصنيف المطلوب: {application.classification}</span>
                      </div>
                      <div>
                        <span>آخر تحديث: {application.lastUpdate}</span>
                      </div>
                    </div>

                    {application.reviewerNotes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">
                          <strong>ملاحظات المراجع:</strong> {application.reviewerNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 space-x-reverse">
                    <Link href={`/application/${application.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 ml-2" />
                        عرض
                      </Button>
                    </Link>
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
