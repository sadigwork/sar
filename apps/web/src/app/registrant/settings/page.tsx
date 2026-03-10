"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Bell, Shield, Globe, User } from "lucide-react"

export default function RegistrantSettingsPage() {
  const [profileData, setProfileData] = useState({
    language: "ar",
    timezone: "Asia/Riyadh",
    dateFormat: "dd/mm/yyyy",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    paymentReminders: true,
    systemAnnouncements: true,
    marketingEmails: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "private",
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
  })

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handlePrivacyChange = (field: string, value: string | boolean) => {
    setPrivacySettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Handle save logic
    console.log("Settings saved:", { profileData, notificationSettings, privacySettings })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2 space-x-reverse">
            <User className="h-4 w-4" />
            <span>الملف الشخصي</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2 space-x-reverse">
            <Bell className="h-4 w-4" />
            <span>الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2 space-x-reverse">
            <Shield className="h-4 w-4" />
            <span>الخصوصية</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2 space-x-reverse">
            <Globe className="h-4 w-4" />
            <span>التفضيلات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الملف الشخصي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <Button variant="outline">تغيير كلمة المرور</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">المصادقة الثنائية</h4>
                  <p className="text-sm text-gray-600">إضافة طبقة حماية إضافية لحسابك</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">تسجيل الدخول بالبصمة</h4>
                  <p className="text-sm text-gray-600">استخدام البصمة لتسجيل الدخول</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">إشعارات البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-600">تلقي الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">إشعارات الرسائل النصية</h4>
                    <p className="text-sm text-gray-600">تلقي الإشعارات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">تحديثات الطلبات</h4>
                    <p className="text-sm text-gray-600">إشعارات حول حالة طلباتك</p>
                  </div>
                  <Switch
                    checked={notificationSettings.applicationUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("applicationUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">تذكيرات الدفع</h4>
                    <p className="text-sm text-gray-600">تذكيرات بالفواتير المستحقة</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentReminders}
                    onCheckedChange={(checked) => handleNotificationChange("paymentReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">إعلانات النظام</h4>
                    <p className="text-sm text-gray-600">إشعارات حول تحديثات النظام</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAnnouncements}
                    onCheckedChange={(checked) => handleNotificationChange("systemAnnouncements", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">رسائل تسويقية</h4>
                    <p className="text-sm text-gray-600">تلقي عروض وأخبار النقابة</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الخصوصية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileVisibility">مستوى ظهور الملف الشخصي</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">عام - يمكن للجميع رؤيته</SelectItem>
                      <SelectItem value="members">الأعضاء فقط</SelectItem>
                      <SelectItem value="private">خاص - لا يظهر للآخرين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">إظهار البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-600">السماح للآخرين برؤية بريدك الإلكتروني</p>
                  </div>
                  <Switch
                    checked={privacySettings.showEmail}
                    onCheckedChange={(checked) => handlePrivacyChange("showEmail", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">إظهار رقم الهاتف</h4>
                    <p className="text-sm text-gray-600">السماح للآخرين برؤية رقم هاتفك</p>
                  </div>
                  <Switch
                    checked={privacySettings.showPhone}
                    onCheckedChange={(checked) => handlePrivacyChange("showPhone", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">السماح بالرسائل المباشرة</h4>
                    <p className="text-sm text-gray-600">السماح للأعضاء الآخرين بإرسال رسائل لك</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowDirectMessages}
                    onCheckedChange={(checked) => handlePrivacyChange("allowDirectMessages", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التفضيلات العامة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">اللغة</Label>
                  <Select
                    value={profileData.language}
                    onValueChange={(value) => handleProfileChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select
                    value={profileData.timezone}
                    onValueChange={(value) => handleProfileChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                      <SelectItem value="Asia/Kuwait">الكويت (GMT+3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">تنسيق التاريخ</Label>
                  <Select
                    value={profileData.dateFormat}
                    onValueChange={(value) => handleProfileChange("dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">يوم/شهر/سنة</SelectItem>
                      <SelectItem value="mm/dd/yyyy">شهر/يوم/سنة</SelectItem>
                      <SelectItem value="yyyy-mm-dd">سنة-شهر-يوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
