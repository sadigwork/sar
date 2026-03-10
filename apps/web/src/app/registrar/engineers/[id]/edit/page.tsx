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

export default function EditEngineerPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  // Sample engineer data - in a real app, this would be fetched from an API
  const [engineer, setEngineer] = useState({
    id: params.id,
    name: language === "en" ? "Ahmed Mohamed" : "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+201234567890",
    specialization: "agricultural_engineering",
    level: "expert",
    status: "active",
    registrationNumber: "AE-2023-1234",
    registrationDate: "2023-01-15",
    expiryDate: "2026-01-14",
    nationalId: "1234567890",
    dateOfBirth: "1985-05-15",
    gender: "male",
    nationality: "egyptian",
    address: language === "en" ? "123 Main St, Cairo, Egypt" : "١٢٣ شارع رئيسي، القاهرة، مصر",
    city: "cairo",
    postalCode: "11511",
    country: "egypt",
    education: [
      {
        id: "edu1",
        degree: "bachelor",
        institution: language === "en" ? "Cairo University" : "جامعة القاهرة",
        field: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
        graduationYear: "2007",
        isVerified: true,
      },
      {
        id: "edu2",
        degree: "master",
        institution: language === "en" ? "Alexandria University" : "جامعة الإسكندرية",
        field: language === "en" ? "Irrigation Systems" : "أنظمة الري",
        graduationYear: "2010",
        isVerified: true,
      },
    ],
    experience: [
      {
        id: "exp1",
        title: language === "en" ? "Agricultural Engineer" : "مهندس زراعي",
        company: language === "en" ? "Ministry of Agriculture" : "وزارة الزراعة",
        startDate: "2010-06-01",
        endDate: "2015-12-31",
        isCurrent: false,
        description:
          language === "en" ? "Worked on irrigation systems and soil analysis" : "عملت على أنظمة الري وتحليل التربة",
        isVerified: true,
      },
      {
        id: "exp2",
        title: language === "en" ? "Senior Agricultural Engineer" : "مهندس زراعي أول",
        company: language === "en" ? "Agricultural Development Company" : "شركة التنمية الزراعية",
        startDate: "2016-01-15",
        endDate: null,
        isCurrent: true,
        description:
          language === "en" ? "Leading agricultural projects and research" : "قيادة المشاريع والأبحاث الزراعية",
        isVerified: true,
      },
    ],
    certifications: [
      {
        id: "cert1",
        title: language === "en" ? "Certified Irrigation Designer" : "مصمم ري معتمد",
        issuingBody: language === "en" ? "Irrigation Association" : "جمعية الري",
        issueDate: "2018-03-20",
        expiryDate: "2024-03-19",
        isVerified: true,
      },
    ],
    documents: [
      {
        id: "doc1",
        type: "national_id",
        name: language === "en" ? "National ID Card" : "بطاقة الهوية الوطنية",
        fileUrl: "/documents/national-id.pdf",
        uploadDate: "2023-01-05",
        isVerified: true,
      },
    ],
  })

  // New item templates
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    field: "",
    graduationYear: "",
  })

  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  })

  const [newCertification, setNewCertification] = useState({
    title: "",
    issuingBody: "",
    issueDate: "",
    expiryDate: "",
  })

  // Check if user is logged in and is a registrar
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "registrar") {
        router.push("/dashboard")
      } else {
        // In a real app, fetch the engineer data here
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router, params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEngineer((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEngineer((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewExperience((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCertification((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddEducation = () => {
    if (!newEducation.degree || !newEducation.institution || !newEducation.field || !newEducation.graduationYear) {
      return
    }

    setEngineer((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu${Date.now()}`,
          ...newEducation,
          isVerified: false,
        },
      ],
    }))

    setNewEducation({
      degree: "",
      institution: "",
      field: "",
      graduationYear: "",
    })
  }

  const handleAddExperience = () => {
    if (
      !newExperience.title ||
      !newExperience.company ||
      !newExperience.startDate ||
      (!newExperience.endDate && !newExperience.isCurrent)
    ) {
      return
    }

    setEngineer((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp${Date.now()}`,
          ...newExperience,
          isVerified: false,
        },
      ],
    }))

    setNewExperience({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    })
  }

  const handleAddCertification = () => {
    if (
      !newCertification.title ||
      !newCertification.issuingBody ||
      !newCertification.issueDate ||
      !newCertification.expiryDate
    ) {
      return
    }

    setEngineer((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: `cert${Date.now()}`,
          ...newCertification,
          isVerified: false,
        },
      ],
    }))

    setNewCertification({
      title: "",
      issuingBody: "",
      issueDate: "",
      expiryDate: "",
    })
  }

  const handleRemoveEducation = (id: string) => {
    setEngineer((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const handleRemoveExperience = (id: string) => {
    setEngineer((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const handleRemoveCertification = (id: string) => {
    setEngineer((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }))
  }

  const handleFileUpload = (file: { name: string; type: string }) => {
    setEngineer((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          id: `doc${Date.now()}`,
          type: "other",
          name: file.name,
          fileUrl: `/documents/${file.name}`,
          uploadDate: new Date().toISOString().split("T")[0],
          isVerified: false,
        },
      ],
    }))
  }

  const handleRemoveDocument = (id: string) => {
    setEngineer((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    // In a real app, this would be an API call to update the engineer data
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: language === "en" ? "Changes saved successfully" : "تم حفظ التغييرات بنجاح",
        description: language === "en" ? "The engineer's information has been updated." : "تم تحديث معلومات المهندس.",
      })
      router.push(`/registrar/engineers/${params.id}`)
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
        <Button variant="outline" onClick={() => router.push(`/registrar/engineers/${params.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Engineer Details" : "العودة إلى تفاصيل المهندس"}
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
        <h1 className="text-3xl font-bold mb-2">{language === "en" ? "Edit Engineer" : "تعديل بيانات المهندس"}</h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Update the engineer's information, qualifications, and documents."
            : "تحديث معلومات المهندس ومؤهلاته ووثائقه."}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="personal">{language === "en" ? "Personal Information" : "المعلومات الشخصية"}</TabsTrigger>
          <TabsTrigger value="education">{language === "en" ? "Education" : "التعليم"}</TabsTrigger>
          <TabsTrigger value="experience">{language === "en" ? "Experience" : "الخبرة"}</TabsTrigger>
          <TabsTrigger value="documents">
            {language === "en" ? "Documents & Certifications" : "الوثائق والشهادات"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Personal Information" : "المعلومات الشخصية"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Update the engineer's basic personal information."
                  : "تحديث المعلومات الشخصية الأساسية للمهندس."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{language === "en" ? "Full Name" : "الاسم الكامل"}</Label>
                  <Input id="name" name="name" value={engineer.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{language === "en" ? "Email" : "البريد الإلكتروني"}</Label>
                  <Input id="email" name="email" type="email" value={engineer.email} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">{language === "en" ? "Phone Number" : "رقم الهاتف"}</Label>
                  <Input id="phone" name="phone" value={engineer.phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">{language === "en" ? "National ID" : "رقم الهوية الوطنية"}</Label>
                  <Input id="nationalId" name="nationalId" value={engineer.nationalId} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{language === "en" ? "Date of Birth" : "تاريخ الميلاد"}</Label>
                  <div className="flex">
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={engineer.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">{language === "en" ? "Gender" : "الجنس"}</Label>
                  <Select value={engineer.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select gender" : "اختر الجنس"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{language === "en" ? "Male" : "ذكر"}</SelectItem>
                      <SelectItem value="female">{language === "en" ? "Female" : "أنثى"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">{language === "en" ? "Nationality" : "الجنسية"}</Label>
                  <Select
                    value={engineer.nationality}
                    onValueChange={(value) => handleSelectChange("nationality", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select nationality" : "اختر الجنسية"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi">{language === "en" ? "Saudi" : "سعودي"}</SelectItem>
                      <SelectItem value="egyptian">{language === "en" ? "Egyptian" : "مصري"}</SelectItem>
                      <SelectItem value="jordanian">{language === "en" ? "Jordanian" : "أردني"}</SelectItem>
                      <SelectItem value="other">{language === "en" ? "Other" : "أخرى"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{language === "en" ? "Address" : "العنوان"}</Label>
                <Textarea id="address" name="address" value={engineer.address} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">{language === "en" ? "City" : "المدينة"}</Label>
                  <Input id="city" name="city" value={engineer.city} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">{language === "en" ? "Postal Code" : "الرمز البريدي"}</Label>
                  <Input id="postalCode" name="postalCode" value={engineer.postalCode} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{language === "en" ? "Country" : "البلد"}</Label>
                  <Select value={engineer.country} onValueChange={(value) => handleSelectChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select country" : "اختر البلد"} />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialization">{language === "en" ? "Specialization" : "التخصص"}</Label>
                  <Select
                    value={engineer.specialization}
                    onValueChange={(value) => handleSelectChange("specialization", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select specialization" : "اختر التخصص"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agricultural_engineering">
                        {language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية"}
                      </SelectItem>
                      <SelectItem value="irrigation_engineering">
                        {language === "en" ? "Irrigation Engineering" : "هندسة الري"}
                      </SelectItem>
                      <SelectItem value="soil_science">{language === "en" ? "Soil Science" : "علوم التربة"}</SelectItem>
                      <SelectItem value="plant_production">
                        {language === "en" ? "Plant Production" : "إنتاج النبات"}
                      </SelectItem>
                      <SelectItem value="animal_production">
                        {language === "en" ? "Animal Production" : "إنتاج الحيوان"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">{language === "en" ? "Professional Level" : "المستوى المهني"}</Label>
                  <Select value={engineer.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select level" : "اختر المستوى"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trainee">{language === "en" ? "Trainee" : "متدرب"}</SelectItem>
                      <SelectItem value="junior">{language === "en" ? "Junior" : "مبتدئ"}</SelectItem>
                      <SelectItem value="intermediate">{language === "en" ? "Intermediate" : "متوسط"}</SelectItem>
                      <SelectItem value="senior">{language === "en" ? "Senior" : "متقدم"}</SelectItem>
                      <SelectItem value="expert">{language === "en" ? "Expert" : "خبير"}</SelectItem>
                      <SelectItem value="consultant">{language === "en" ? "Consultant" : "استشاري"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{language === "en" ? "Status" : "الحالة"}</Label>
                  <Select value={engineer.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select status" : "اختر الحالة"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{language === "en" ? "Active" : "نشط"}</SelectItem>
                      <SelectItem value="suspended">{language === "en" ? "Suspended" : "معلق"}</SelectItem>
                      <SelectItem value="expired">{language === "en" ? "Expired" : "منتهي"}</SelectItem>
                      <SelectItem value="revoked">{language === "en" ? "Revoked" : "ملغي"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">
                    {language === "en" ? "Registration Number" : "رقم التسجيل"}
                  </Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    value={engineer.registrationNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationDate">{language === "en" ? "Registration Date" : "تاريخ التسجيل"}</Label>
                  <div className="flex">
                    <Input
                      id="registrationDate"
                      name="registrationDate"
                      type="date"
                      value={engineer.registrationDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">{language === "en" ? "Expiry Date" : "تاريخ الانتهاء"}</Label>
                  <div className="flex">
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={engineer.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Education" : "التعليم"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Manage the engineer's educational qualifications."
                  : "إدارة المؤهلات التعليمية للمهندس."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Add New Education" : "إضافة تعليم جديد"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">{language === "en" ? "Degree" : "الدرجة العلمية"}</Label>
                    <Select
                      value={newEducation.degree}
                      onValueChange={(value) => setNewEducation({ ...newEducation, degree: value })}
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
                    <Label htmlFor="institution">{language === "en" ? "Institution" : "المؤسسة التعليمية"}</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={newEducation.institution}
                      onChange={handleNewEducationChange}
                      placeholder={language === "en" ? "Enter institution name" : "أدخل اسم المؤسسة التعليمية"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="field">{language === "en" ? "Field of Study" : "مجال الدراسة"}</Label>
                    <Input
                      id="field"
                      name="field"
                      value={newEducation.field}
                      onChange={handleNewEducationChange}
                      placeholder={language === "en" ? "Enter field of study" : "أدخل مجال الدراسة"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">{language === "en" ? "Graduation Year" : "سنة التخرج"}</Label>
                    <Input
                      id="graduationYear"
                      name="graduationYear"
                      value={newEducation.graduationYear}
                      onChange={handleNewEducationChange}
                      placeholder={language === "en" ? "Enter graduation year" : "أدخل سنة التخرج"}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddEducation}
                  disabled={
                    !newEducation.degree ||
                    !newEducation.institution ||
                    !newEducation.field ||
                    !newEducation.graduationYear
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Education" : "إضافة تعليم"}
                </Button>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">{language === "en" ? "Education History" : "سجل التعليم"}</h3>
                {engineer.education.length > 0 ? (
                  <div className="space-y-4">
                    {engineer.education.map((edu) => (
                      <div key={edu.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {language === "en"
                                ? edu.degree === "bachelor"
                                  ? "Bachelor's Degree"
                                  : edu.degree === "master"
                                    ? "Master's Degree"
                                    : edu.degree === "phd"
                                      ? "PhD"
                                      : "Diploma"
                                : edu.degree === "bachelor"
                                  ? "بكالوريوس"
                                  : edu.degree === "master"
                                    ? "ماجستير"
                                    : edu.degree === "phd"
                                      ? "دكتوراه"
                                      : "دبلوم"}
                            </h4>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            <p className="text-sm">
                              {edu.field} • {edu.graduationYear}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveEducation(edu.id)}>
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
                        ? "No education records found. Add education using the form above."
                        : "لم يتم العثور على سجلات تعليمية. أضف التعليم باستخدام النموذج أعلاه."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Professional Experience" : "الخبرة المهنية"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Manage the engineer's work experience." : "إدارة الخبرة العملية للمهندس."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Add New Experience" : "إضافة خبرة جديدة"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{language === "en" ? "Job Title" : "المسمى الوظيفي"}</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newExperience.title}
                      onChange={handleNewExperienceChange}
                      placeholder={language === "en" ? "Enter job title" : "أدخل المسمى الوظيفي"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{language === "en" ? "Company/Organization" : "الشركة/المؤسسة"}</Label>
                    <Input
                      id="company"
                      name="company"
                      value={newExperience.company}
                      onChange={handleNewExperienceChange}
                      placeholder={language === "en" ? "Enter company name" : "أدخل اسم الشركة"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">{language === "en" ? "Start Date" : "تاريخ البدء"}</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newExperience.startDate}
                      onChange={handleNewExperienceChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="endDate">{language === "en" ? "End Date" : "تاريخ الانتهاء"}</Label>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          id="isCurrent"
                          checked={newExperience.isCurrent}
                          onChange={(e) =>
                            setNewExperience({
                              ...newExperience,
                              isCurrent: e.target.checked,
                              endDate: e.target.checked ? "" : newExperience.endDate,
                            })
                          }
                          className="mr-2"
                        />
                        <Label htmlFor="isCurrent" className="text-sm font-normal">
                          {language === "en" ? "Current Position" : "الوظيفة الحالية"}
                        </Label>
                      </div>
                    </div>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newExperience.endDate}
                      onChange={handleNewExperienceChange}
                      disabled={newExperience.isCurrent}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{language === "en" ? "Job Description" : "وصف الوظيفة"}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newExperience.description}
                    onChange={handleNewExperienceChange}
                    placeholder={language === "en" ? "Enter job description" : "أدخل وصف الوظيفة"}
                  />
                </div>
                <Button
                  onClick={handleAddExperience}
                  disabled={
                    !newExperience.title ||
                    !newExperience.company ||
                    !newExperience.startDate ||
                    (!newExperience.endDate && !newExperience.isCurrent)
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Experience" : "إضافة خبرة"}
                </Button>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">{language === "en" ? "Experience History" : "سجل الخبرة"}</h3>
                {engineer.experience.length > 0 ? (
                  <div className="space-y-4">
                    {engineer.experience.map((exp) => (
                      <div key={exp.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{exp.title}</h4>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                            <p className="text-sm">
                              {new Date(exp.startDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")} -{" "}
                              {exp.isCurrent
                                ? language === "en"
                                  ? "Present"
                                  : "الحالي"
                                : new Date(exp.endDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}
                            </p>
                            {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveExperience(exp.id)}>
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
                        ? "No experience records found. Add experience using the form above."
                        : "لم يتم العثور على سجلات خبرة. أضف الخبرة باستخدام النموذج أعلاه."}
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
              <CardTitle>{language === "en" ? "Documents & Certifications" : "الوثائق والشهادات"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Manage the engineer's documents and professional certifications."
                  : "إدارة وثائق وشهادات المهندس المهنية."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Upload Document" : "تحميل وثيقة"}</h3>
                <FileUpload onUpload={handleFileUpload} acceptedFileTypes=".pdf,.jpg,.jpeg,.png" maxFileSizeMB={10} />
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">{language === "en" ? "Documents" : "الوثائق"}</h3>
                {engineer.documents.length > 0 ? (
                  <div className="space-y-4">
                    {engineer.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {language === "en"
                              ? doc.type === "national_id"
                                ? "National ID"
                                : doc.type === "passport"
                                  ? "Passport"
                                  : doc.type === "degree"
                                    ? "Degree Certificate"
                                    : "Other Document"
                              : doc.type === "national_id"
                                ? "بطاقة الهوية الوطنية"
                                : doc.type === "passport"
                                  ? "جواز سفر"
                                  : doc.type === "degree"
                                    ? "شهادة الدرجة العلمية"
                                    : "وثيقة أخرى"}
                          </p>
                          <p className="text-xs">
                            {language === "en" ? "Uploaded on: " : "تم التحميل في: "}
                            {new Date(doc.uploadDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}
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

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">
                  {language === "en" ? "Professional Certifications" : "الشهادات المهنية"}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="certTitle">{language === "en" ? "Certification Title" : "عنوان الشهادة"}</Label>
                      <Input
                        id="certTitle"
                        name="title"
                        value={newCertification.title}
                        onChange={handleNewCertificationChange}
                        placeholder={language === "en" ? "Enter certification title" : "أدخل عنوان الشهادة"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuingBody">
                        {language === "en" ? "Issuing Organization" : "الجهة المصدرة"}
                      </Label>
                      <Input
                        id="issuingBody"
                        name="issuingBody"
                        value={newCertification.issuingBody}
                        onChange={handleNewCertificationChange}
                        placeholder={language === "en" ? "Enter issuing organization" : "أدخل الجهة المصدرة"}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">{language === "en" ? "Issue Date" : "تاريخ الإصدار"}</Label>
                      <Input
                        id="issueDate"
                        name="issueDate"
                        type="date"
                        value={newCertification.issueDate}
                        onChange={handleNewCertificationChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">{language === "en" ? "Expiry Date" : "تاريخ الانتهاء"}</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={newCertification.expiryDate}
                        onChange={handleNewCertificationChange}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddCertification}
                    disabled={
                      !newCertification.title ||
                      !newCertification.issuingBody ||
                      !newCertification.issueDate ||
                      !newCertification.expiryDate
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {language === "en" ? "Add Certification" : "إضافة شهادة"}
                  </Button>
                </div>

                {engineer.certifications.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    {engineer.certifications.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{cert.title}</h4>
                            <p className="text-sm text-muted-foreground">{cert.issuingBody}</p>
                            <p className="text-sm">
                              {language === "en" ? "Valid from: " : "صالح من: "}
                              {new Date(cert.issueDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}
                              {language === "en" ? " to " : " إلى "}
                              {new Date(cert.expiryDate).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveCertification(cert.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-lg mt-4">
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No certifications found. Add certifications using the form above."
                        : "لم يتم العثور على شهادات. أضف الشهادات باستخدام النموذج أعلاه."}
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
