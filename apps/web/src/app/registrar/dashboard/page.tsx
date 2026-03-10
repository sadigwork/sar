"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClipboardList,
  RotateCw,
  FileCheck,
  FileX,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
} from "lucide-react"

export default function RegistrarDashboardPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

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
          <h1 className="text-3xl font-bold mb-2">{language === "en" ? "Registrar Dashboard" : "لوحة تحكم المسجل"}</h1>
          <p className="text-muted-foreground">
            {language === "en" ? "Manage engineer registrations and renewals" : "إدارة تسجيلات المهندسين وتجديداتهم"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/registrar/users")}>
            <Users className="mr-2 h-4 w-4" />
            {language === "en" ? "Manage Users" : "إدارة المستخدمين"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/registrar/documents")}>
            <FileText className="mr-2 h-4 w-4" />
            {language === "en" ? "Documents" : "المستندات"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/registrar/billing")}>
            <CreditCard className="mr-2 h-4 w-4" />
            {language === "en" ? "Billing" : "الفواتير"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "New Applications" : "الطلبات الجديدة"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Pending registration applications" : "طلبات التسجيل المعلقة"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <Button
              variant="link"
              className="p-0 h-auto mt-2"
              onClick={() => router.push("/registrar/applications?status=new")}
            >
              {language === "en" ? "View applications" : "عرض الطلبات"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Renewals" : "التجديدات"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Pending renewal requests" : "طلبات التجديد المعلقة"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <Button
              variant="link"
              className="p-0 h-auto mt-2"
              onClick={() => router.push("/registrar/renewals?status=pending")}
            >
              {language === "en" ? "View renewals" : "عرض التجديدات"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Approved" : "تمت الموافقة"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Recently approved registrations" : "التسجيلات الموافق عليها مؤخرًا"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <Button
              variant="link"
              className="p-0 h-auto mt-2"
              onClick={() => router.push("/registrar/applications?status=approved")}
            >
              {language === "en" ? "View approved" : "عرض الموافق عليها"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Rejected" : "مرفوضة"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Recently rejected applications" : "الطلبات المرفوضة مؤخرًا"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <Button
              variant="link"
              className="p-0 h-auto mt-2"
              onClick={() => router.push("/registrar/applications?status=rejected")}
            >
              {language === "en" ? "View rejected" : "عرض المرفوضة"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Institutions" : "المؤسسات"}</CardTitle>
            <CardDescription>{language === "en" ? "Registered institutions" : "المؤسسات المسجلة"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <Button variant="link" className="p-0 h-auto mt-2" onClick={() => router.push("/registrar/institutions")}>
              {language === "en" ? "View institutions" : "عرض المؤسسات"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Expiring Soon" : "تنتهي قريباً"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Licenses expiring in 30 days" : "التراخيص التي تنتهي خلال 30 يوم"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <Button variant="link" className="p-0 h-auto mt-2" onClick={() => router.push("/registrar/expiring")}>
              {language === "en" ? "View expiring" : "عرض المنتهية"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="mb-6">
          <TabsTrigger value="recent">
            <ClipboardList className="mr-2 h-4 w-4" />
            {language === "en" ? "Recent Applications" : "الطلبات الحديثة"}
          </TabsTrigger>
          <TabsTrigger value="renewals">
            <RotateCw className="mr-2 h-4 w-4" />
            {language === "en" ? "Recent Renewals" : "التجديدات الحديثة"}
          </TabsTrigger>
          <TabsTrigger value="expiring">
            <FileCheck className="mr-2 h-4 w-4" />
            {language === "en" ? "Expiring Soon" : "تنتهي قريبًا"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Recent Registration Applications" : "طلبات التسجيل الحديثة"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Applications received in the last 7 days" : "الطلبات المستلمة في آخر 7 أيام"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Users className="h-10 w-10 p-2 bg-primary/10 text-primary rounded-full" />
                      <div>
                        <h3 className="font-medium">{language === "en" ? `Engineer ${i}` : `المهندس ${i}`}</h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push(`/registrar/applications/${i}`)}>
                        {language === "en" ? "View" : "عرض"}
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push("/registrar/applications")}>
                  {language === "en" ? "View All Applications" : "عرض جميع الطلبات"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renewals">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Recent Renewal Requests" : "طلبات التجديد الحديثة"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Renewal requests received in the last 7 days"
                  : "طلبات التجديد المستلمة في آخر 7 أيام"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <RotateCw className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-full" />
                      <div>
                        <h3 className="font-medium">{language === "en" ? `Engineer ${i + 5}` : `المهندس ${i + 5}`}</h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Expires in 30 days" : "تنتهي خلال 30 يوم"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push(`/registrar/renewals/${i}`)}>
                        {language === "en" ? "View" : "عرض"}
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push("/registrar/renewals")}>
                  {language === "en" ? "View All Renewals" : "عرض جميع التجديدات"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Registrations Expiring Soon" : "التسجيلات التي تنتهي قريبًا"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Registrations expiring in the next 30 days"
                  : "التسجيلات التي تنتهي خلال الـ 30 يومًا القادمة"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileX className="h-10 w-10 p-2 bg-yellow-100 text-yellow-600 rounded-full" />
                      <div>
                        <h3 className="font-medium">
                          {language === "en" ? `Engineer ${i + 10}` : `المهندس ${i + 10}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? `Expires in ${i * 5} days` : `تنتهي خلال ${i * 5} يوم`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push(`/registrar/engineers/${i + 10}`)}>
                        {language === "en" ? "View" : "عرض"}
                      </Button>
                      <Button size="sm" variant="outline">
                        {language === "en" ? "Send Reminder" : "إرسال تذكير"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push("/registrar/expiring")}>
                  {language === "en" ? "View All Expiring" : "عرض جميع المنتهية"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
