"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react"
import { FileUpload } from "@/components/file-upload"

export default function EditInstitutionPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Sample institution data - in a real app, this would be fetched from an API
  const [institution, setInstitution] = useState({
    id: params.id,
    type: "university", // or "company"
    nameEn: "Agricultural University",
    nameAr: "الجامعة الزراعية",
    licenseNumber: "EDU-12345",
    commercialRegister: "",
    establishmentYear: "1985",
    address: "123 University Blvd, Riyadh",
    city: "Riyadh",
    country: "saudi_arabia",
    website: "https://agri-university.edu",
    contactEmail: "info@agri-university.edu",
    contactPhone: "+966 11 234 5678",
    description:
      "A leading institution in agricultural education and research, offering comprehensive programs in agricultural engineering and related fields.",
    accreditationBody: "Ministry of Education",
    accreditationDate: "2020-05-15",
    sector: "",
    size: "",
    status: "approved", // pending, approved, rejected
    programs: [
      {
        id: "prog-1",
        nameEn: "Agricultural Engineering",
        nameAr: "الهندسة الزراعية",
        degree: "bachelor",
        duration: "4",
      },
      {
        id: "prog-2",
        nameEn: "Water Resources Management",
        nameAr: "إدارة موارد المياه",
        degree: "master",
        duration: "2",
      },
    ],
    faculty: [
      {
        id: "fac-1",
        name: "Dr. Ahmed Mohamed",
        position: "Professor of Agricultural Engineering",
        department: "Agricultural Engineering",
        qualifications: "PhD in Agricultural Engineering",
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "Accreditation Certificate.pdf",
        type: "application/pdf",
        status: "verified",
      },
    ],
  })

  // New item templates
  const [newProgram, setNewProgram] = useState({
    nameEn: "",
    nameAr: "",
    degree: "",
    duration: "",
  })

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    position: "",
    department: "",
    qualifications: "",
  })

  // Check if user is logged in and is a registrar
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "registrar") {
        router.push("/dashboard")
      } else {
        // In a real app, fetch the institution data here
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router, params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInstitution((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setInstitution((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewProgramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProgram((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewFacultyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewFaculty((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddProgram = () => {
    if (!newProgram.nameEn || !newProgram.nameAr || !newProgram.degree || !newProgram.duration) {
      return
    }

    setInstitution((prev) => ({
      ...prev,
      programs: [
        ...prev.programs,
        {
          id: `prog-${Date.now()}`,
          ...newProgram,
        },
      ],
    }))

    setNewProgram({
      nameEn: "",
      nameAr: "",
      degree: "",
      duration: "",
    })
  }

  const handleAddFaculty = () => {
    if (!newFaculty.name || !newFaculty.position || !newFaculty.department || !newFaculty.qualifications) {
      return
    }

    setInstitution((prev) => ({
      ...prev,
      faculty: [
        ...prev.faculty,
        {
          id: `fac-${Date.now()}`,
          ...newFaculty,
        },
      ],
    }))

    setNewFaculty({
      name: "",
      position: "",
      department: "",
      qualifications: "",
    })
  }

  const handleRemoveProgram = (id: string) => {
    setInstitution((prev) => ({
      ...prev,
      programs: prev.programs.filter((program) => program.id !== id),
    }))
  }

  const handleRemoveFaculty = (id: string) => {
    setInstitution((prev) => ({
      ...prev,
      faculty: prev.faculty.filter((faculty) => faculty.id !== id),
    }))
  }

  const handleFileUpload = (file: { name: string; type: string }) => {
    setInstitution((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: file.type,
          status: "pending",
        },
      ],
    }))
  }

  const handleRemoveDocument = (id: string) => {
    setInstitution((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    // In a real app, this would be an API call to update the institution data
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: language === "en" ? "Changes saved successfully" : "تم حفظ التغييرات بنجاح",
        description:
          language === "en" ? "The institution's information has been updated." : "تم تحديث معلومات المؤسسة.",
      })
      router.push(`/registrar/institutions/${params.id}`)
    }, 1000)
  }

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
        <Button variant="outline" onClick={() => router.push(`/registrar/institutions/${params.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Institution Details" : "العودة إلى تفاصيل المؤسسة"}
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-green hover:opacity-90">
          <Save className="mr-2 h-4 w-4" />
          {isSaving
            ? language === "en"
              ? "Saving..."
              : "جاري الحفظ..."
            : language === "en"
              ? "Save Changes"
              : "حفظ التغييرات"}
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{language === "en" ? "Edit Institution" : "تعديل بيانات المؤسسة"}</h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Update the institution's information, programs, and documents."
            : "تحديث معلومات المؤسسة وبرامجها ووثائقها."}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="basic">{language === "en" ? "Basic Information" : "المعلومات الأساسية"}</TabsTrigger>
          <TabsTrigger value="programs">{language === "en" ? "Programs" : "البرامج"}</TabsTrigger>
          <TabsTrigger value="faculty">{language === "en" ? "Faculty" : "أعضاء هيئة التدريس"}</TabsTrigger>
          <TabsTrigger value="documents">{language === "en" ? "Documents" : "الوثائق"}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Basic Information" : "المعلومات الأساسية"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Update the institution's basic information."
                  : "تحديث المعلومات الأساسية للمؤسسة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">
                    {language === "en" ? "Institution Name (English)" : "اسم المؤسسة (بالإنجليزية)"}
                  </Label>
                  <Input id="nameEn" name="nameEn" value={institution.nameEn} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">
                    {language === "en" ? "Institution Name (Arabic)" : "اسم المؤسسة (بالعربية)"}
                  </Label>
                  <Input id="nameAr" name="nameAr" value={institution.nameAr} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">{language === "en" ? "Institution Type" : "نوع المؤسسة"}</Label>
                  <Select value={institution.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select type" : "اختر النوع"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">
                        {language === "en" ? "Educational Institution" : "مؤسسة تعليمية"}
                      </SelectItem>
                      <SelectItem value="company">
                        {language === "en" ? "Agricultural Company" : "شركة زراعية"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishmentYear">{language === "en" ? "Establishment Year" : "سنة التأسيس"}</Label>
                  <Input
                    id="establishmentYear"
                    name="establishmentYear"
                    value={institution.establishmentYear}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {institution.type === "university" ? (
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">{language === "en" ? "License Number" : "رقم الترخيص"}</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={institution.licenseNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="commercialRegister">
                      {language === "en" ? "Commercial Registration Number" : "رقم السجل التجاري"}
                    </Label>
                    <Input
                      id="commercialRegister"
                      name="commercialRegister"
                      value={institution.commercialRegister}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="status">{language === "en" ? "Status" : "الحالة"}</Label>
                  <Select value={institution.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select status" : "اختر الحالة"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{language === "en" ? "Pending" : "قيد الانتظار"}</SelectItem>
                      <SelectItem value="approved">{language === "en" ? "Approved" : "معتمدة"}</SelectItem>
                      <SelectItem value="rejected">{language === "en" ? "Rejected" : "مرفوضة"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{language === "en" ? "Address" : "العنوان"}</Label>
                <Textarea id="address" name="address" value={institution.address} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">{language === "en" ? "City" : "المدينة"}</Label>
                  <Input id="city" name="city" value={institution.city} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{language === "en" ? "Country" : "الدولة"}</Label>
                  <Select value={institution.country} onValueChange={(value) => handleSelectChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select country" : "اختر الدولة"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi_arabia">
                        {language === "en" ? "Saudi Arabia" : "المملكة العربية السعودية"}
                      </SelectItem>
                      <SelectItem value="egypt">{language === "en" ? "Egypt" : "مصر"}</SelectItem>
                      <SelectItem value="jordan">{language === "en" ? "Jordan" : "الأردن"}</SelectItem>
                      <SelectItem value="other">{language === "en" ? "Other" : "أخرى"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">{language === "en" ? "Website" : "الموقع الإلكتروني"}</Label>
                  <Input id="website" name="website" value={institution.website} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">
                    {language === "en" ? "Contact Email" : "البريد الإلكتروني للتواصل"}
                  </Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={institution.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{language === "en" ? "Contact Phone" : "رقم الهاتف للتواصل"}</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={institution.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{language === "en" ? "Description" : "الوصف"}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={institution.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              {institution.type === "university" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accreditationBody">
                      {language === "en" ? "Accreditation Body" : "جهة الاعتماد"}
                    </Label>
                    <Input
                      id="accreditationBody"
                      name="accreditationBody"
                      value={institution.accreditationBody}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accreditationDate">
                      {language === "en" ? "Accreditation Date" : "تاريخ الاعتماد"}
                    </Label>
                    <Input
                      id="accreditationDate"
                      name="accreditationDate"
                      type="date"
                      value={institution.accreditationDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {institution.type === "company" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sector">{language === "en" ? "Agricultural Sector" : "القطاع الزراعي"}</Label>
                    <Select value={institution.sector} onValueChange={(value) => handleSelectChange("sector", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Select sector" : "اختر القطاع"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crop_production">
                          {language === "en" ? "Crop Production" : "إنتاج المحاصيل"}
                        </SelectItem>
                        <SelectItem value="livestock">
                          {language === "en" ? "Livestock" : "الثروة الحيوانية"}
                        </SelectItem>
                        <SelectItem value="irrigation">
                          {language === "en" ? "Irrigation Systems" : "أنظمة الري"}
                        </SelectItem>
                        <SelectItem value="other">{language === "en" ? "Other" : "أخرى"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">{language === "en" ? "Company Size" : "حجم الشركة"}</Label>
                    <Select value={institution.size} onValueChange={(value) => handleSelectChange("size", value)}>
                      <SelectTrigger>
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Academic Programs" : "البرامج الأكاديمية"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Manage the institution's academic programs."
                  : "إدارة البرامج الأكاديمية للمؤسسة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Add New Program" : "إضافة برنامج جديد"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="programNameEn">
                      {language === "en" ? "Program Name (English)" : "اسم البرنامج (بالإنجليزية)"}
                    </Label>
                    <Input
                      id="programNameEn"
                      name="nameEn"
                      value={newProgram.nameEn}
                      onChange={handleNewProgramChange}
                      placeholder={language === "en" ? "Enter program name" : "أدخل اسم البرنامج"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="programNameAr">
                      {language === "en" ? "Program Name (Arabic)" : "اسم البرنامج (بالعربية)"}
                    </Label>
                    <Input
                      id="programNameAr"
                      name="nameAr"
                      value={newProgram.nameAr}
                      onChange={handleNewProgramChange}
                      placeholder={language === "en" ? "Enter program name" : "أدخل اسم البرنامج"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">{language === "en" ? "Degree" : "الدرجة العلمية"}</Label>
                    <Select
                      value={newProgram.degree}
                      onValueChange={(value) => setNewProgram({ ...newProgram, degree: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Select degree" : "اختر الدرجة العلمية"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diploma">{language === "en" ? "Diploma" : "دبلوم"}</SelectItem>
                        <SelectItem value="bachelor">
                          {language === "en" ? "Bachelor's Degree" : "بكالوريوس"}
                        </SelectItem>
                        <SelectItem value="master">{language === "en" ? "Master's Degree" : "ماجستير"}</SelectItem>
                        <SelectItem value="phd">{language === "en" ? "PhD" : "دكتوراه"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">{language === "en" ? "Duration (years)" : "المدة (سنوات)"}</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={newProgram.duration}
                      onChange={handleNewProgramChange}
                      placeholder={language === "en" ? "Enter duration" : "أدخل المدة"}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddProgram}
                  disabled={!newProgram.nameEn || !newProgram.nameAr || !newProgram.degree || !newProgram.duration}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Program" : "إضافة برنامج"}
                </Button>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">{language === "en" ? "Programs List" : "قائمة البرامج"}</h3>
                {institution.programs.length > 0 ? (
                  <div className="space-y-4">
                    {institution.programs.map((program) => (
                      <div key={program.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{language === "en" ? program.nameEn : program.nameAr}</h4>
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No programs found. Add programs using the form above."
                        : "لم يتم العثور على برامج. أضف البرامج باستخدام النموذج أعلاه."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Faculty Members" : "أعضاء هيئة التدريس"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Manage the institution's faculty members." : "إدارة أعضاء هيئة التدريس للمؤسسة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "en" ? "Add New Faculty Member" : "إضافة عضو هيئة تدريس جديد"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facultyName">{language === "en" ? "Name" : "الاسم"}</Label>
                    <Input
                      id="facultyName"
                      name="name"
                      value={newFaculty.name}
                      onChange={handleNewFacultyChange}
                      placeholder={language === "en" ? "Enter name" : "أدخل الاسم"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">{language === "en" ? "Position" : "المنصب"}</Label>
                    <Input
                      id="position"
                      name="position"
                      value={newFaculty.position}
                      onChange={handleNewFacultyChange}
                      placeholder={language === "en" ? "Enter position" : "أدخل المنصب"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">{language === "en" ? "Department" : "القسم"}</Label>
                    <Input
                      id="department"
                      name="department"
                      value={newFaculty.department}
                      onChange={handleNewFacultyChange}
                      placeholder={language === "en" ? "Enter department" : "أدخل القسم"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualifications">{language === "en" ? "Qualifications" : "المؤهلات"}</Label>
                    <Input
                      id="qualifications"
                      name="qualifications"
                      value={newFaculty.qualifications}
                      onChange={handleNewFacultyChange}
                      placeholder={language === "en" ? "Enter qualifications" : "أدخل المؤهلات"}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddFaculty}
                  disabled={
                    !newFaculty.name || !newFaculty.position || !newFaculty.department || !newFaculty.qualifications
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Faculty Member" : "إضافة عضو هيئة تدريس"}
                </Button>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">
                  {language === "en" ? "Faculty Members List" : "قائمة أعضاء هيئة التدريس"}
                </h3>
                {institution.faculty.length > 0 ? (
                  <div className="space-y-4">
                    {institution.faculty.map((faculty) => (
                      <div key={faculty.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{faculty.name}</h4>
                            <p className="text-sm text-muted-foreground">{faculty.position}</p>
                            <p className="text-sm">{faculty.department}</p>
                            <p className="text-sm text-muted-foreground">{faculty.qualifications}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveFaculty(faculty.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No faculty members found. Add faculty members using the form above."
                        : "لم يتم العثور على أعضاء هيئة تدريس. أضف أعضاء هيئة التدريس باستخدام النموذج أعلاه."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Documents" : "الوثائق"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Manage the institution's documents." : "إدارة وثائق المؤسسة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Upload Document" : "تحميل وثيقة"}</h3>
                <FileUpload onUpload={handleFileUpload} acceptedFileTypes=".pdf,.jpg,.jpeg,.png" maxFileSizeMB={10} />
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">{language === "en" ? "Documents List" : "قائمة الوثائق"}</h3>
                {institution.documents.length > 0 ? (
                  <div className="space-y-4">
                    {institution.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {language === "en"
                              ? `Status: ${doc.status === "verified" ? "Verified" : doc.status === "pending" ? "Pending Verification" : "Rejected"}`
                              : `الحالة: ${doc.status === "verified" ? "تم التحقق" : doc.status === "pending" ? "في انتظار التحقق" : "مرفوض"}`}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(doc.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No documents found. Upload documents using the form above."
                        : "لم يتم العثور على وثائق. قم بتحميل الوثائق باستخدام النموذج أعلاه."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-green hover:opacity-90">
          <Save className="mr-2 h-4 w-4" />
          {isSaving
            ? language === "en"
              ? "Saving..."
              : "جاري الحفظ..."
            : language === "en"
              ? "Save Changes"
              : "حفظ التغييرات"}
        </Button>
      </div>
    </div>
  )
}
