"use client"

import type React from "react"
import { useLanguage } from "@/components/language-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PersonalInfoFormProps {
  data: {
    fullName: string
    nationalId: string
    birthDate: string
    address: string
    city: string
    country: string
    postalCode: string
    phoneNumber: string
    email: string
  }
  updateData: (data: any) => void
}

export function PersonalInfoForm({ data, updateData }: PersonalInfoFormProps) {
  const { t } = useLanguage()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateData({
      ...data,
      [name]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t("language") === "en" ? "Full Name" : "الاسم الكامل"}</Label>
          <Input
            id="fullName"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder={t("language") === "en" ? "Enter your full name" : "أدخل اسمك الكامل"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalId">{t("language") === "en" ? "National ID" : "رقم الهوية الوطنية"}</Label>
          <Input
            id="nationalId"
            name="nationalId"
            value={data.nationalId}
            onChange={handleChange}
            placeholder={t("language") === "en" ? "Enter your national ID" : "أدخل رقم الهوية الوطنية"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">{t("language") === "en" ? "Date of Birth" : "تاريخ الميلاد"}</Label>
          <Input id="birthDate" name="birthDate" type="date" value={data.birthDate} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">{t("language") === "en" ? "Phone Number" : "رقم الهاتف"}</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={handleChange}
            placeholder={t("language") === "en" ? "Enter your phone number" : "أدخل رقم هاتفك"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("language") === "en" ? "Email" : "البريد الإلكتروني"}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder={t("language") === "en" ? "Enter your email" : "أدخل بريدك الإلكتروني"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t("language") === "en" ? "Address" : "العنوان"}</Label>
        <Textarea
          id="address"
          name="address"
          value={data.address}
          onChange={handleChange}
          placeholder={t("language") === "en" ? "Enter your address" : "أدخل عنوانك"}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">{t("language") === "en" ? "City" : "المدينة"}</Label>
          <Input
            id="city"
            name="city"
            value={data.city}
            onChange={handleChange}
            placeholder={t("language") === "en" ? "Enter your city" : "أدخل مدينتك"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">{t("language") === "en" ? "Country" : "الدولة"}</Label>
          <Select value={data.country} onValueChange={(value) => handleSelectChange("country", value)}>
            <SelectTrigger id="country">
              <SelectValue placeholder={t("language") === "en" ? "Select country" : "اختر الدولة"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saudi_arabia">
                {t("language") === "en" ? "Saudi Arabia" : "المملكة العربية السعودية"}
              </SelectItem>
              <SelectItem value="egypt">{t("language") === "en" ? "Egypt" : "مصر"}</SelectItem>
              <SelectItem value="uae">
                {t("language") === "en" ? "United Arab Emirates" : "الإمارات العربية المتحدة"}
              </SelectItem>
              <SelectItem value="kuwait">{t("language") === "en" ? "Kuwait" : "الكويت"}</SelectItem>
              <SelectItem value="bahrain">{t("language") === "en" ? "Bahrain" : "البحرين"}</SelectItem>
              <SelectItem value="qatar">{t("language") === "en" ? "Qatar" : "قطر"}</SelectItem>
              <SelectItem value="oman">{t("language") === "en" ? "Oman" : "عمان"}</SelectItem>
              <SelectItem value="jordan">{t("language") === "en" ? "Jordan" : "الأردن"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">{t("language") === "en" ? "Postal Code" : "الرمز البريدي"}</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={data.postalCode}
            onChange={handleChange}
            placeholder={t("language") === "en" ? "Enter postal code" : "أدخل الرمز البريدي"}
          />
        </div>
      </div>
    </div>
  )
}
