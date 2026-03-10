"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Eye,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// Mock applications data
const mockApplications = [
  {
    id: "APP123456",
    applicant: {
      id: "USR789012",
      name: "Ahmed Mohamed",
      nameAr: "أحمد محمد",
      email: "ahmed@example.com",
      avatar: "AM",
    },
    level: {
      id: "LVL3",
      name: "Advanced",
      nameAr: "متقدم",
    },
    status: "pending",
    submittedDate: "2023-11-15",
    lastUpdated: "2023-11-16",
    category: "certification",
    priority: "medium",
  },
  {
    id: "APP123457",
    applicant: {
      id: "USR789013",
      name: "Sara Ahmed",
      nameAr: "سارة أحمد",
      email: "sara@example.com",
      avatar: "SA",
    },
    level: {
      id: "LVL2",
      name: "Intermediate",
      nameAr: "متوسط",
    },
    status: "approved",
    submittedDate: "2023-11-10",
    lastUpdated: "2023-11-14",
    category: "certification",
    priority: "high",
  },
  {
    id: "APP123458",
    applicant: {
      id: "USR789014",
      name: "Mohamed Ali",
      nameAr: "محمد علي",
      email: "mohamed@example.com",
      avatar: "MA",
    },
    level: {
      id: "LVL1",
      name: "Basic",
      nameAr: "أساسي",
    },
    status: "rejected",
    submittedDate: "2023-11-05",
    lastUpdated: "2023-11-12",
    category: "certification",
    priority: "low",
  },
  {
    id: "APP123459",
    applicant: {
      id: "USR789015",
      name: "Fatima Hassan",
      nameAr: "فاطمة حسن",
      email: "fatima@example.com",
      avatar: "FH",
    },
    level: {
      id: "LVL3",
      name: "Advanced",
      nameAr: "متقدم",
    },
    status: "pending",
    submittedDate: "2023-11-14",
    lastUpdated: "2023-11-14",
    category: "certification",
    priority: "high",
  },
  {
    id: "APP123460",
    applicant: {
      id: "USR789016",
      name: "Khaled Mahmoud",
      nameAr: "خالد محمود",
      email: "khaled@example.com",
      avatar: "KM",
    },
    level: {
      id: "LVL2",
      name: "Intermediate",
      nameAr: "متوسط",
    },
    status: "pending",
    submittedDate: "2023-11-13",
    lastUpdated: "2023-11-13",
    category: "certification",
    priority: "medium",
  },
  {
    id: "APP123461",
    applicant: {
      id: "USR789017",
      name: "Layla Ibrahim",
      nameAr: "ليلى إبراهيم",
      email: "layla@example.com",
      avatar: "LI",
    },
    level: {
      id: "LVL1",
      name: "Basic",
      nameAr: "أساسي",
    },
    status: "approved",
    submittedDate: "2023-11-08",
    lastUpdated: "2023-11-11",
    category: "certification",
    priority: "low",
  },
  {
    id: "APP123462",
    applicant: {
      id: "USR789018",
      name: "Omar Nasser",
      nameAr: "عمر ناصر",
      email: "omar@example.com",
      avatar: "ON",
    },
    level: {
      id: "LVL3",
      name: "Advanced",
      nameAr: "متقدم",
    },
    status: "rejected",
    submittedDate: "2023-11-07",
    lastUpdated: "2023-11-10",
    category: "certification",
    priority: "medium",
  },
  {
    id: "APP123463",
    applicant: {
      id: "USR789019",
      name: "Nour Adel",
      nameAr: "نور عادل",
      email: "nour@example.com",
      avatar: "NA",
    },
    level: {
      id: "LVL2",
      name: "Intermediate",
      nameAr: "متوسط",
    },
    status: "pending",
    submittedDate: "2023-11-12",
    lastUpdated: "2023-11-12",
    category: "certification",
    priority: "high",
  },
]

