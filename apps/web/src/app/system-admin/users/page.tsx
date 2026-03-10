"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Search, MoreHorizontal, Edit, Trash2, Lock, Unlock, Shield, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SystemAdminUsersPage() {
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("users")

  // Mock data
  const [systemUsers, setSystemUsers] = useState([
    {
      id: "1",
      name: "أحمد محمد",
      email: "ahmed.admin@system.com",
      role: "System Admin",
      status: "active",
      lastLogin: "2024-01-15 10:30",
      permissions: ["full_access", "user_management", "system_config"],
    },
    {
      id: "2",
      name: "سارة علي",
      email: "sara.registrar@system.com",
      role: "Registrar Admin",
      status: "active",
      lastLogin: "2024-01-15 09:15",
      permissions: ["user_management", "application_review"],
    },
    {
      id: "3",
      name: "محمد حسن",
      email: "mohamed.reviewer@system.com",
      role: "Senior Reviewer",
      status: "inactive",
      lastLogin: "2024-01-10 14:20",
      permissions: ["application_review", "document_verification"],
    },
  ])

  const [roles, setRoles] = useState([
    {
      id: "1",
      name: "System Administrator",
      description: "Full system access and configuration",
      permissions: ["full_access", "user_management", "system_config", "security_management"],
      userCount: 2,
    },
    {
      id: "2",
      name: "Registrar Admin",
      description: "Registration and user management",
      permissions: ["user_management", "application_review", "document_management"],
      userCount: 5,
    },
    {
      id: "3",
      name: "Senior Reviewer",
      description: "Advanced review and verification",
      permissions: ["application_review", "document_verification", "final_approval"],
      userCount: 8,
    },
    {
      id: "4",
      name: "Support Staff",
      description: "Customer support and basic operations",
      permissions: ["user_support", "basic_operations"],
      userCount: 12,
    },
  ])

  // Check if user is logged in and is a system admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "system-admin") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case "edit":
        router.push(`/system-admin/users/${userId}/edit`)
        break
      case "delete":
        toast({
          title: t("language") === "en" ? "User Deleted" : "تم حذف المستخدم",
          description: t("language") === "en" ? "User has been removed from the system" : "تم إزالة المستخدم من النظام",
        })
        break
      case "lock":
        toast({
          title: t("language") === "en" ? "User Locked" : "تم قفل المستخدم",
          description: t("language") === "en" ? "User account has been locked" : "تم قفل حساب المستخدم",
        })
        break
      case "unlock":
        toast({
          title: t("language") === "en" ? "User Unlocked" : "تم إلغاء قفل المستخدم",
          description: t("language") === "en" ? "User account has been unlocked" : "تم إلغاء قفل حساب المستخدم",
        })
        break
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "System Admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "Registrar Admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "Senior Reviewer":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("language") === "en" ? "User & Role Management" : "إدارة المستخدمين والأدوار"}
          </h1>
          <p className="text-muted-foreground">
            {t("language") === "en"
              ? "Manage system users, roles, and permissions"
              : "إدارة مستخدمي النظام والأدوار والصلاحيات"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/system-admin/users/new")}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Add User" : "إضافة مستخدم"}
          </Button>
          <Button onClick={() => router.push("/system-admin/roles/new")} className="bg-gradient-green hover:opacity-90">
            <Shield className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Create Role" : "إنشاء دور"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "System Users" : "مستخدمو النظام"}
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Roles & Permissions" : "الأدوار والصلاحيات"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{t("language") === "en" ? "System Users" : "مستخدمو النظام"}</CardTitle>
                  <CardDescription>
                    {t("language") === "en"
                      ? "Manage administrative and staff user accounts"
                      : "إدارة حسابات المستخدمين الإداريين والموظفين"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("language") === "en" ? "Search users..." : "البحث عن المستخدمين..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("language") === "en" ? "User" : "المستخدم"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Role" : "الدور"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Status" : "الحالة"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Last Login" : "آخر دخول"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Permissions" : "الصلاحيات"}</TableHead>
                    <TableHead className="text-right">{t("language") === "en" ? "Actions" : "الإجراءات"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status === "active"
                            ? t("language") === "en"
                              ? "Active"
                              : "نشط"
                            : t("language") === "en"
                              ? "Inactive"
                              : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {user.permissions.slice(0, 2).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission.replace("_", " ")}
                            </Badge>
                          ))}
                          {user.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUserAction("edit", user.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("language") === "en" ? "Edit" : "تعديل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.status === "active" ? "lock" : "unlock", user.id)}
                            >
                              {user.status === "active" ? (
                                <Lock className="mr-2 h-4 w-4" />
                              ) : (
                                <Unlock className="mr-2 h-4 w-4" />
                              )}
                              {user.status === "active"
                                ? t("language") === "en"
                                  ? "Lock"
                                  : "قفل"
                                : t("language") === "en"
                                  ? "Unlock"
                                  : "إلغاء القفل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUserAction("delete", user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("language") === "en" ? "Delete" : "حذف"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {role.name}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        {t("language") === "en" ? "Permissions" : "الصلاحيات"}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/system-admin/roles/${role.id}/edit`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t("language") === "en" ? "Edit" : "تعديل"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/system-admin/roles/${role.id}/users`)}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        {t("language") === "en" ? "Manage Users" : "إدارة المستخدمين"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
