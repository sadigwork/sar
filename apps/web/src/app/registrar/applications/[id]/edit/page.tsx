"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Award,
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  User,
  Save,
  AlertTriangle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoForm } from "@/components/application/personal-info-form"
import { EducationForm } from "@/components/application/education-form"
import { ExperienceForm } from "@/components/application/experience-form"
import { DocumentsForm } from "@/components/application/documents-form"
import { ReviewForm } from "@/components/application/review-form"
import { ProfessionalCertificationsForm } from "@/components/application/professional-certifications-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock data for existing application
const mockApplicationData = {
  id: "app123",
  applicantName: "أحمد محمد علي",
  applicantEmail: "ahmed@example.com",
  status: "pending",
  submissionDate: "2023-11-15",
  personal: {
    fullName: "أحمد محمد علي",
    nationalId: "1234567890",
    birthDate: "1985-05-15",
    address: "شارع الملك فهد، الرياض",
    city: "الرياض",
    country: "saudi_arabia",
    postalCode: "12345",
    phoneNumber: "+966501234567",
    email: "ahmed@example.com",
  },
  education: [
    {
      id: "edu1",
      degree: "bachelor",
      field: "الهندسة الزراعية",
      institution: "جامعة الملك سعود",
      country: "saudi_arabia",
      startYear: "2003",
      endYear: "2007",
      inProgress: false,
    },
  ],
  experience: [
    {
      id: "exp1",
      position: "مهندس زراعي",
      company: "وزارة البيئة والمياه والزراعة",
      location: "الرياض، السعودية",
      startDate: "2007-06",
      endDate: "2015-12",
      currentlyWorking: false,
      description: "العمل على مشاريع الري والتنمية الزراعية",
    },
  ],
  documents: [
    {
      id: "doc1",
      type: "degree",
      name: "شهادة البكالوريوس.pdf",
      file: null,
      uploadDate: "2023-11-15T10:30:00Z",
    },
  ],
  certifications: [],
}

