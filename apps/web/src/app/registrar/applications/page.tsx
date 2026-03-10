"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock, Eye, FileText } from "lucide-react"

export default function RegistrarApplicationsPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [applications, setApplications] = useState<any[]>([])

  // Sample data
  const sampleApplications = [
    {
      id: "APP001",
      name: language === "en" ? "Ahmed Mohamed" : "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+201234567890",
      specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
      level: language === "en" ? "Expert" : "خبير",
      status: "new",
      submittedDate: "2023-11-15",
      avatar: "AM",
    },
    {
      id: "APP002",
      name: language === "en" ? "Sara Ahmed" : "سارة أحمد",
      email: "sara@example.com",
      phone: "+201234567891",
      specialization: language === "en" ? "Irrigation Systems" : "أنظمة الري",
      level: language === "en" ? "Advanced" : "متقدم",
      status: "pending",
      submittedDate: "2023-11-14",
      avatar: "SA",
    },
    {
      id: "APP003",
      name: language === "en" ? "Mohamed Ali" : "محمد علي",
      email: "mohamed@example.com",
      phone: "+201234567892",
      specialization: language === "en" ? "Soil Science" : "علوم التربة",
      level: language === "en" ? "Intermediate" : "متوسط",
      status: "approved",
      submittedDate: "2023-11-10",
      avatar: "MA",
    },
    {
      id: "APP004",
      name: language === "en" ? "Fatima Hassan" : "فاطمة حسن",
      email: "fatima@example.com",
      phone: "+201234567893",
      specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
      level: language === "en" ? "Beginner" : "مبتدئ",
      status: "rejected",
      submittedDate: "2023-11-08",
      avatar: "FH",
    },
    {
      id: "APP005",
      name: language === "en" ? "Khaled Mahmoud" : "خالد محمود",
      email: "khaled@example.com",
      phone: "+201234567894",
      specialization: language === "en" ? "Crop Science" : "علوم المحاصيل",
      level: language === "en" ? "Expert" : "خبير",
      status: "new",
      submittedDate: "2023-11-16",
      avatar: "KM",
    },
    {
      id: "APP006",
      name: language === "en" ? "Layla Ibrahim" : "ليلى إبراهيم",
      email: "layla@example.com",
      phone: "+201234567895",
      specialization: language === "en" ? "Agricultural Economics" : "الاقتصاد الزراعي",
      level: language === "en" ? "Advanced" : "متقدم",
      status: "pending",
      submittedDate: "2023-11-13",
      avatar: "LI",
    },
    {
      id: "APP007",
      name: language === "en" ? "Omar Samir" : "عمر سمير",
      email: "omar@example.com",
      phone: "+201234567896",
      specialization: language === "en" ? "Plant Pathology" : "أمراض النبات",
      level: language === "en" ? "Intermediate" : "متوسط",
      status: "approved",
      submittedDate: "2023-11-09",
      avatar: "OS",
    },
    {
      id: "APP008",
      name: language === "en" ? "Nour Adel" : "نور عادل",
      email: "nour@example.com",
      phone: "+201234567897",
      specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
      level: language === "en" ? "Beginner" : "مبتدئ",
      status: "rejected",
      submittedDate: "2023-11-07",
      avatar: "NA",
    },
  ]

  // Check if user is logged in and is a registrar
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "registrar") {
        router.push("/dashboard")
      } else {
        setApplications(sampleApplications)
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  // Filter applications based on search query and status filter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.specialization.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="mr-1 h-3 w-3" />
            {language === "en" ? "New" : "جديد"}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="mr-1 h-3 w-3" />
            {language === "en" ? "Pending" : "قيد الانتظار"}
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            {language === "en" ? "Approved" : "تمت الموافقة"}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            {language === "en" ? "Rejected" : "مرفوض"}
          </Badge>
        )
      default:
        return <Badge variant="outline">{language === "en" ? "Unknown" : "غير معروف"}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "en" ? "en-US" : "ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "en" ? "Registration Applications" : "طلبات التسجيل"}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "View and manage engineer registration applications"
              : "عرض وإدارة طلبات تسجيل المهندسين"}
          </p>
        </div>
        <Button onClick={() => router.push("/registrar/dashboard")}>
          {language === "en" ? "Back to Dashboard" : "العودة إلى لوحة التحكم"}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>{language === "en" ? "Filter Applications" : "تصفية الطلبات"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={
                  language === "en"
                    ? "Search by name, email, or ID..."
                    : "البحث بالاسم أو البريد الإلكتروني أو الرقم..."
                }
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Filter by status" : "تصفية حسب الحالة"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All Statuses" : "جميع الحالات"}</SelectItem>
                  <SelectItem value="new">{language === "en" ? "New" : "جديد"}</SelectItem>
                  <SelectItem value="pending">{language === "en" ? "Pending" : "قيد الانتظار"}</SelectItem>
                  <SelectItem value="approved">{language === "en" ? "Approved" : "تمت الموافقة"}</SelectItem>
                  <SelectItem value="rejected">{language === "en" ? "Rejected" : "مرفوض"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "en" ? "Applicant" : "مقدم الطلب"}</TableHead>
                <TableHead>{language === "en" ? "Specialization" : "التخصص"}</TableHead>
                <TableHead>{language === "en" ? "Level" : "المستوى"}</TableHead>
                <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                <TableHead>{language === "en" ? "Submitted" : "تاريخ التقديم"}</TableHead>
                <TableHead className="text-right">{language === "en" ? "Actions" : "الإجراءات"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={application.name} />
                          <AvatarFallback>{application.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-sm text-muted-foreground">{application.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{application.specialization}</TableCell>
                    <TableCell>{application.level}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>{formatDate(application.submittedDate)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{language === "en" ? "Actions" : "الإجراءات"}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{language === "en" ? "Actions" : "الإجراءات"}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/registrar/applications/${application.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {language === "en" ? "View Details" : "عرض التفاصيل"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            {language === "en" ? "View Documents" : "عرض المستندات"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {application.status !== "approved" && (
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {language === "en" ? "Approve" : "موافقة"}
                            </DropdownMenuItem>
                          )}
                          {application.status !== "rejected" && (
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              {language === "en" ? "Reject" : "رفض"}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center">
                      <Filter className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        {language === "en" ? "No applications found" : "لم يتم العثور على طلبات"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === "en"
                          ? "Try adjusting your search or filter criteria"
                          : "حاول تعديل معايير البحث أو التصفية"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
