"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, GraduationCap, Briefcase, User, Award } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

interface ReviewFormProps {
  formData: any
}

export function ReviewForm({ formData }: ReviewFormProps) {
  const { t } = useLanguage()
  const language = t("language")

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(t("language") === "en" ? "en-US" : "ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "id":
        return t("language") === "en" ? "National ID" : "الهوية الوطنية"
      case "degree":
        return t("language") === "en" ? "Degree Certificate" : "شهادة الدرجة العلمية"
      case "experience":
        return t("language") === "en" ? "Experience Certificate" : "شهادة الخبرة"
      case "training":
        return t("language") === "en" ? "Training Certificate" : "شهادة التدريب"
      case "cv":
        return t("language") === "en" ? "CV/Resume" : "السيرة الذاتية"
      case "other":
        return t("language") === "en" ? "Other Document" : "مستند آخر"
      default:
        return type
    }
  }

  const getDegreeLabel = (degree: string) => {
    switch (degree) {
      case "bachelor":
        return t("language") === "en" ? "Bachelor's Degree" : "بكالوريوس"
      case "master":
        return t("language") === "en" ? "Master's Degree" : "ماجستير"
      case "phd":
        return t("language") === "en" ? "PhD" : "دكتوراه"
      case "diploma":
        return t("language") === "en" ? "Diploma" : "دبلوم"
      case "certificate":
        return t("language") === "en" ? "Certificate" : "شهادة"
      default:
        return degree
    }
  }

  const getCountryLabel = (country: string) => {
    switch (country) {
      case "saudi_arabia":
        return t("language") === "en" ? "Saudi Arabia" : "المملكة العربية السعودية"
      case "egypt":
        return t("language") === "en" ? "Egypt" : "مصر"
      case "uae":
        return t("language") === "en" ? "United Arab Emirates" : "الإمارات العربية المتحدة"
      case "kuwait":
        return t("language") === "en" ? "Kuwait" : "الكويت"
      case "bahrain":
        return t("language") === "en" ? "Bahrain" : "البحرين"
      case "qatar":
        return t("language") === "en" ? "Qatar" : "قطر"
      case "oman":
        return t("language") === "en" ? "Oman" : "عمان"
      case "jordan":
        return t("language") === "en" ? "Jordan" : "الأردن"
      default:
        return country
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-400">
          {t("language") === "en" ? "Review Your Application" : "مراجعة طلبك"}
        </AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-500">
          {t("language") === "en"
            ? "Please review all information before submitting your application. You won't be able to edit after submission."
            : "يرجى مراجعة جميع المعلومات قبل تقديم طلبك. لن تتمكن من التعديل بعد التقديم."}
        </AlertDescription>
      </Alert>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>{t("language") === "en" ? "Personal Information" : "المعلومات الشخصية"}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">{t("language") === "en" ? "Full Name" : "الاسم الكامل"}</dt>
              <dd className="font-medium">{formData.personal.fullName}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {t("language") === "en" ? "National ID" : "رقم الهوية الوطنية"}
              </dt>
              <dd className="font-medium">{formData.personal.nationalId}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {t("language") === "en" ? "Date of Birth" : "تاريخ الميلاد"}
              </dt>
              <dd className="font-medium">{formatDate(formData.personal.birthDate)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {t("language") === "en" ? "Email" : "البريد الإلكتروني"}
              </dt>
              <dd className="font-medium">{formData.personal.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {t("language") === "en" ? "Phone Number" : "رقم الهاتف"}
              </dt>
              <dd className="font-medium">{formData.personal.phoneNumber}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">{t("language") === "en" ? "Country" : "الدولة"}</dt>
              <dd className="font-medium">{getCountryLabel(formData.personal.country)}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm text-muted-foreground">{t("language") === "en" ? "Address" : "العنوان"}</dt>
              <dd className="font-medium">
                {formData.personal.address}
                {formData.personal.city && `, ${formData.personal.city}`}
                {formData.personal.postalCode && `, ${formData.personal.postalCode}`}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <CardTitle>{t("language") === "en" ? "Education" : "التعليم"}</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.education.length > 0 ? (
            <div className="space-y-4">
              {formData.education.map((edu: any, index: number) => (
                <div key={edu.id} className="space-y-2">
                  {index > 0 && <Separator />}
                  <h3 className="font-medium">
                    {getDegreeLabel(edu.degree)} {t("language") === "en" ? "in" : "في"} {edu.field}
                  </h3>
                  <p className="text-sm">
                    {edu.institution}, {getCountryLabel(edu.country)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {edu.startYear} - {edu.inProgress ? (t("language") === "en" ? "Present" : "الحالي") : edu.endYear}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {t("language") === "en" ? "No education information provided" : "لم يتم تقديم معلومات تعليمية"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <CardTitle>{t("language") === "en" ? "Work Experience" : "الخبرة العملية"}</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.experience.length > 0 ? (
            <div className="space-y-4">
              {formData.experience.map((exp: any, index: number) => (
                <div key={exp.id} className="space-y-2">
                  {index > 0 && <Separator />}
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-sm">
                    {exp.company}, {exp.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.currentlyWorking ? (t("language") === "en" ? "Present" : "الحالي") : formatDate(exp.endDate)}
                  </p>
                  {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {t("language") === "en" ? "No work experience provided" : "لم يتم تقديم خبرة عملية"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>{t("language") === "en" ? "Supporting Documents" : "المستندات الداعمة"}</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.documents.length > 0 ? (
            <div className="space-y-4">
              {formData.documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">{getDocumentTypeLabel(doc.type)}</p>
                    <p className="text-sm text-muted-foreground">{doc.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {t("language") === "en" ? "No documents uploaded" : "لم يتم رفع أي مستندات"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <CardTitle>{t("language") === "en" ? "Professional Certifications" : "الشهادات المهنية"}</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.certifications && formData.certifications.length > 0 ? (
            <div className="space-y-4">
              {formData.certifications.map((cert: any) => (
                <div key={cert.id} className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">{language === "en" ? cert.nameEn : cert.nameAr}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? cert.descriptionEn : cert.descriptionAr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {t("language") === "en" ? "No certifications applied for" : "لم يتم التقدم للحصول على شهادات مهنية"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
