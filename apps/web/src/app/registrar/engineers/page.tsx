"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  FileText,
  MoreHorizontal,
  AlertTriangle,
  Eye,
  RefreshCw,
  Ban,
  Printer,
} from "lucide-react"

export default function EngineersPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [engineers, setEngineers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Sample data
  const sampleEngineers = [
    {
      id: "eng1",
      name: language === "en" ? "Ahmed Mohamed" : "أحمد محمد",
      email: "ahmed@example.com",
      specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
      level: language === "en" ? "Expert" : "خبير",
      status: "active",
      registrationNumber: "AE-2023-1234",
      registrationDate: "2023-01-15",
      expiryDate: "2026-01-14",
    },
    {
      id: "eng2",
      name: language === "en" ? "Sara Ali" : "سارة علي",
      email: "sara@example.com",
      specialization: language === "en" ? "Irrigation Systems" : "أنظمة الري",
      level: language === "en" ? "Professional" : "محترف",
      status: "active",
      registrationNumber: "AE-2023-1235",
      registrationDate: "2023-02-20",
      expiryDate: "2026-02-19",
    },
    {
      id: "eng3",
      name: language === "en" ? "Khalid Rahman" : "خالد رحمن",
      email: "khalid@example.com",
      specialization: language === "en" ? "Soil Science" : "علوم التربة",
      level: language === "en" ? "Associate" : "مشارك",
      status: "expired",
      registrationNumber: "AE-2020-0987",
      registrationDate: "2020-05-10",
      expiryDate: "2023-05-09",
    },
    {
      id: "eng4",
      name: language === "en" ? "Fatima Hussein" : "فاطمة حسين",
      email: "fatima@example.com",
      specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
      level: language === "en" ? "Expert" : "خبير",
      status: "suspended",
      registrationNumber: "AE-2022-0456",
      registrationDate: "2022-11-05",
      expiryDate: "2025-11-04",
    },
    {
      id: "eng5",
      name: language === "en" ? "Omar Nasser" : "عمر ناصر",
      email: "omar@example.com",
      specialization: language === "en" ? "Crop Science" : "علوم المحاصيل",
      level: language === "en" ? "Professional" : "محترف",
      status: "revoked",
      registrationNumber: "AE-2021-0789",
      registrationDate: "2021-07-15",
      expiryDate: "2024-07-14",
    },
    {
      id: "eng6",
      name: language === "en" ? "Layla Mahmoud" : "ليلى محمود",
      email: "layla@example.com",
      specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
      level: language === "en" ? "Associate" : "مشارك",
      status: "active",
      registrationNumber: "AE-2023-2345",
      registrationDate: "2023-03-25",
      expiryDate: "2026-03-24",
    },
    {
      id: "eng7",
      name: language === "en" ? "Hassan Ali" : "حسن علي",
      email: "hassan@example.com",
      specialization: language === "en" ? "Irrigation Systems" : "أنظمة الري",
      level: language === "en" ? "Expert" : "خبير",
      status: "active",
      registrationNumber: "AE-2022-3456",
      registrationDate: "2022-09-10",
      expiryDate: "2025-09-09",
    },
    {
      id: "eng8",
      name: language === "en" ? "Nora Salem" : "نورا سالم",
      email: "nora@example.com",
      specialization: language === "en" ? "Soil Science" : "علوم التربة",
      level: language === "en" ? "Professional" : "محترف",
      status: "active",
      registrationNumber: "AE-2023-4567",
      registrationDate: "2023-04-05",
      expiryDate: "2026-04-04",
    },
    {
      id: "eng9",
      name: language === "en" ? "Saad Al-Harbi" : "سعد الحربي",
      email: "saad@example.com",
      specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
      level: language === "en" ? "Expert" : "خبير",
      status: "active",
      registrationNumber: "AE-2022-5678",
      registrationDate: "2022-12-15",
      expiryDate: "2025-12-14",
    },
    {
      id: "eng10",
      name: language === "en" ? "Amal Zayed" : "أمل زايد",
      email: "amal@example.com",
      specialization: language === "en" ? "Crop Science" : "علوم المحاصيل",
      level: language === "en" ? "Associate" : "مشارك",
      status: "active",
      registrationNumber: "AE-2023-6789",
      registrationDate: "2023-05-20",
      expiryDate: "2026-05-19",
    },
    {
      id: "eng11",
      name: language === "en" ? "Tariq Mansour" : "طارق منصور",
      email: "tariq@example.com",
      specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
      level: language === "en" ? "Professional" : "محترف",
      status: "active",
      registrationNumber: "AE-2023-7890",
      registrationDate: "2023-06-10",
      expiryDate: "2026-06-09",
    },
    {
      id: "eng12",
      name: language === "en" ? "Huda Kamal" : "هدى كمال",
      email: "huda@example.com",
      specialization: language === "en" ? "Irrigation Systems" : "أنظمة الري",
      level: language === "en" ? "Expert" : "خبير",
      status: "active",
      registrationNumber: "AE-2022-8901",
      registrationDate: "2022-08-05",
      expiryDate: "2025-08-04",
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
        setEngineers(sampleEngineers)
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            {language === "en" ? "Active" : "نشط"}
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {language === "en" ? "Suspended" : "معلق"}
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <Clock className="mr-1 h-3 w-3" />
            {language === "en" ? "Expired" : "منتهي"}
          </Badge>
        )
      case "revoked":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            {language === "en" ? "Revoked" : "ملغي"}
          </Badge>
        )
      default:
        return <Badge variant="outline">{language === "en" ? "Unknown" : "غير معروف"}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "en" ? "en-US" : "ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredEngineers = engineers.filter((engineer) => {
    const matchesSearch =
      engineer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engineer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engineer.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || engineer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEngineers = filteredEngineers.slice(startIndex, startIndex + itemsPerPage)

  const handleExportData = () => {
    // In a real application, this would generate and download a CSV/Excel file
    alert(language === "en" ? "Exporting data..." : "جاري تصدير البيانات...")
  }

  const handleGenerateReport = () => {
    // In a real application, this would generate a report
    alert(language === "en" ? "Generating report..." : "جاري إنشاء التقرير...")
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "en" ? "Registered Engineers" : "المهندسون المسجلون"}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Manage and view all registered agricultural engineers"
              : "إدارة وعرض جميع المهندسين الزراعيين المسجلين"}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            {language === "en" ? "Export" : "تصدير"}
          </Button>
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            {language === "en" ? "Report" : "تقرير"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{language === "en" ? "Filter Engineers" : "تصفية المهندسين"}</CardTitle>
          <CardDescription>
            {language === "en"
              ? "Use the filters below to find specific engineers"
              : "استخدم المرشحات أدناه للعثور على مهندسين محددين"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === "en" ? "Filter by status" : "تصفية حسب الحالة"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All Statuses" : "جميع الحالات"}</SelectItem>
                <SelectItem value="active">{language === "en" ? "Active" : "نشط"}</SelectItem>
                <SelectItem value="expired">{language === "en" ? "Expired" : "منتهي"}</SelectItem>
                <SelectItem value="suspended">{language === "en" ? "Suspended" : "معلق"}</SelectItem>
                <SelectItem value="revoked">{language === "en" ? "Revoked" : "ملغي"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Engineers" : "المهندسون"} ({filteredEngineers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEngineers.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "en" ? "Name" : "الاسم"}</TableHead>
                      <TableHead>{language === "en" ? "Registration #" : "رقم التسجيل"}</TableHead>
                      <TableHead>{language === "en" ? "Specialization" : "التخصص"}</TableHead>
                      <TableHead>{language === "en" ? "Level" : "المستوى"}</TableHead>
                      <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                      <TableHead>{language === "en" ? "Expiry Date" : "تاريخ الانتهاء"}</TableHead>
                      <TableHead className="text-right">{language === "en" ? "Actions" : "الإجراءات"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEngineers.map((engineer) => (
                      <TableRow key={engineer.id}>
                        <TableCell className="font-medium">{engineer.name}</TableCell>
                        <TableCell>{engineer.registrationNumber}</TableCell>
                        <TableCell>{engineer.specialization}</TableCell>
                        <TableCell>{engineer.level}</TableCell>
                        <TableCell>{getStatusBadge(engineer.status)}</TableCell>
                        <TableCell>{formatDate(engineer.expiryDate)}</TableCell>
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
                              <DropdownMenuItem onClick={() => router.push(`/registrar/engineers/${engineer.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {language === "en" ? "View Details" : "عرض التفاصيل"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" />
                                {language === "en" ? "Print Certificate" : "طباعة الشهادة"}
                              </DropdownMenuItem>
                              {(engineer.status === "active" || engineer.status === "expired") && (
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  {language === "en" ? "Renew Registration" : "تجديد التسجيل"}
                                </DropdownMenuItem>
                              )}
                              {engineer.status !== "revoked" && (
                                <DropdownMenuItem className="text-destructive">
                                  <Ban className="mr-2 h-4 w-4" />
                                  {language === "en" ? "Revoke Registration" : "إلغاء التسجيل"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1
                      // Show first page, last page, and pages around current page
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(page)
                              }}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }
                      // Show ellipsis if there's a gap
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }
                      return null
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Search className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                {language === "en" ? "No engineers found" : "لم يتم العثور على مهندسين"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "en"
                  ? "Try adjusting your search or filter criteria"
                  : "حاول تعديل معايير البحث أو التصفية"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}
              >
                {language === "en" ? "Clear Filters" : "مسح المرشحات"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