export default function ReviewApplicationsPage() {
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTab, setSelectedTab] = useState("all")
  const itemsPerPage = 5

  // Check if user is logged in and is a reviewer
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "reviewer") {
        router.push("/dashboard")
      } else {
        // Simulate API call to fetch applications
        setTimeout(() => {
          setApplications(mockApplications)
          setFilteredApplications(mockApplications)
          setIsLoading(false)
        }, 1000)
      }
    }
  }, [user, authLoading, router])

  // Filter and sort applications when filters change
  useEffect(() => {
    let result = [...applications]

    // Filter by tab
    if (selectedTab === "pending") {
      result = result.filter((app) => app.status === "pending")
    } else if (selectedTab === "approved") {
      result = result.filter((app) => app.status === "approved")
    } else if (selectedTab === "rejected") {
      result = result.filter((app) => app.status === "rejected")
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((app) => app.status === statusFilter)
    }

    // Filter by level
    if (levelFilter !== "all") {
      result = result.filter((app) => app.level.id === levelFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      result = result.filter((app) => app.priority === priorityFilter)
    }

    // Search by ID or applicant name
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (app) =>
          app.id.toLowerCase().includes(query) ||
          app.applicant.name.toLowerCase().includes(query) ||
          app.applicant.nameAr.includes(query),
      )
    }

    // Sort applications
    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.submittedDate) > new Date(b.submittedDate) ? 1 : -1
      } else if (sortBy === "name") {
        return a.applicant.name.localeCompare(b.applicant.name)
      } else if (sortBy === "level") {
        return a.level.name.localeCompare(b.level.name)
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return 0
    })

    // Apply sort order
    if (sortOrder === "desc") {
      result.reverse()
    }

    setFilteredApplications(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [applications, searchQuery, statusFilter, levelFilter, priorityFilter, sortBy, sortOrder, selectedTab])

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage)

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle view application
  const handleViewApplication = (id) => {
    router.push(`/reviewer/review/${id}`)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            {t("pending")}
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            {t("approved")}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="mr-1 h-3 w-3" />
            {t("rejected")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {t("highPriority")}
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {t("mediumPriority")}
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {t("lowPriority")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("reviewApplications")}</h1>
          <p className="text-muted-foreground">{t("reviewAndEvaluateApplications")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/reviewer/dashboard")} className="flex items-center">
            {t("backToDashboard")}
          </Button>
        </div>
      </div>

      <Card className="bg-card mb-6">
        <CardHeader>
          <CardTitle>{t("applicationManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{t("all")}</span>
                <Badge variant="secondary" className="ml-1">
                  {applications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{t("pending")}</span>
                <Badge variant="secondary" className="ml-1">
                  {applications.filter((app) => app.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t("approved")}</span>
                <Badge variant="secondary" className="ml-1">
                  {applications.filter((app) => app.status === "approved").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>{t("rejected")}</span>
                <Badge variant="secondary" className="ml-1">
                  {applications.filter((app) => app.status === "rejected").length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("searchApplications")}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t("status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allStatuses")}</SelectItem>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                      <SelectItem value="approved">{t("approved")}</SelectItem>
                      <SelectItem value="rejected">{t("rejected")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[130px]">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t("level")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allLevels")}</SelectItem>
                      <SelectItem value="LVL1">{t("basic")}</SelectItem>
                      <SelectItem value="LVL2">{t("intermediate")}</SelectItem>
                      <SelectItem value="LVL3">{t("advanced")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[130px]">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t("priority")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allPriorities")}</SelectItem>
                      <SelectItem value="high">{t("highPriority")}</SelectItem>
                      <SelectItem value="medium">{t("mediumPriority")}</SelectItem>
                      <SelectItem value="low">{t("lowPriority")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("name")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {t("applicant")}
                          {sortBy === "name" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("level")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          {t("level")}
                          {sortBy === "level" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("date")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {t("submittedDate")}
                          {sortBy === "date" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("priority")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          {t("priority")}
                          {sortBy === "priority" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.length > 0 ? (
                      paginatedApplications.map((application) => (
                        <TableRow key={application.id} className="group hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`/placeholder.svg?height=32&width=32`}
                                  alt={application.applicant.name}
                                />
                                <AvatarFallback>{application.applicant.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{application.applicant.name}</div>
                                <div className="text-xs text-muted-foreground">{application.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{application.level.name}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span>{formatDate(application.submittedDate)}</span>
                              <span className="text-xs text-muted-foreground">
                                {t("lastUpdated")}: {formatDate(application.lastUpdated)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getPriorityBadge(application.priority)}
                          </TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewApplication(application.id)}
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t("review")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {t("noApplicationsFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredApplications.length > itemsPerPage && (
                <div className="flex items-center justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {/* Same content as "all" tab but filtered for pending */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("searchApplications")}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[130px]">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t("level")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allLevels")}</SelectItem>
                      <SelectItem value="LVL1">{t("basic")}</SelectItem>
                      <SelectItem value="LVL2">{t("intermediate")}</SelectItem>
                      <SelectItem value="LVL3">{t("advanced")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[130px]">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t("priority")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allPriorities")}</SelectItem>
                      <SelectItem value="high">{t("highPriority")}</SelectItem>
                      <SelectItem value="medium">{t("mediumPriority")}</SelectItem>
                      <SelectItem value="low">{t("lowPriority")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table content same as "all" tab */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("name")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {t("applicant")}
                          {sortBy === "name" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("level")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          {t("level")}
                          {sortBy === "level" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("date")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {t("submittedDate")}
                          {sortBy === "date" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("priority")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          {t("priority")}
                          {sortBy === "priority" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.length > 0 ? (
                      paginatedApplications.map((application) => (
                        <TableRow key={application.id} className="group hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`/placeholder.svg?height=32&width=32`}
                                  alt={application.applicant.name}
                                />
                                <AvatarFallback>{application.applicant.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{application.applicant.name}</div>
                                <div className="text-xs text-muted-foreground">{application.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{application.level.name}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span>{formatDate(application.submittedDate)}</span>
                              <span className="text-xs text-muted-foreground">
                                {t("lastUpdated")}: {formatDate(application.lastUpdated)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getPriorityBadge(application.priority)}
                          </TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewApplication(application.id)}
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t("review")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {t("noApplicationsFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination same as "all" tab */}
              {filteredApplications.length > itemsPerPage && (
                <div className="flex items-center justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {/* Similar content as "all" tab but filtered for approved */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("searchApplications")}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[130px]">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t("level")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allLevels")}</SelectItem>
                      <SelectItem value="LVL1">{t("basic")}</SelectItem>
                      <SelectItem value="LVL2">{t("intermediate")}</SelectItem>
                      <SelectItem value="LVL3">{t("advanced")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table content same as "all" tab */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("name")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {t("applicant")}
                          {sortBy === "name" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("level")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          {t("level")}
                          {sortBy === "level" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("date")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {t("submittedDate")}
                          {sortBy === "date" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("priority")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          {t("priority")}
                          {sortBy === "priority" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.length > 0 ? (
                      paginatedApplications.map((application) => (
                        <TableRow key={application.id} className="group hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`/placeholder.svg?height=32&width=32`}
                                  alt={application.applicant.name}
                                />
                                <AvatarFallback>{application.applicant.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{application.applicant.name}</div>
                                <div className="text-xs text-muted-foreground">{application.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{application.level.name}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span>{formatDate(application.submittedDate)}</span>
                              <span className="text-xs text-muted-foreground">
                                {t("lastUpdated")}: {formatDate(application.lastUpdated)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getPriorityBadge(application.priority)}
                          </TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewApplication(application.id)}
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t("view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {t("noApplicationsFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination same as "all" tab */}
              {filteredApplications.length > itemsPerPage && (
                <div className="flex items-center justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {/* Similar content as "all" tab but filtered for rejected */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("searchApplications")}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[130px]">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t("level")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allLevels")}</SelectItem>
                      <SelectItem value="LVL1">{t("basic")}</SelectItem>
                      <SelectItem value="LVL2">{t("intermediate")}</SelectItem>
                      <SelectItem value="LVL3">{t("advanced")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table content same as "all" tab */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("name")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {t("applicant")}
                          {sortBy === "name" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("level")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          {t("level")}
                          {sortBy === "level" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("date")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {t("submittedDate")}
                          {sortBy === "date" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center p-0 hover:bg-transparent"
                          onClick={() => {
                            setSortBy("priority")
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }}
                        >
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          {t("priority")}
                          {sortBy === "priority" && <ArrowUpDown className="ml-2 h-3 w-3" />}
                        </Button>
                      </TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.length > 0 ? (
                      paginatedApplications.map((application) => (
                        <TableRow key={application.id} className="group hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`/placeholder.svg?height=32&width=32`}
                                  alt={application.applicant.name}
                                />
                                <AvatarFallback>{application.applicant.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{application.applicant.name}</div>
                                <div className="text-xs text-muted-foreground">{application.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{application.level.name}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span>{formatDate(application.submittedDate)}</span>
                              <span className="text-xs text-muted-foreground">
                                {t("lastUpdated")}: {formatDate(application.lastUpdated)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getPriorityBadge(application.priority)}
                          </TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewApplication(application.id)}
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t("view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {t("noApplicationsFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination same as "all" tab */}
              {filteredApplications.length > itemsPerPage && (
                <div className="flex items-center justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
