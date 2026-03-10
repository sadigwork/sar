"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react"

export default function NotificationSettingsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    email: {
      newApplications: true,
      applicationUpdates: true,
      documentVerification: true,
      systemAnnouncements: false,
      reminders: true,
    },
    inApp: {
      newApplications: true,
      applicationUpdates: true,
      documentVerification: true,
      systemAnnouncements: true,
      reminders: true,
    },
    sms: {
      newApplications: false,
      applicationUpdates: false,
      documentVerification: false,
      systemAnnouncements: false,
      reminders: false,
    },
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // In a real app, fetch notification settings from API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [router, user])

  const handleToggle = (channel: "email" | "inApp" | "sms", setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: !prev[channel][setting],
      },
    }))
  }

  const saveSettings = () => {
    // In a real app, save settings to API
    toast({
      title: language === "en" ? "Settings saved" : "تم حفظ الإعدادات",
      description:
        language === "en" ? "Your notification preferences have been updated" : "تم تحديث تفضيلات الإشعارات الخاصة بك",
    })
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center mb-6">
          <Button variant="outline" disabled className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "en" ? "Back" : "رجوع"}
          </Button>
          <h1 className="text-2xl font-bold">{language === "en" ? "Loading..." : "جاري التحميل..."}</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back" : "رجوع"}
        </Button>
        <h1 className="text-2xl font-bold">{language === "en" ? "Notification Settings" : "إعدادات الإشعارات"}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{language === "en" ? "Notification Preferences" : "تفضيلات الإشعارات"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Choose how and when you want to be notified" : "اختر كيف ومتى تريد أن يتم إشعارك"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inApp">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inApp">
                <Bell className="mr-2 h-4 w-4" />
                {language === "en" ? "In-App" : "داخل التطبيق"}
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                {language === "en" ? "Email" : "البريد الإلكتروني"}
              </TabsTrigger>
              <TabsTrigger value="sms">
                <Smartphone className="mr-2 h-4 w-4" />
                {language === "en" ? "SMS" : "الرسائل النصية"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inApp" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inApp-newApplications" className="font-medium">
                      {language === "en" ? "New Applications" : "الطلبات الجديدة"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive notifications when new applications are submitted"
                        : "تلقي إشعارات عند تقديم طلبات جديدة"}
                    </p>
                  </div>
                  <Switch
                    id="inApp-newApplications"
                    checked={settings.inApp.newApplications}
                    onCheckedChange={() => handleToggle("inApp", "newApplications")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inApp-applicationUpdates" className="font-medium">
                      {language === "en" ? "Application Updates" : "تحديثات الطلبات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive notifications when applications are updated"
                        : "تلقي إشعارات عند تحديث الطلبات"}
                    </p>
                  </div>
                  <Switch
                    id="inApp-applicationUpdates"
                    checked={settings.inApp.applicationUpdates}
                    onCheckedChange={() => handleToggle("inApp", "applicationUpdates")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inApp-documentVerification" className="font-medium">
                      {language === "en" ? "Document Verification" : "التحقق من المستندات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive notifications about document verification status"
                        : "تلقي إشعارات حول حالة التحقق من المستندات"}
                    </p>
                  </div>
                  <Switch
                    id="inApp-documentVerification"
                    checked={settings.inApp.documentVerification}
                    onCheckedChange={() => handleToggle("inApp", "documentVerification")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inApp-systemAnnouncements" className="font-medium">
                      {language === "en" ? "System Announcements" : "إعلانات النظام"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive system-wide announcements and updates"
                        : "تلقي إعلانات وتحديثات على مستوى النظام"}
                    </p>
                  </div>
                  <Switch
                    id="inApp-systemAnnouncements"
                    checked={settings.inApp.systemAnnouncements}
                    onCheckedChange={() => handleToggle("inApp", "systemAnnouncements")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inApp-reminders" className="font-medium">
                      {language === "en" ? "Reminders" : "التذكيرات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive reminders about pending tasks and deadlines"
                        : "تلقي تذكيرات حول المهام المعلقة والمواعيد النهائية"}
                    </p>
                  </div>
                  <Switch
                    id="inApp-reminders"
                    checked={settings.inApp.reminders}
                    onCheckedChange={() => handleToggle("inApp", "reminders")}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-newApplications" className="font-medium">
                      {language === "en" ? "New Applications" : "الطلبات الجديدة"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive email notifications when new applications are submitted"
                        : "تلقي إشعارات بالبريد الإلكتروني عند تقديم طلبات جديدة"}
                    </p>
                  </div>
                  <Switch
                    id="email-newApplications"
                    checked={settings.email.newApplications}
                    onCheckedChange={() => handleToggle("email", "newApplications")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-applicationUpdates" className="font-medium">
                      {language === "en" ? "Application Updates" : "تحديثات الطلبات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive email notifications when applications are updated"
                        : "تلقي إشعارات بالبريد الإلكتروني عند تحديث الطلبات"}
                    </p>
                  </div>
                  <Switch
                    id="email-applicationUpdates"
                    checked={settings.email.applicationUpdates}
                    onCheckedChange={() => handleToggle("email", "applicationUpdates")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-documentVerification" className="font-medium">
                      {language === "en" ? "Document Verification" : "التحقق من المستندات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive email notifications about document verification status"
                        : "تلقي إشعارات بالبريد الإلكتروني حول حالة التحقق من المستندات"}
                    </p>
                  </div>
                  <Switch
                    id="email-documentVerification"
                    checked={settings.email.documentVerification}
                    onCheckedChange={() => handleToggle("email", "documentVerification")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-systemAnnouncements" className="font-medium">
                      {language === "en" ? "System Announcements" : "إعلانات النظام"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive system-wide announcements and updates via email"
                        : "تلقي إعلانات وتحديثات على مستوى النظام عبر البريد الإلكتروني"}
                    </p>
                  </div>
                  <Switch
                    id="email-systemAnnouncements"
                    checked={settings.email.systemAnnouncements}
                    onCheckedChange={() => handleToggle("email", "systemAnnouncements")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-reminders" className="font-medium">
                      {language === "en" ? "Reminders" : "التذكيرات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive email reminders about pending tasks and deadlines"
                        : "تلقي تذكيرات بالبريد الإلكتروني حول المهام المعلقة والمواعيد النهائية"}
                    </p>
                  </div>
                  <Switch
                    id="email-reminders"
                    checked={settings.email.reminders}
                    onCheckedChange={() => handleToggle("email", "reminders")}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sms" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-newApplications" className="font-medium">
                      {language === "en" ? "New Applications" : "الطلبات الجديدة"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive SMS notifications when new applications are submitted"
                        : "تلقي إشعارات نصية عند تقديم طلبات جديدة"}
                    </p>
                  </div>
                  <Switch
                    id="sms-newApplications"
                    checked={settings.sms.newApplications}
                    onCheckedChange={() => handleToggle("sms", "newApplications")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-applicationUpdates" className="font-medium">
                      {language === "en" ? "Application Updates" : "تحديثات الطلبات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive SMS notifications when applications are updated"
                        : "تلقي إشعارات نصية عند تحديث الطلبات"}
                    </p>
                  </div>
                  <Switch
                    id="sms-applicationUpdates"
                    checked={settings.sms.applicationUpdates}
                    onCheckedChange={() => handleToggle("sms", "applicationUpdates")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-documentVerification" className="font-medium">
                      {language === "en" ? "Document Verification" : "التحقق من المستندات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive SMS notifications about document verification status"
                        : "تلقي إشعارات نصية حول حالة التحقق من المستندات"}
                    </p>
                  </div>
                  <Switch
                    id="sms-documentVerification"
                    checked={settings.sms.documentVerification}
                    onCheckedChange={() => handleToggle("sms", "documentVerification")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-systemAnnouncements" className="font-medium">
                      {language === "en" ? "System Announcements" : "إعلانات النظام"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive system-wide announcements and updates via SMS"
                        : "تلقي إعلانات وتحديثات على مستوى النظام عبر الرسائل النصية"}
                    </p>
                  </div>
                  <Switch
                    id="sms-systemAnnouncements"
                    checked={settings.sms.systemAnnouncements}
                    onCheckedChange={() => handleToggle("sms", "systemAnnouncements")}
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-reminders" className="font-medium">
                      {language === "en" ? "Reminders" : "التذكيرات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en"
                        ? "Receive SMS reminders about pending tasks and deadlines"
                        : "تلقي تذكيرات نصية حول المهام المعلقة والمواعيد النهائية"}
                    </p>
                  </div>
                  <Switch
                    id="sms-reminders"
                    checked={settings.sms.reminders}
                    onCheckedChange={() => handleToggle("sms", "reminders")}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={saveSettings}>{language === "en" ? "Save Settings" : "حفظ الإعدادات"}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Notification Frequency" : "تكرار الإشعارات"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Choose how often you want to receive notifications" : "اختر عدد مرات تلقي الإشعارات"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="digest-mode" className="flex-1">
                <span className="font-medium">{language === "en" ? "Daily Digest Mode" : "وضع الملخص اليومي"}</span>
                <p className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "Receive a single daily summary instead of individual notifications"
                    : "تلقي ملخص يومي واحد بدلاً من إشعارات فردية"}
                </p>
              </Label>
              <Switch id="digest-mode" />
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="quiet-hours" className="flex-1">
                <span className="font-medium">{language === "en" ? "Quiet Hours" : "ساعات الهدوء"}</span>
                <p className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "Don't send notifications during specified hours"
                    : "عدم إرسال إشعارات خلال ساعات محددة"}
                </p>
              </Label>
              <Switch id="quiet-hours" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
