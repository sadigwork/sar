"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Award, Briefcase, CheckCircle, ChevronLeft, ChevronRight, FileText, GraduationCap, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoForm } from "@/components/application/personal-info-form"
import { EducationForm } from "@/components/application/education-form"
import { ExperienceForm } from "@/components/application/experience-form"
import { DocumentsForm } from "@/components/application/documents-form"
import { ReviewForm } from "@/components/application/review-form"
import { ProfessionalCertificationsForm } from "@/components/application/professional-certifications-form"

export default function NewApplicationPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      nationalId: "",
      birthDate: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      phoneNumber: "",
      email: "",
    },
    education: [],
    experience: [],
    documents: [],
    certifications: [],
  })

  const steps = [
    {
      id: "personal",
      title: t("language") === "en" ? "Personal Info" : "المعلومات الشخصية",
      description: t("language") === "en" ? "Basic personal information" : "المعلومات الشخصية الأساسية",
      icon: User,
    },
    {
      id: "education",
      title: t("language") === "en" ? "Education" : "التعليم",
      description: t("language") === "en" ? "Educational background" : "الخلفية التعليمية",
      icon: GraduationCap,
    },
    {
      id: "experience",
      title: t("language") === "en" ? "Experience" : "الخبرة",
      description: t("language") === "en" ? "Work experience" : "الخبرة العملية",
      icon: Briefcase,
    },
    {
      id: "documents",
      title: t("language") === "en" ? "Documents" : "المستندات",
      description: t("language") === "en" ? "Supporting documents" : "المستندات الداعمة",
      icon: FileText,
    },
    {
      id: "certifications",
      title: t("language") === "en" ? "Certifications" : "الشهادات المهنية",
      description: t("language") === "en" ? "Professional certifications" : "الشهادات المهنية",
      icon: Award,
    },
    {
      id: "review",
      title: t("language") === "en" ? "Review" : "المراجعة",
      description: t("language") === "en" ? "Review your application" : "مراجعة طلبك",
      icon: CheckCircle,
    },
  ]

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      // Pre-fill email from user data
      setFormData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.name || "",
          email: user.email || "",
        },
      }))
      setIsLoading(false)
    }
  }, [router, user])

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

  const handleSubmit = async () => {
    try {
      // This would be an API call in a real app
      console.log("Submitting application:", formData)

      toast({
        title: t("language") === "en" ? "Application Submitted" : "تم تقديم الطلب",
        description:
          t("language") === "en" ? "Your application has been submitted successfully" : "تم تقديم طلبك بنجاح",
      })

      // Redirect to dashboard or application status page
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: t("language") === "en" ? "Submission Failed" : "فشل التقديم",
        description:
          t("language") === "en" ? "There was an error submitting your application" : "حدث خطأ أثناء تقديم طلبك",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">
        {t("language") === "en" ? "New Certification Application" : "طلب شهادة جديد"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {t("language") === "en"
          ? "Complete all steps to submit your application for professional certification"
          : "أكمل جميع الخطوات لتقديم طلبك للحصول على الشهادة المهنية"}
      </p>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            {t("language") === "en" ? "Step" : "الخطوة"} {currentStep + 1} {t("language") === "en" ? "of" : "من"}{" "}
            {steps.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-secondary" />
      </div>

      <div className="flex mb-6 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${index !== steps.length - 1 ? "mr-2" : ""} ${t("language") === "ar" ? "rtl:ml-2 rtl:mr-0" : ""}`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "bg-gradient-green text-white"
                    : "bg-secondary text-secondary-foreground"
              }`}
            >
              {index < currentStep ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
            </div>
            <span
              className={`ml-2 text-sm ${
                index === currentStep ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("language") === "en" ? step.title : step.title}
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
              updateData={(data) => setFormData({ ...formData, certifications: data })}
            />
          )}
          {currentStep === 5 && <ReviewForm formData={formData} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Previous" : "السابق"}
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="bg-gradient-green hover:opacity-90">
              {t("language") === "en" ? "Next" : "التالي"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-gradient-green hover:opacity-90">
              {t("language") === "en" ? "Submit Application" : "تقديم الطلب"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}