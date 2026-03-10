"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  UserPlus,
  UserCog,
  UserX,
  MoreHorizontal,
  User,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Upload,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegistrarUsersPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("engineer")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "engineer",
    type: "individual",
  })

  // Get role from URL if present
  const roleParam = searchParams.get("role")
  const [activeTab, setActiveTab] = useState(roleParam || "all")

  // Sample data with more detailed information
  const users = [
    {
      id: 1,
      name: language === "en" ? "Ahmed Mohamed" : "أحمد محمد",
      email: "ahmed@example.com",
      role: "engineer",
      type: "individual",
      status: "active",
      licenseExpiry: "2024-12-31",
      registrationDate: "2023-01-15",
      specialization: language === "en" ? "Irrigation Engineering" : "هندسة الري",
      avatar: "AM",
      documents: 5,
      verified: true,
    },
    {
      id: 2,
      name: language === "en" ? "Green Valley Agricultural Co." : "شركة الوادي الأخضر الزراعية",
      email: "info@greenvalley.com",
      role: "institution",
      type: "company",
      status: "active",
      licenseExpiry: "2024-06-30",
      registrationDate: "2022-08-20",
      specialization: language === "en" ? "Agricultural Consulting" : "الاستشارات الزراعية",
      avatar: "GV",
      documents: 8,
      verified: true,
    },
    {
      id: 3,
      name: language === "en" ? "Sara Ali" : "سارة علي",
      email: "sara@example.com",
      role: "engineer",
      type: "individual",
      status: "pending",
      licenseExpiry: null,
      registrationDate: "2023-11-01",
      specialization: language === "en" ? "Soil Science" : "علوم التربة",
      avatar: "SA",
      documents: 3,
      verified: false,
    },
    {
      id: 4,
      name: language === "en" ? "Modern Farms Institute" : "معهد المزارع الحديثة",
      email: "contact@modernfarms.edu",
      role: "institution",
      type: "educational",
      status: "suspended",
      licenseExpiry: "2024-03-15",
      registrationDate: "2021-05-10",
      specialization: language === "en" ? "Agricultural Education" : "التعليم الزراعي",
      avatar: "MF",
      documents: 12,
      verified: true,
    },
    {
      id: 5,
      name: language === "en" ? "Khaled Ibrahim" : "خالد إبراهيم",
      email: "khaled@example.com",
      role: "engineer",
      type: "individual",
      status: "expired",
      licenseExpiry: "2023-10-31",
      registrationDate: "2020-03-22",
      specialization: language === "en" ? "Agricultural Machinery" : "الآلات الزراعية",
      avatar: "KI",
      documents: 6,
      verified: true,
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
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const handleApproveUser = (userId: number) => {
    toast({
      title: language === "en" ? "User Approved" : "تمت الموافقة على المستخدم",
      description: language === "en" ? "The user has been approved successfully" : "تمت الموافقة على المستخدم بنجاح",
    })
  }

  const handleRejectUser = (userId: number) => {
    toast({
      title: language === "en" ? "User Rejected" : "تم رفض المستخدم",
      description: language === "en" ? "The user has been rejected" : "تم رفض المستخدم",
      variant: "destructive",
    })
  }

  const handleSuspendUser = (userId: number) => {
    toast({
      title: language === "en" ? "User Suspended" : "تم تعليق المستخدم",
      description: language === "en" ? "The user has been suspended" : "تم تعليق المستخدم",
      variant: "destructive",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">{language === "en" ? "Active" : "نشط"}</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">{language === "en" ? "Pending" : "معلق"}</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">{language === "en" ? "Suspended" : "معلق"}</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">{language === "en" ? "Expired" : "منتهي"}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRoleIcon = (role: string, type: string) => {
    if (role === "institution") {
      return <Building2 className="h-4 w-4 text-blue-500" />
    }
    return <User className="h-4 w-4 text-primary" />
  }

  const isLicenseExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isLicenseExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const now = new Date()
    return expiry < now
  }

  const filteredUsers = (role: string) => {
    return users.filter((u) => {
      const matchesRole = role === "all" || u.role === role
      const matchesStatus = statusFilter === "all" || u.status === statusFilter
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.specialization.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesRole && matchesStatus && matchesSearch
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
          <h1 className="text-3xl font-bold mb-2">{language === "en" ? "User Management" : "إدارة المستخدمين"}</h1>
          <p className="text-muted-foreground">
            {language === "en" ? "Manage engineers and institutions registration" : "إدارة تسجيل المهندسين والمؤسسات"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/registrar/users/import")}>
            <Upload className="mr-2 h-4 w-4" />
            {language === "en" ? "Import" : "استيراد"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/registrar/users/export")}>
            <Download className="mr-2 h-4 w-4" />
            {language === "en" ? "Export" : "تصدير"}
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            {language === "en" ? "Add User" : "إضافة مستخدم"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === "en" ? "Search users..." : "البحث عن مستخدمين..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={language === "en" ? "Status" : "الحالة"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "en" ? "All Status" : "جميع الحالات"}</SelectItem>
            <SelectItem value="active">{language === "en" ? "Active" : "نشط"}</SelectItem>
            <SelectItem value="pending">{language === "en" ? "Pending" : "معلق"}</SelectItem>
            <SelectItem value="suspended">{language === "en" ? "Suspended" : "معلق"}</SelectItem>
            <SelectItem value="expired">{language === "en" ? "Expired" : "منتهي"}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            {language === "en" ? "All Users" : "جميع المستخدمين"}
            <Badge className="ml-2 bg-primary">{filteredUsers("all").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="engineer">
            {language === "en" ? "Engineers" : "المهندسين"}
            <Badge className="ml-2 bg-primary">{filteredUsers("engineer").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="institution">
            {language === "en" ? "Institutions" : "المؤسسات"}
            <Badge className="ml-2 bg-primary">{filteredUsers("institution").length}</Badge>
          </TabsTrigger>
        </TabsList>

        {["all", "engineer", "institution"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {filteredUsers(tabValue === "all" ? "all" : tabValue).length > 0 ? (
              filteredUsers(tabValue === "all" ? "all" : tabValue).map((u) => (
                <Card key={u.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={u.name} />
                          <AvatarFallback>{u.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-lg">{u.name}</h3>
                            {getRoleIcon(u.role, u.type)}
                            {getStatusBadge(u.status)}
                            {u.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {isLicenseExpiringSoon(u.licenseExpiry) && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            {isLicenseExpired(u.licenseExpiry) && <XCircle className="h-4 w-4 text-red-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{u.email}</p>
                          <p className="text-sm text-muted-foreground mb-2">{u.specialization}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {language === "en" ? "Registered:" : "مسجل:"} {u.registrationDate}
                            </span>
                            {u.licenseExpiry && (
                              <span>
                                {language === "en" ? "Expires:" : "ينتهي:"} {u.licenseExpiry}
                              </span>
                            )}
                            <span>
                              {language === "en" ? "Documents:" : "المستندات:"} {u.documents}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleApproveUser(u.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {language === "en" ? "Approve" : "موافقة"}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectUser(u.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              {language === "en" ? "Reject" : "رفض"}
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => router.push(`/registrar/users/${u.id}`)}>
                          <FileText className="h-4 w-4 mr-1" />
                          {language === "en" ? "View" : "عرض"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{language === "en" ? "Actions" : "الإجراءات"}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/registrar/users/${u.id}/edit`)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              {language === "en" ? "Edit Profile" : "تعديل الملف"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/registrar/users/${u.id}/documents`)}>
                              <FileText className="mr-2 h-4 w-4" />
                              {language === "en" ? "Manage Documents" : "إدارة المستندات"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/registrar/users/${u.id}/license`)}>
                              <Clock className="mr-2 h-4 w-4" />
                              {language === "en" ? "License Management" : "إدارة الترخيص"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {u.status === "active" && (
                              <DropdownMenuItem onClick={() => handleSuspendUser(u.id)} className="text-red-600">
                                <UserX className="mr-2 h-4 w-4" />
                                {language === "en" ? "Suspend User" : "تعليق المستخدم"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {language === "en" ? "No users found" : "لم يتم العثور على مستخدمين"}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Add New User" : "إضافة مستخدم جديد"}</DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Add a new engineer or institution to the system"
                : "إضافة مهندس أو مؤسسة جديدة إلى النظام"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">{language === "en" ? "User Type" : "نوع المستخدم"}</label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value)
                  setNewUserData({ ...newUserData, role: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select type" : "اختر النوع"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineer">{language === "en" ? "Engineer" : "مهندس"}</SelectItem>
                  <SelectItem value="institution">{language === "en" ? "Institution" : "مؤسسة"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                {selectedRole === "engineer"
                  ? language === "en"
                    ? "Engineer Name"
                    : "اسم المهندس"
                  : language === "en"
                    ? "Institution Name"
                    : "اسم المؤسسة"}
              </label>
              <Input
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                placeholder={
                  selectedRole === "engineer"
                    ? language === "en"
                      ? "Full Name"
                      : "الاسم الكامل"
                    : language === "en"
                      ? "Institution Name"
                      : "اسم المؤسسة"
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">{language === "en" ? "Email" : "البريد الإلكتروني"}</label>
              <Input
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {language === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: language === "en" ? "User Added" : "تمت إضافة المستخدم",
                  description: language === "en" ? "The user has been added successfully" : "تمت إضافة المستخدم بنجاح",
                })
                setDialogOpen(false)
                setNewUserData({ name: "", email: "", role: "engineer", type: "individual" })
              }}
            >
              {language === "en" ? "Add User" : "إضافة مستخدم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
