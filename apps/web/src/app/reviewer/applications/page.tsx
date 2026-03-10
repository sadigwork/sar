"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Filter, CheckCircle2, XCircle, Clock } from "lucide-react"

export default function ReviewerApplicationsPage() {
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data
  const applications = [
    {
      id: 1,
      name: t("language") === "en" ? "Ahmed Mohamed" : "أحمد محمد",
      level: t("language") === "en" ? "Expert Level" : "مستوى خبير",
      status: "new",
      date: t("language") === "en" ? "2023-05-15" : "١٥-٠٥-٢٠٢٣",
      avatar: "AM",
    },
    {
      id: 2,
      name: t("language") === "en" ? "Sara Ali" : "سارة علي",
      level: t("language") === "en" ? "Intermediate Level" : "مستوى متوسط",
      status: "pending",
      date: t("language") === "en" ? "2023-05-12" : "١٢-٠٥-٢٠٢٣",
      avatar: "SA",
    },
    {
      id: 3,
      name: t("language") === "en" ? "Khaled Ibrahim" : "خالد إبراهيم",
      level: t("language") === "en" ? "Advanced Level" : "مستوى متقدم",
      status: "pending",
      date: t("language") === "en" ? "2023-05-10" : "١٠-٠٥-٢٠٢٣",
      avatar: "KI",
    },
    {
      id: 4,
      name: t("language") === "en" ? "Fatima Hassan" : "فاطمة حسن",
      level: t("language") === "en" ? "Entry Level" : "مستوى مبتدئ",
      status: "approved",
      date: t("language") === "en" ? "2023-05-08" : "٠٨-٠٥-٢٠٢٣",
      avatar: "FH",
    },
    {
      id: 5,
      name: t("language") === "en" ? "Omar Mahmoud" : "عمر محمود",
      level: t("language") === "en" ? "Senior Expert" : "خبير متقدم",
      status: "rejected",
      date: t("language") === "en" ? "2023-05-05" : "٠٥-٠٥-٢٠٢٣",
      avatar: "OM",
    },
  ]

  // Check if user is logged in and is a reviewer
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "reviewer") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "new":
        return <Badge className="bg-blue-500">{t("language") === "en" ? "New" : "جديد"}</Badge>
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return t("language") === "en" ? "Approved" : "تمت الموافقة"
      case "rejected":
        return t("language") === "en" ? "Rejected" : "مرفوض"
      case "new":
        return t("language") === "en" ? "New" : "جديد"
      default:
        return t("language") === "en" ? "Pending" : "قيد الانتظار"
    }
  }

  const filteredApplications = (status: string) => {
    return applications.filter(
      (app) =>
        (status === "all" || app.status === status) &&
        (app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.level.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">{t("language") === "en" ? "Applications" : "الطلبات"}</h1>
      <p className="text-muted-foreground mb-6">
        {t("language") === "en"
          ? "Review and manage certification applications"
          : "مراجعة وإدارة طلبات الشهادات المهنية"}
      </p>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("language") === "en" ? "Search applications..." : "البحث في الطلبات..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">{t("language") === "en" ? "All" : "الكل"}</TabsTrigger>
          <TabsTrigger value="new">{t("language") === "en" ? "New" : "جديد"}</TabsTrigger>
          <TabsTrigger value="pending">{t("language") === "en" ? "Pending" : "قيد الانتظار"}</TabsTrigger>
          <TabsTrigger value="approved">{t("language") === "en" ? "Approved" : "تمت الموافقة"}</TabsTrigger>
          <TabsTrigger value="rejected">{t("language") === "en" ? "Rejected" : "مرفوض"}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications("all").length > 0 ? (
            filteredApplications("all").map((app) => (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={app.name} />
                        <AvatarFallback>{app.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{app.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("language") === "en" ? "Applied for: " : "تقدم للحصول على: "}
                          {app.level}
                        </p>
                        <p className="text-xs text-muted-foreground">{app.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(app.status)}
                        <span className="text-sm">{getStatusText(app.status)}</span>
                      </div>
                      <Button size="sm" onClick={() => router.push(`/reviewer/applications/${app.id}`)}>
                        {t("language") === "en" ? "Review" : "مراجعة"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {t("language") === "en" ? "No applications found" : "لم يتم العثور على طلبات"}
              </p>
            </div>
          )}
        </TabsContent>

        {["new", "pending", "approved", "rejected"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filteredApplications(status).length > 0 ? (
              filteredApplications(status).map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={app.name} />
                          <AvatarFallback>{app.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{app.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t("language") === "en" ? "Applied for: " : "تقدم للحصول على: "}
                            {app.level}
                          </p>
                          <p className="text-xs text-muted-foreground">{app.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(app.status)}
                          <span className="text-sm">{getStatusText(app.status)}</span>
                        </div>
                        <Button size="sm" onClick={() => router.push(`/reviewer/applications/${app.id}`)}>
                          {t("language") === "en" ? "Review" : "مراجعة"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {t("language") === "en" ? "No applications found" : "لم يتم العثور على طلبات"}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