export default function RegistrarEditApplicationPage({ params }) {
  const { id } = params
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(mockApplicationData)
  const [originalData, setOriginalData] = useState(mockApplicationData)
  const [editReason, setEditReason] = useState("")

  const steps = [
    {
      id: "personal",
      title: language === "en" ? "Personal Info" : "المعلومات الشخصية",
      description: language === "en" ? "Basic personal information" : "المعلومات الشخصية الأساسية",
      icon: User,
    },
    {
      id: "education",
      title: language === "en" ? "Education" : "التعليم",
      description: language === "en" ? "Educational background" : "الخلفية التعليمية",
      icon: GraduationCap,
    },
    {
      id: "experience",
      title: language === "en" ? "Experience" : "الخبرة",
      description: language === "en" ? "Work experience" : "الخبرة العملية",
      icon: Briefcase,
    },
    {
      id: "documents",
      title: language === "en" ? "Documents" : "المستندات",
      description: language === "en" ? "Supporting documents" : "المستندات الداعمة",
      icon: FileText,
    },
    {
      id: "certifications",
      title: language === "en" ? "Certifications" : "الشهادات المهنية",
      description: language === "en" ? "Professional certifications" : "الشهادات المهنية",
      icon: Award,
    },
    {
      id: "review",
      title: language === "en" ? "Review" : "المراجعة",
      description: language === "en" ? "Review your changes" : "مراجعة التغييرات",
      icon: CheckCircle,
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
        // In a real app, fetch application from API
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router, id])

  const updateFormData = (step: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    if (!editReason.trim()) {
      toast({
        title: language === "en" ? "Edit Reason Required" : "سبب التعديل مطلوب",
        description:
          language === "en"
            ? "Please provide a reason for editing this application"
            : "يرجى تقديم سبب لتعديل هذا الطلب",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // This would be an API call in a real app
      console.log("Saving application changes:", {
        applicationId: id,
        changes: formData,
        editReason,
        editedBy: user?.id,
      })

      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      toast({
        title: language === "en" ? "Application Updated" : "تم تحديث الطلب",
        description: language === "en" ? "The application has been updated successfully" : "تم تحديث الطلب بنجاح",
      })

      // Redirect to application details page
      router.push(`/registrar/applications/${id}`)
    } catch (error) {
      toast({
        title: language === "en" ? "Update Failed" : "فشل التحديث",
        description: language === "en" ? "There was an error updating the application" : "حدث خطأ أثناء تحديث الطلب",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/registrar/applications/${id}`)} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Application" : "العودة إلى الطلب"}
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{language === "en" ? "Edit Application" : "تعديل الطلب"}</h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? `Editing application for ${formData.applicantName}`
              : `تعديل طلب ${formData.applicantName}`}
          </p>
        </div>
      </div>

      <Alert className="mb-6 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/30">
        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <AlertTitle className="text-orange-800 dark:text-orange-300">
          {language === "en" ? "Registrar Edit Mode" : "وضع تعديل المسجل"}
        </AlertTitle>
        <AlertDescription className="text-orange-700 dark:text-orange-400">
          {language === "en"
            ? "You are editing this application as a registrar. All changes will be logged and the applicant will be notified."
            : "أنت تقوم بتعديل هذا الطلب كمسجل. سيتم تسجيل جميع التغييرات وإشعار مقدم الطلب."}
        </AlertDescription>
      </Alert>

      {hasChanges() && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30">
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            {language === "en"
              ? "You have unsaved changes. Make sure to save your progress."
              : "لديك تغييرات غير محفوظة. تأكد من حفظ تقدمك."}
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            {language === "en" ? "Step" : "الخطوة"} {currentStep + 1} {language === "en" ? "of" : "من"} {steps.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-secondary" />
      </div>

      <div className="flex mb-6 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${index !== steps.length - 1 ? "mr-2" : ""} ${language === "ar" ? "rtl:ml-2 rtl:mr-0" : ""}`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer ${
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "bg-gradient-green text-white"
                    : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {index < currentStep ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
            </div>
            <span
              className={`ml-2 text-sm cursor-pointer ${
                index === currentStep ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {step.title}
            </span>
            {index !== steps.length - 1 && <div className="w-8 h-px bg-border mx-2"></div>}
          </div>
        ))}
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <PersonalInfoForm data={formData.personal} updateData={(data) => updateFormData("personal", data)} />
          )}
          {currentStep === 1 && (
            <EducationForm data={formData.education} updateData={(data) => updateFormData("education", data)} />
          )}
          {currentStep === 2 && (
            <ExperienceForm data={formData.experience} updateData={(data) => updateFormData("experience", data)} />
          )}
          {currentStep === 3 && (
            <DocumentsForm data={formData.documents} updateData={(data) => updateFormData("documents", data)} />
          )}
          {currentStep === 4 && (
            <ProfessionalCertificationsForm
              data={formData.certifications}
              updateData={(data) => updateFormData("certifications", data)}
            />
          )}
          {currentStep === 5 && (
            <div className="space-y-6">
              <ReviewForm formData={formData} />

              {hasChanges() && (
                <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/30">
                  <CardHeader>
                    <CardTitle className="text-orange-800 dark:text-orange-300">
                      {language === "en" ? "Edit Reason" : "سبب التعديل"}
                    </CardTitle>
                    <CardDescription className="text-orange-700 dark:text-orange-400">
                      {language === "en"
                        ? "Please provide a reason for editing this application. This will be recorded in the audit log."
                        : "يرجى تقديم سبب لتعديل هذا الطلب. سيتم تسجيل هذا في سجل التدقيق."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="editReason">{language === "en" ? "Reason for Edit" : "سبب التعديل"}</Label>
                      <Textarea
                        id="editReason"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        placeholder={
                          language === "en"
                            ? "Enter the reason for editing this application..."
                            : "أدخل سبب تعديل هذا الطلب..."
                        }
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {language === "en" ? "Previous" : "السابق"}
          </Button>
          <div className="flex gap-2">
            {hasChanges() && currentStep !== steps.length - 1 && (
              <Button onClick={handleSave} disabled={isSaving || !editReason.trim()} variant="outline">
                <Save className="mr-2 h-4 w-4" />
                {isSaving
                  ? language === "en"
                    ? "Saving..."
                    : "جاري الحفظ..."
                  : language === "en"
                    ? "Save Changes"
                    : "حفظ التغييرات"}
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="bg-gradient-green hover:opacity-90">
                {language === "en" ? "Next" : "التالي"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isSaving || (hasChanges() && !editReason.trim())}
                className="bg-gradient-green hover:opacity-90"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving
                  ? language === "en"
                    ? "Saving..."
                    : "جاري الحفظ..."
                  : language === "en"
                    ? "Save Application"
                    : "حفظ الطلب"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
