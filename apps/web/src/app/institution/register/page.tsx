"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Building2, GraduationCap, Info, Plus, Trash2, FileText } from "lucide-react"

export default function InstitutionRegistrationPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [institutionType, setInstitutionType] = useState<"university" | "company">("university")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // University form state
  const [universityForm, setUniversityForm] = useState({
    nameEn: "",
    nameAr: "",
    licenseNumber: "",
    establishmentYear: "",
    address: "",
    city: "",
    country: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    accreditationBody: "",
    accreditationDate: "",
    documents: [] as { id: string; name: string; type: string }[],
    programs: [] as { id: string; nameEn: string; nameAr: string; degree: string; duration: string }[],
  })

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    nameEn: "",
    nameAr: "",
    commercialRegister: "",
    establishmentYear: "",
    address: "",
    city: "",
    country: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    sector: "",
    size: "",
    documents: [] as { id: string; name: string; type: string }[],
    engineers: [] as { id: string; name: string; position: string; registrationNumber: string }[],
  })

  // New program state
  const [newProgram, setNewProgram] = useState({
    nameEn: "",
    nameAr: "",
    degree: "",
    duration: "",
  })

  // New engineer state
  const [newEngineer, setNewEngineer] = useState({
    name: "",
    position: "",
    registrationNumber: "",
  })

  const handleAddProgram = () => {
    if (!newProgram.nameEn || !newProgram.nameAr || !newProgram.degree || !newProgram.duration) {
      return
    }

    setUniversityForm({
      ...universityForm,
      programs: [
        ...universityForm.programs,
        {
          id: `program-${Date.now()}`,
          ...newProgram,
        },
      ],
    })

    setNewProgram({
      nameEn: "",
      nameAr: "",
      degree: "",
      duration: "",
    })
  }

  const handleRemoveProgram = (id: string) => {
    setUniversityForm({
      ...universityForm,
      programs: universityForm.programs.filter((program) => program.id !== id),
    })
  }

  const handleAddEngineer = () => {
    if (!newEngineer.name || !newEngineer.position || !newEngineer.registrationNumber) {
      return
    }

    setCompanyForm({
      ...companyForm,
      engineers: [
        ...companyForm.engineers,
        {
          id: `engineer-${Date.now()}`,
          ...newEngineer,
        },
      ],
    })

    setNewEngineer({
      name: "",
      position: "",
      registrationNumber: "",
    })
  }

  const handleRemoveEngineer = (id: string) => {
    setCompanyForm({
      ...companyForm,
      engineers: companyForm.engineers.filter((engineer) => engineer.id !== id),
    })
  }

  const handleFileUpload = (type: "university" | "company", file: { name: string; type: string }) => {
    if (type === "university") {
      setUniversityForm({
        ...universityForm,
        documents: [
          ...universityForm.documents,
          {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: file.type,
          },
        ],
      })
    } else {
      setCompanyForm({
        ...companyForm,
        documents: [
          ...companyForm.documents,
          {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: file.type,
          },
        ],
      })
    }
  }

  const handleRemoveDocument = (type: "university" | "company", id: string) => {
    if (type === "university") {
      setUniversityForm({
        ...universityForm,
        documents: universityForm.documents.filter((doc) => doc.id !== id),
      })
    } else {
      setCompanyForm({
        ...companyForm,
        documents: companyForm.documents.filter((doc) => doc.id !== id),
      })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // This would be an API call in a real app
      console.log(
        "Submitting institution registration:",
        institutionType === "university" ? universityForm : companyForm,
      )

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: language === "en" ? "Registration Submitted" : "تم تقديم التسجيل",
        description:
          language === "en"
            ? "Your institution registration has been submitted for review"
            : "تم تقديم تسجيل مؤسستك للمراجعة",
      })

      router.push("/institution/confirmation")
    } catch (error) {
      toast({
        title: language === "en" ? "Registration Failed" : "فشل التسجيل",
        description:
          language === "en" ? "There was an error submitting your registration" : "حدث خطأ أثناء تقديم التسجيل",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">{language === "en" ? "Institution Registration" : "تسجيل المؤسسة"}</h1>
      <p className="text-muted-foreground mb-6">
        {language === "en"
          ? "Register your educational institution or agricultural company"
          : "سجل مؤسستك التعليمية أو شركتك الزراعية"}
      </p>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>{language === "en" ? "Important Information" : "معلومات مهمة"}</AlertTitle>
        <AlertDescription>
          {language === "en"
            ? "All submitted information will be verified. Please ensure all documents are official and up-to-date."
            : "سيتم التحقق من جميع المعلومات المقدمة. يرجى التأكد من أن جميع المستندات رسمية وحديثة."}
        </AlertDescription>
      </Alert>

      <Tabs value={institutionType} onValueChange={(value) => setInstitutionType(value as "university" | "company")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="university" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {language === "en" ? "Educational Institution" : "مؤسسة تعليمية"}
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {language === "en" ? "Agricultural Company" : "شركة زراعية"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="university">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Educational Institution Registration" : "تسجيل مؤسسة تعليمية"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Register your university, college or educational institution"
                  : "سجل جامعتك أو كليتك أو مؤسستك التعليمية"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">
                    {language === "en" ? "Institution Name (English)" : "اسم المؤسسة (بالإنجليزية)"}
                  </Label>
                  <Input
                    id="nameEn"
                    value={universityForm.nameEn}
                    onChange={(e) => setUniversityForm({ ...universityForm, nameEn: e.target.value })}
                    placeholder={language === "en" ? "e.g. Agricultural University" : "مثال: الجامعة الزراعية"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">
                    {language === "en" ? "Institution Name (Arabic)" : "اسم المؤسسة (بالعربية)"}
                  </Label>
                  <Input
                    id="nameAr"
                    value={universityForm.nameAr}
                    onChange={(e) => setUniversityForm({ ...universityForm, nameAr: e.target.value })}
                    placeholder={language === "en" ? "e.g. الجامعة الزراعية" : "مثال: الجامعة الزراعية"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">{language === "en" ? "License Number" : "رقم الترخيص"}</Label>
                  <Input
                    id="licenseNumber"
                    value={universityForm.licenseNumber}
                    onChange={(e) => setUniversityForm({ ...universityForm, licenseNumber: e.target.value })}
                    placeholder={language === "en" ? "e.g. EDU-12345" : "مثال: EDU-12345"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishmentYear">{language === "en" ? "Establishment Year" : "سنة التأسيس"}</Label>
                  <Input
                    id="establishmentYear"
                    value={universityForm.establishmentYear}
                    onChange={(e) => setUniversityForm({ ...universityForm, establishmentYear: e.target.value })}
                    placeholder={language === "en" ? "e.g. 1985" : "مثال: 1985"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{language === "en" ? "Address" : "العنوان"}</Label>
                <Textarea
                  id="address"
                  value={universityForm.address}
                  onChange={(e) => setUniversityForm({ ...universityForm, address: e.target.value })}
                  placeholder={language === "en" ? "Full address" : "العنوان الكامل"}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">{language === "en" ? "City" : "المدينة"}</Label>
                  <Input
                    id="city"
                    value={universityForm.city}
                    onChange={(e) => setUniversityForm({ ...universityForm, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{language === "en" ? "Country" : "الدولة"}</Label>
                  <Select
                    value={universityForm.country}
                    onValueChange={(value) => setUniversityForm({ ...universityForm, country: value })}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder={language === "en" ? "Select country" : "اختر الدولة"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi_arabia">
                        {language === "en" ? "Saudi Arabia" : "المملكة العربية السعودية"}
                      </SelectItem>
                      <SelectItem value="egypt">{language === "en" ? "Egypt" : "مصر"}</SelectItem>
                      <SelectItem value="uae">
                        {language === "en" ? "United Arab Emirates" : "الإمارات العربية المتحدة"}
                      </SelectItem>
                      <SelectItem value="kuwait">{language === "en" ? "Kuwait" : "الكويت"}</SelectItem>
                      <SelectItem value="bahrain">{language === "en" ? "Bahrain" : "البحرين"}</SelectItem>
                      <SelectItem value="qatar">{language === "en" ? "Qatar" : "قطر"}</SelectItem>
                      <SelectItem value="oman">{language === "en" ? "Oman" : "عمان"}</SelectItem>
                      <SelectItem value="jordan">{language === "en" ? "Jordan" : "الأردن"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">{language === "en" ? "Website" : "الموقع الإلكتروني"}</Label>
                  <Input
                    id="website"
                    value={universityForm.website}
                    onChange={(e) => setUniversityForm({ ...universityForm, website: e.target.value })}
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">
                    {language === "en" ? "Contact Email" : "البريد الإلكتروني للتواصل"}
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={universityForm.contactEmail}
                    onChange={(e) => setUniversityForm({ ...universityForm, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{language === "en" ? "Contact Phone" : "رقم الهاتف للتواصل"}</Label>
                  <Input
                    id="contactPhone"
                    value={universityForm.contactPhone}
                    onChange={(e) => setUniversityForm({ ...universityForm, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{language === "en" ? "Institution Description" : "وصف المؤسسة"}</Label>
                <Textarea
                  id="description"
                  value={universityForm.description}
                  onChange={(e) => setUniversityForm({ ...universityForm, description: e.target.value })}
                  placeholder={language === "en" ? "Brief description of your institution" : "وصف موجز لمؤسستك"}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accreditationBody">{language === "en" ? "Accreditation Body" : "جهة الاعتماد"}</Label>
                  <Input
                    id="accreditationBody"
                    value={universityForm.accreditationBody}
                    onChange={(e) => setUniversityForm({ ...universityForm, accreditationBody: e.target.value })}
                    placeholder={language === "en" ? "e.g. Ministry of Education" : "مثال: وزارة التعليم"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accreditationDate">
                    {language === "en" ? "Accreditation Date" : "تاريخ الاعتماد"}
                  </Label>
                  <Input
                    id="accreditationDate"
                    type="date"
                    value={universityForm.accreditationDate}
                    onChange={(e) => setUniversityForm({ ...universityForm, accreditationDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {language === "en" ? "Academic Programs" : "البرامج الأكاديمية"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "en"
                      ? "Add all agricultural engineering programs offered by your institution"
                      : "أضف جميع برامج الهندسة الزراعية التي تقدمها مؤسستك"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Input
                        placeholder={language === "en" ? "Program Name (English)" : "اسم البرنامج (بالإنجليزية)"}
                        value={newProgram.nameEn}
                        onChange={(e) => setNewProgram({ ...newProgram, nameEn: e.target.value })}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder={language === "en" ? "Program Name (Arabic)" : "اسم البرنامج (بالعربية)"}
                        value={newProgram.nameAr}
                        onChange={(e) => setNewProgram({ ...newProgram, nameAr: e.target.value })}
                      />
                    </div>
                    <div>
                      <Select
                        value={newProgram.degree}
                        onValueChange={(value) => setNewProgram({ ...newProgram, degree: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Degree" : "الدرجة العلمية"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelor">
                            {language === "en" ? "Bachelor's Degree" : "بكالوريوس"}
                          </SelectItem>
                          <SelectItem value="master">{language === "en" ? "Master's Degree" : "ماجستير"}</SelectItem>
                          <SelectItem value="phd">{language === "en" ? "PhD" : "دكتوراه"}</SelectItem>
                          <SelectItem value="diploma">{language === "en" ? "Diploma" : "دبلوم"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder={language === "en" ? "Duration (years)" : "المدة (سنوات)"}
                        value={newProgram.duration}
                        onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
                      />
                      <Button
                        type="button"
                        onClick={handleAddProgram}
                        disabled={
                          !newProgram.nameEn || !newProgram.nameAr || !newProgram.degree || !newProgram.duration
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {universityForm.programs.length > 0 ? (
                    <div className="border rounded-md divide-y">
                      {universityForm.programs.map((program) => (
                        <div key={program.id} className="flex items-center justify-between p-3">
                          <div>
                            <p className="font-medium">{language === "en" ? program.nameEn : program.nameAr}</p>
                            <p className="text-sm text-muted-foreground">
                              {language === "en"
                                ? `${
                                    program.degree === "bachelor"
                                      ? "Bachelor's Degree"
                                      : program.degree === "master"
                                        ? "Master's Degree"
                                        : program.degree === "phd"
                                          ? "PhD"
                                          : "Diploma"
                                  } - ${program.duration} years`
                                : `${
                                    program.degree === "bachelor"
                                      ? "بكالوريوس"
                                      : program.degree === "master"
                                        ? "ماجستير"
                                        : program.degree === "phd"
                                          ? "دكتوراه"
                                          : "دبلوم"
                                  } - ${program.duration} سنوات`}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveProgram(program.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">
                        {language === "en" ? "No programs added yet" : "لم تتم إضافة برامج بعد"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {language === "en" ? "Supporting Documents" : "المستندات الداعمة"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "en"
                      ? "Upload accreditation documents, licenses, and other supporting materials"
                      : "قم بتحميل وثائق الاعتماد والتراخيص والمواد الداعمة الأخرى"}
                  </p>

                  <FileUpload
                    onUpload={(file) => handleFileUpload("university", file)}
                    acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                    maxFileSizeMB={10}
                  />

                  {universityForm.documents.length > 0 ? (
                    <div className="mt-4 border rounded-md divide-y">
                      {universityForm.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center mr-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.type}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument("university", doc.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">
                        {language === "en" ? "No documents uploaded yet" : "لم يتم تحميل مستندات بعد"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-green hover:opacity-90">
                {isSubmitting
                  ? language === "en"
                    ? "Submitting..."
                    : "جاري التقديم..."
                  : language === "en"
                    ? "Submit Registration"
                    : "تقديم التسجيل"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Agricultural Company Registration" : "تسجيل شركة زراعية"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Register your agricultural company or organization"
                  : "سجل شركتك أو مؤسستك الزراعية"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyNameEn">
                    {language === "en" ? "Company Name (English)" : "اسم الشركة (بالإنجليزية)"}
                  </Label>
                  <Input
                    id="companyNameEn"
                    value={companyForm.nameEn}
                    onChange={(e) => setCompanyForm({ ...companyForm, nameEn: e.target.value })}
                    placeholder={language === "en" ? "e.g. Green Farms Ltd" : "مثال: شركة المزارع الخضراء"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyNameAr">
                    {language === "en" ? "Company Name (Arabic)" : "اسم الشركة (بالعربية)"}
                  </Label>
                  <Input
                    id="companyNameAr"
                    value={companyForm.nameAr}
                    onChange={(e) => setCompanyForm({ ...companyForm, nameAr: e.target.value })}
                    placeholder={language === "en" ? "e.g. شركة المزارع الخضراء" : "مثال: شركة المزارع الخضراء"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commercialRegister">
                    {language === "en" ? "Commercial Registration Number" : "رقم السجل التجاري"}
                  </Label>
                  <Input
                    id="commercialRegister"
                    value={companyForm.commercialRegister}
                    onChange={(e) => setCompanyForm({ ...companyForm, commercialRegister: e.target.value })}
                    placeholder={language === "en" ? "e.g. CR-12345" : "مثال: CR-12345"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEstablishmentYear">
                    {language === "en" ? "Establishment Year" : "سنة التأسيس"}
                  </Label>
                  <Input
                    id="companyEstablishmentYear"
                    value={companyForm.establishmentYear}
                    onChange={(e) => setCompanyForm({ ...companyForm, establishmentYear: e.target.value })}
                    placeholder={language === "en" ? "e.g. 2005" : "مثال: 2005"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">{language === "en" ? "Address" : "العنوان"}</Label>
                <Textarea
                  id="companyAddress"
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  placeholder={language === "en" ? "Full address" : "العنوان الكامل"}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyCity">{language === "en" ? "City" : "المدينة"}</Label>
                  <Input
                    id="companyCity"
                    value={companyForm.city}
                    onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCountry">{language === "en" ? "Country" : "الدولة"}</Label>
                  <Select
                    value={companyForm.country}
                    onValueChange={(value) => setCompanyForm({ ...companyForm, country: value })}
                  >
                    <SelectTrigger id="companyCountry">
                      <SelectValue placeholder={language === "en" ? "Select country" : "اختر الدولة"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi_arabia">
                        {language === "en" ? "Saudi Arabia" : "المملكة العربية السعودية"}
                      </SelectItem>
                      <SelectItem value="egypt">{language === "en" ? "Egypt" : "مصر"}</SelectItem>
                      <SelectItem value="uae">
                        {language === "en" ? "United Arab Emirates" : "الإمارات العربية المتحدة"}
                      </SelectItem>
                      <SelectItem value="kuwait">{language === "en" ? "Kuwait" : "الكويت"}</SelectItem>
                      <SelectItem value="bahrain">{language === "en" ? "Bahrain" : "البحرين"}</SelectItem>
                      <SelectItem value="qatar">{language === "en" ? "Qatar" : "قطر"}</SelectItem>
                      <SelectItem value="oman">{language === "en" ? "Oman" : "عمان"}</SelectItem>
                      <SelectItem value="jordan">{language === "en" ? "Jordan" : "الأردن"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">{language === "en" ? "Website" : "الموقع الإلكتروني"}</Label>
                  <Input
                    id="companyWebsite"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyContactEmail">
                    {language === "en" ? "Contact Email" : "البريد الإلكتروني للتواصل"}
                  </Label>
                  <Input
                    id="companyContactEmail"
                    type="email"
                    value={companyForm.contactEmail}
                    onChange={(e) => setCompanyForm({ ...companyForm, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyContactPhone">
                    {language === "en" ? "Contact Phone" : "رقم الهاتف للتواصل"}
                  </Label>
                  <Input
                    id="companyContactPhone"
                    value={companyForm.contactPhone}
                    onChange={(e) => setCompanyForm({ ...companyForm, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">{language === "en" ? "Company Description" : "وصف الشركة"}</Label>
                <Textarea
                  id="companyDescription"
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  placeholder={language === "en" ? "Brief description of your company" : "وصف موجز لشركتك"}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sector">{language === "en" ? "Agricultural Sector" : "القطاع الزراعي"}</Label>
                  <Select
                    value={companyForm.sector}
                    onValueChange={(value) => setCompanyForm({ ...companyForm, sector: value })}
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder={language === "en" ? "Select sector" : "اختر القطاع"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop_production">
                        {language === "en" ? "Crop Production" : "إنتاج المحاصيل"}
                      </SelectItem>
                      <SelectItem value="livestock">{language === "en" ? "Livestock" : "الثروة الحيوانية"}</SelectItem>
                      <SelectItem value="irrigation">
                        {language === "en" ? "Irrigation Systems" : "أنظمة الري"}
                      </SelectItem>
                      <SelectItem value="agricultural_machinery">
                        {language === "en" ? "Agricultural Machinery" : "الآلات الزراعية"}
                      </SelectItem>
                      <SelectItem value="food_processing">
                        {language === "en" ? "Food Processing" : "تصنيع الأغذية"}
                      </SelectItem>
                      <SelectItem value="consulting">
                        {language === "en" ? "Agricultural Consulting" : "الاستشارات الزراعية"}
                      </SelectItem>
                      <SelectItem value="research">
                        {language === "en" ? "Agricultural Research" : "البحوث الزراعية"}
                      </SelectItem>
                      <SelectItem value="other">{language === "en" ? "Other" : "أخرى"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">{language === "en" ? "Company Size" : "حجم الشركة"}</Label>
                  <Select
                    value={companyForm.size}
                    onValueChange={(value) => setCompanyForm({ ...companyForm, size: value })}
                  >
                    <SelectTrigger id="size">
                      <SelectValue placeholder={language === "en" ? "Select size" : "اختر الحجم"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">
                        {language === "en" ? "Small (1-50 employees)" : "صغيرة (1-50 موظف)"}
                      </SelectItem>
                      <SelectItem value="medium">
                        {language === "en" ? "Medium (51-250 employees)" : "متوسطة (51-250 موظف)"}
                      </SelectItem>
                      <SelectItem value="large">
                        {language === "en" ? "Large (251+ employees)" : "كبيرة (251+ موظف)"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {language === "en" ? "Registered Engineers" : "المهندسون المسجلون"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "en"
                      ? "Add agricultural engineers employed by your company who are registered in the system"
                      : "أضف المهندسين الزراعيين العاملين في شركتك والمسجلين في النظام"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Input
                        placeholder={language === "en" ? "Engineer Name" : "اسم المهندس"}
                        value={newEngineer.name}
                        onChange={(e) => setNewEngineer({ ...newEngineer, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder={language === "en" ? "Position" : "المنصب"}
                        value={newEngineer.position}
                        onChange={(e) => setNewEngineer({ ...newEngineer, position: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder={language === "en" ? "Registration Number" : "رقم التسجيل"}
                        value={newEngineer.registrationNumber}
                        onChange={(e) => setNewEngineer({ ...newEngineer, registrationNumber: e.target.value })}
                      />
                      <Button
                        type="button"
                        onClick={handleAddEngineer}
                        disabled={!newEngineer.name || !newEngineer.position || !newEngineer.registrationNumber}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {companyForm.engineers.length > 0 ? (
                    <div className="border rounded-md divide-y">
                      {companyForm.engineers.map((engineer) => (
                        <div key={engineer.id} className="flex items-center justify-between p-3">
                          <div>
                            <p className="font-medium">{engineer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {engineer.position} - {language === "en" ? "Reg. No: " : "رقم التسجيل: "}
                              {engineer.registrationNumber}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveEngineer(engineer.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">
                        {language === "en" ? "No engineers added yet" : "لم تتم إضافة مهندسين بعد"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {language === "en" ? "Supporting Documents" : "المستندات الداعمة"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "en"
                      ? "Upload commercial registration, licenses, and other supporting materials"
                      : "قم بتحميل السجل التجاري والتراخيص والمواد الداعمة الأخرى"}
                  </p>

                  <FileUpload
                    onUpload={(file) => handleFileUpload("company", file)}
                    acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                    maxFileSizeMB={10}
                  />

                  {companyForm.documents.length > 0 ? (
                    <div className="mt-4 border rounded-md divide-y">
                      {companyForm.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center mr-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.type}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument("company", doc.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">
                        {language === "en" ? "No documents uploaded yet" : "لم يتم تحميل مستندات بعد"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-green hover:opacity-90">
                {isSubmitting
                  ? language === "en"
                    ? "Submitting..."
                    : "جاري التقديم..."
                  : language === "en"
                    ? "Submit Registration"
                    : "تقديم التسجيل"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
