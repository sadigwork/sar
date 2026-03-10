"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Award, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for available certifications
const availableCertifications = [
  {
    id: "cert1",
    nameEn: "Agricultural Engineering Professional",
    nameAr: "مهندس زراعي محترف",
    descriptionEn: "Professional certification for agricultural engineers with 3+ years of experience",
    descriptionAr: "شهادة مهنية للمهندسين الزراعيين ذوي خبرة 3+ سنوات",
    requirements: [
      { id: "req1", nameEn: "Bachelor's degree in Agricultural Engineering", nameAr: "بكالوريوس في الهندسة الزراعية" },
      { id: "req2", nameEn: "3+ years of professional experience", nameAr: "خبرة مهنية 3+ سنوات" },
      { id: "req3", nameEn: "Passing the certification exam", nameAr: "اجتياز امتحان الشهادة" },
    ],
  },
  {
    id: "cert2",
    nameEn: "Senior Agricultural Engineer",
    nameAr: "مهندس زراعي أول",
    descriptionEn: "Advanced certification for agricultural engineers with 7+ years of experience",
    descriptionAr: "شهادة متقدمة للمهندسين الزراعيين ذوي خبرة 7+ سنوات",
    requirements: [
      { id: "req4", nameEn: "Master's degree in Agricultural Engineering", nameAr: "ماجستير في الهندسة الزراعية" },
      { id: "req5", nameEn: "7+ years of professional experience", nameAr: "خبرة مهنية 7+ سنوات" },
      {
        id: "req6",
        nameEn: "Previous certification as Agricultural Engineering Professional",
        nameAr: "شهادة سابقة كمهندس زراعي محترف",
      },
      { id: "req7", nameEn: "Passing the advanced certification exam", nameAr: "اجتياز امتحان الشهادة المتقدم" },
    ],
  },
  {
    id: "cert3",
    nameEn: "Agricultural Water Management Specialist",
    nameAr: "أخصائي إدارة المياه الزراعية",
    descriptionEn: "Specialized certification for agricultural engineers focused on water management",
    descriptionAr: "شهادة متخصصة للمهندسين الزراعيين المتخصصين في إدارة المياه",
    requirements: [
      {
        id: "req8",
        nameEn: "Bachelor's degree in Agricultural or Water Engineering",
        nameAr: "بكالوريوس في الهندسة الزراعية أو هندسة المياه",
      },
      {
        id: "req9",
        nameEn: "5+ years of experience in water management projects",
        nameAr: "خبرة 5+ سنوات في مشاريع إدارة المياه",
      },
      {
        id: "req10",
        nameEn: "Completion of specialized water management training",
        nameAr: "إكمال تدريب متخصص في إدارة المياه",
      },
    ],
  },
]

interface ProfessionalCertificationsFormProps {
  data: any[]
  updateData: (data: any[]) => void
}

export function ProfessionalCertificationsForm({ data, updateData }: ProfessionalCertificationsFormProps) {
  const { t, language } = useLanguage()
  const [selectedCertification, setSelectedCertification] = useState<string>("")
  const [agreedToRequirements, setAgreedToRequirements] = useState<boolean>(false)

  const handleAddCertification = () => {
    if (!selectedCertification || !agreedToRequirements) return

    const certToAdd = availableCertifications.find((cert) => cert.id === selectedCertification)
    if (!certToAdd) return

    // Check if certification is already added
    if (data.some((cert) => cert.id === selectedCertification)) return

    const newCertification = {
      id: certToAdd.id,
      nameEn: certToAdd.nameEn,
      nameAr: certToAdd.nameAr,
      descriptionEn: certToAdd.descriptionEn,
      descriptionAr: certToAdd.descriptionAr,
      requirements: certToAdd.requirements,
      status: "pending",
      appliedDate: new Date().toISOString(),
    }

    updateData([...data, newCertification])
    setSelectedCertification("")
    setAgreedToRequirements(false)
  }

  const handleRemoveCertification = (certId: string) => {
    const updatedData = data.filter((cert) => cert.id !== certId)
    updateData(updatedData)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return language === "en" ? "Pending" : "قيد الانتظار"
      case "approved":
        return language === "en" ? "Approved" : "تمت الموافقة"
      case "rejected":
        return language === "en" ? "Rejected" : "مرفوض"
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {data.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{language === "en" ? "Applied Certifications" : "الشهادات المطلوبة"}</h3>
          <div className="space-y-4">
            {data.map((cert) => (
              <Card key={cert.id} className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <Award className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium">{language === "en" ? cert.nameEn : cert.nameAr}</h4>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? cert.descriptionEn : cert.descriptionAr}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(cert.status)}`}>
                            {getStatusLabel(cert.status)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2 rtl:mr-2">
                            {language === "en" ? "Applied on: " : "تم التقديم في: "}
                            {new Date(cert.appliedDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCertification(cert.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      {language === "en" ? "Remove" : "إزالة"}
                    </Button>
                  </div>
                  <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="requirements">
                      <AccordionTrigger className="text-sm">
                        {language === "en" ? "View Requirements" : "عرض المتطلبات"}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 list-disc list-inside text-sm">
                          {cert.requirements.map((req: any) => (
                            <li key={req.id}>{language === "en" ? req.nameEn : req.nameAr}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <Award className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            {language === "en"
              ? "No professional certifications applied for yet"
              : "لم يتم التقدم للحصول على شهادات مهنية بعد"}
          </p>
        </div>
      )}

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{language === "en" ? "Apply for Certification" : "التقدم للحصول على شهادة"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certification">{language === "en" ? "Select Certification" : "اختر الشهادة"}</Label>
            <Select value={selectedCertification} onValueChange={setSelectedCertification}>
              <SelectTrigger id="certification">
                <SelectValue
                  placeholder={language === "en" ? "Select a professional certification" : "اختر شهادة مهنية"}
                />
              </SelectTrigger>
              <SelectContent>
                {availableCertifications.map((cert) => (
                  <SelectItem key={cert.id} value={cert.id}>
                    {language === "en" ? cert.nameEn : cert.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCertification && (
            <>
              <div className="space-y-2 p-4 bg-muted/50 rounded-md">
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">
                      {language === "en" ? "Certification Requirements" : "متطلبات الشهادة"}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {language === "en"
                        ? "Please ensure you meet all the following requirements:"
                        : "يرجى التأكد من استيفاء جميع المتطلبات التالية:"}
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-sm">
                      {availableCertifications
                        .find((cert) => cert.id === selectedCertification)
                        ?.requirements.map((req) => (
                          <li key={req.id}>{language === "en" ? req.nameEn : req.nameAr}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="agree"
                  checked={agreedToRequirements}
                  onCheckedChange={(checked) => setAgreedToRequirements(!!checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="agree" className="text-sm font-normal leading-snug">
                    {language === "en"
                      ? "I confirm that I meet all the requirements for this certification"
                      : "أؤكد أنني أستوفي جميع متطلبات هذه الشهادة"}
                  </Label>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={handleAddCertification}
                      disabled={!selectedCertification || !agreedToRequirements}
                      className="bg-gradient-green hover:opacity-90"
                    >
                      <Award className="mr-2 h-4 w-4" />
                      {language === "en" ? "Apply for Certification" : "التقدم للحصول على الشهادة"}
                    </Button>
                  </div>
                </TooltipTrigger>
                {(!selectedCertification || !agreedToRequirements) && (
                  <TooltipContent>
                    {!selectedCertification
                      ? language === "en"
                        ? "Please select a certification"
                        : "يرجى اختيار شهادة"
                      : language === "en"
                        ? "Please confirm that you meet the requirements"
                        : "يرجى تأكيد استيفاء المتطلبات"}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
