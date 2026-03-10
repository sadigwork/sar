"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  PenLine,
  BarChart3,
  ShieldCheck,
  Award,
  FileText,
  Download,
} from "lucide-react"

// Mock institution data
const mockInstitutionData = {
  id: "inst-1",
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
  complianceScore: 92,
  certificationRate: 85,
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
    {
      id: "prog-3",
      nameEn: "Sustainable Agriculture",
      nameAr: "الزراعة المستدامة",
      degree: "phd",
      duration: "3",
    },
  ],
  engineers: [],
  faculty: [
    {
      id: "fac-1",
      name: "Dr. Ahmed Mohamed",
      position: "Professor of Agricultural Engineering",
      department: "Agricultural Engineering",
      qualifications: "PhD in Agricultural Engineering",
    },
    {
      id: "fac-2",
      name: "Dr. Sara Ali",
      position: "Associate Professor",
      department: "Water Resources",
      qualifications: "PhD in Water Resources Engineering",
    },
    {
      id: "fac-3",
      name: "Dr. Khaled Ibrahim",
      position: "Assistant Professor",
      department: "Sustainable Agriculture",
      qualifications: "PhD in Agricultural Sciences",
    },
  ],
  documents: [
    {
      id: "doc-1",
      name: "Accreditation Certificate.pdf",
      type: "application/pdf",
      status: "verified",
    },
    {
      id: "doc-2",
      name: "License Document.pdf",
      type: "application/pdf",
      status: "verified",
    },
    {
      id: "doc-3",
      name: "Faculty Credentials.pdf",
      type: "application/pdf",
      status: "pending",
    },
  ],
  complianceHistory: [
    {
      id: "comp-1",
      date: "2023-01-15",
      score: 88,
      notes: "Annual review completed",
    },
    {
      id: "comp-2",
      date: "2023-04-20",
      score: 90,
      notes: "Updated faculty credentials",
    },
    {
      id: "comp-3",
      date: "2023-07-10",
      score: 92,
      notes: "Program accreditation renewed",
    },
  ],
}

export default function InstitutionDashboardPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [institution, setInstitution] = useState(mockInstitutionData)
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [editedInstitution, setEditedInstitution] = useState(mockInstitutionData)

  // New program/faculty/engineer state
  const [newItem, setNewItem] = useState({
    nameEn: "",
    nameAr: "",
    degree: "",
    duration: "",
    name: "",
    position: "",
    department: "",
    qualifications: "",
    registrationNumber: "",
  })

  useEffect(() => {
    // Simulate loading institution data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setInstitution(editedInstitution)
      toast({
        title: language === "en" ? "Changes Saved" : "تم حفظ التغييرات",
        description: language === "en" ? "Your institution information has been updated" : "تم تحديث معلومات مؤسستك",
      })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedInstitution((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddProgram = () => {
    if (!newItem.nameEn || !newItem.nameAr || !newItem.degree || !newItem.duration) {
      return
    }

    setEditedInstitution({
      ...editedInstitution,
      programs: [
        ...editedInstitution.programs,
        {
          id: `prog-${Date.now()}`,
          nameEn: newItem.nameEn,
          nameAr: newItem.nameAr,
          degree: newItem.degree,
          duration: newItem.duration,
        },
      ],
    })

    setNewItem({
      ...newItem,
      nameEn: "",
      nameAr: "",
      degree: "",
      duration: "",
    })
  }

  const handleRemoveProgram = (id: string) => {
    setEditedInstitution({
      ...editedInstitution,
      programs: editedInstitution.programs.filter((program) => program.id !== id),
    })
  }

  const handleAddFaculty = () => {
    if (!newItem.name || !newItem.position || !newItem.department || !newItem.qualifications) {
      return
    }

    setEditedInstitution({
      ...editedInstitution,
      faculty: [
        ...editedInstitution.faculty,
        {
          id: `fac-${Date.now()}`,
          name: newItem.name,
          position: newItem.position,
          department: newItem.department,
          qualifications: newItem.qualifications,
        },
      ],
    })

    setNewItem({
      ...newItem,
      name: "",
      position: "",
      department: "",
      qualifications: "",
    })
  }

  const handleRemoveFaculty = (id: string) => {
    setEditedInstitution({
      ...editedInstitution,
      faculty: editedInstitution.faculty.filter((faculty) => faculty.id !== id),
    })
  }

  const handleAddEngineer = () => {
    if (!newItem.name || !newItem.position || !newItem.registrationNumber) {
      return
    }

    setEditedInstitution({
      ...editedInstitution,
      engineers: [
        ...editedInstitution.engineers,
        {
          id: `eng-${Date.now()}`,
          name: newItem.name,
          position: newItem.position,
          registrationNumber: newItem.registrationNumber,
        },
      ],
    })

    setNewItem({
      ...newItem,
      name: "",
      position: "",
      registrationNumber: "",
    })
  }

  const handleRemoveEngineer = (id: string) => {
    setEditedInstitution({
      ...editedInstitution,
      engineers: editedInstitution.engineers.filter((engineer) => engineer.id !== id),
    })
  }

  const handleFileUpload = (file: { name: string; type: string }) => {
    setEditedInstitution({
      ...editedInstitution,
      documents: [
        ...editedInstitution.documents,
        {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: file.type,
          status: "pending",
        },
      ],
    })
  }

  const handleRemoveDocument = (id: string) => {
    setEditedInstitution({
      ...editedInstitution,
      documents: editedInstitution.documents.filter((doc) => doc.id !== id),
    })
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "en" ? "Institution Dashboard" : "لوحة تحكم المؤسسة"}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Manage your institution profile, programs, and compliance"
              : "إدارة ملف مؤسستك وبرامجها والامتثال"}
          </p>
        </div>
        <Button onClick={handleEditToggle} className="bg-gradient-green hover:opacity-90">
          {isEditing ? (
            language === "en" ? (
              "Save Changes"
            ) : (
              "حفظ التغييرات"
            )
          ) : (
            <>
              <PenLine className="mr-2 h-4 w-4" />
              {language === "en" ? "Edit Profile" : "تعديل الملف"}
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{language === "en" ? "Institution Status" : "حالة المؤسسة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {institution.type === "university" ? (
                  <GraduationCap className="h-8 w-8 text-primary mr-2" />
                ) : (
                  <Building2 className="h-8 w-8 text-primary mr-2" />
                )}
                <div>
                  <p className="text-xl font-bold">
                    {institution.status === "approved"
                      ? language === "en"
                        ? "Approved"
                        : "معتمدة"
                      : institution.status === "pending"
                        ? language === "en"
                          ? "Pending"
                          : "قيد الانتظار"
                        : language === "en"
                          ? "Rejected"
                          : "مرفوضة"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? institution.type === "university"
                        ? "Educational Institution"
                        : "Agricultural Company"
                      : institution.type === "university"
                        ? "مؤسسة تعليمية"
                        : "شركة زراعية"}
                  </p>
                </div>
              </div>
              <Badge
                className={
                  institution.status === "approved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : institution.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                }
              >
                {institution.status === "approved" ? (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                ) : institution.status === "pending" ? (
                  <Clock className="mr-1 h-3 w-3" />
                ) : (
                  <AlertCircle className="mr-1 h-3 w-3" />
                )}
                {institution.status === "approved"
                  ? language === "en"
                    ? "Verified"
                    : "تم التحقق"
                  : institution.status === "pending"
                    ? language === "en"
                      ? "Pending"
                      : "قيد الانتظار"
                    : language === "en"
                      ? "Rejected"
                      : "مرفوض"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{language === "en" ? "Compliance Score" : "درجة الامتثال"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">{institution.complianceScore}%</span>
                </div>
                <Badge
                  className={
                    institution.complianceScore >= 90
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : institution.complianceScore >= 70
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }
                >
                  {institution.complianceScore >= 90
                    ? language === "en"
                      ? "Excellent"
                      : "ممتاز"
                    : institution.complianceScore >= 70
                      ? language === "en"
                        ? "Good"
                        : "جيد"
                      : language === "en"
                        ? "Needs Improvement"
                        : "يحتاج إلى تحسين"}
                </Badge>
              </div>
              <Progress value={institution.complianceScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{language === "en" ? "Certification Rate" : "معدل الشهادات"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">{institution.certificationRate}%</span>
                </div>
                <Badge
                  className={
                    institution.certificationRate >= 80
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : institution.certificationRate >= 60
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }
                >
                  {institution.certificationRate >= 80
                    ? language === "en"
                      ? "High"
                      : "مرتفع"
                    : institution.certificationRate >= 60
                      ? language === "en"
                        ? "Average"
                        : "متوسط"
                      : language === "en"
                        ? "Low"
                        : "منخفض"}
                </Badge>
              </div>
              <Progress value={institution.certificationRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? "Percentage of graduates/engineers with professional certifications"
                  : "نسبة الخريجين/المهندسين الحاصلين على شهادات مهنية"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="overview">{language === "en" ? "Overview" : "نظرة عامة"}</TabsTrigger>
          <TabsTrigger value="programs">
            {language === "en"
              ? institution.type === "university"
                ? "Programs"
                : "Engineers"
              : institution.type === "university"
                ? "البرامج"
                : "المهندسون"}
          </TabsTrigger>
          <TabsTrigger value="compliance">{language === "en" ? "Compliance" : "الامتثال"}</TabsTrigger>
          <TabsTrigger value="documents">{language === "en" ? "Documents" : "المستندات"}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Institution Information" : "معلومات المؤسسة"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Basic information about your institution" : "معلومات أساسية عن مؤسستك"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">
                    {language === "en" ? "Institution Name (English)" : "اسم المؤسسة (بالإنجليزية)"}
                  </Label>
                  {isEditing ? (
                    <Input id="nameEn" name="nameEn" value={editedInstitution.nameEn} onChange={handleInputChange} />
                  ) : (
                    <p className="text-sm font-medium">{institution.nameEn}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">
                    {language === "en" ? "Institution Name (Arabic)" : "اسم المؤسسة (بالعربية)"}
                  </Label>
                  {isEditing ? (
                    <Input id="nameAr" name="nameAr" value={editedInstitution.nameAr} onChange={handleInputChange} />
                  ) : (
                    <p className="text-sm font-medium">{institution.nameAr}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">
                    {language === "en"
                      ? institution.type === "university"
                        ? "License Number"
                        : "Commercial Registration Number"
                      : institution.type === "university"
                        ? "رقم الترخيص"
                        : "رقم السجل التجاري"}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="licenseNumber"
                      name={institution.type === "university" ? "licenseNumber" : "commercialRegister"}
                      value={
                        institution.type === "university"
                          ? editedInstitution.licenseNumber
                          : editedInstitution.commercialRegister
                      }
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {institution.type === "university" ? institution.licenseNumber : institution.commercialRegister}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishmentYear">{language === "en" ? "Establishment Year" : "سنة التأسيس"}</Label>
                  {isEditing ? (
                    <Input
                      id="establishmentYear"
                      name="establishmentYear"
                      value={editedInstitution.establishmentYear}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-sm font-medium">{institution.establishmentYear}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{language === "en" ? "Address" : "العنوان"}</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    name="address"
                    value={editedInstitution.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm font-medium">{institution.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">{language === "en" ? "City" : "المدينة"}</Label>
                  {isEditing ? (
                    <Input id="city" name="city" value={editedInstitution.city} onChange={handleInputChange} />
                  ) : (
                    <p className="text-sm font-medium">{institution.city}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{language === "en" ? "Country" : "الدولة"}</Label>
                  {isEditing ? (
                    <Input id="country" name="country" value={editedInstitution.country} onChange={handleInputChange} />
                  ) : (
                    <p className="text-sm font-medium">
                      {institution.country === "saudi_arabia"
                        ? language === "en"
                          ? "Saudi Arabia"
                          : "المملكة العربية السعودية"
                        : institution.country}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">{language === "en" ? "Website" : "الموقع الإلكتروني"}</Label>
                  {isEditing ? (
                    <Input id="website" name="website" value={editedInstitution.website} onChange={handleInputChange} />
                  ) : (
                    <p className="text-sm font-medium">{institution.website}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">
                    {language === "en" ? "Contact Email" : "البريد الإلكتروني للتواصل"}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      value={editedInstitution.contactEmail}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-sm font-medium">{institution.contactEmail}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{language === "en" ? "Contact Phone" : "رقم الهاتف للتواصل"}</Label>
                  {isEditing ? (
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={editedInstitution.contactPhone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-sm font-medium">{institution.contactPhone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{language === "en" ? "Institution Description" : "وصف المؤسسة"}</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    name="description"
                    value={editedInstitution.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm font-medium">{institution.description}</p>
                )}
              </div>

              {institution.type === "university" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accreditationBody">
                      {language === "en" ? "Accreditation Body" : "جهة الاعتماد"}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="accreditationBody"
                        name="accreditationBody"
                        value={editedInstitution.accreditationBody}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium">{institution.accreditationBody}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accreditationDate">
                      {language === "en" ? "Accreditation Date" : "تاريخ الاعتماد"}
                    </Label>
                    {isEditing ? (
                      <Input
                        id="accreditationDate"
                        name="accreditationDate"
                        type="date"
                        value={editedInstitution.accreditationDate}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium">{institution.accreditationDate}</p>
                    )}
                  </div>
                </div>
              )}

              {institution.type === "company" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sector">{language === "en" ? "Agricultural Sector" : "القطاع الزراعي"}</Label>
                    {isEditing ? (
                      <Input id="sector" name="sector" value={editedInstitution.sector} onChange={handleInputChange} />
                    ) : (
                      <p className="text-sm font-medium">
                        {institution.sector === "crop_production"
                          ? language === "en"
                            ? "Crop Production"
                            : "إنتاج المحاصيل"
                          : institution.sector === "livestock"
                            ? language === "en"
                              ? "Livestock"
                              : "الثروة الحيوانية"
                            : institution.sector === "irrigation"
                              ? language === "en"
                                ? "Irrigation Systems"
                                : "أنظمة الري"
                              : institution.sector}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">{language === "en" ? "Company Size" : "حجم الشركة"}</Label>
                    {isEditing ? (
                      <Input id="size" name="size" value={editedInstitution.size} onChange={handleInputChange} />
                    ) : (
                      <p className="text-sm font-medium">
                        {institution.size === "small"
                          ? language === "en"
                            ? "Small (1-50 employees)"
                            : "صغيرة (1-50 موظف)"
                          : institution.size === "medium"
                            ? language === "en"
                              ? "Medium (51-250 employees)"
                              : "متوسطة (51-250 موظف)"
                            : institution.size === "large"
                              ? language === "en"
                                ? "Large (251+ employees)"
                                : "كبيرة (251+ موظف)"
                              : institution.size}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en"
                  ? institution.type === "university"
                    ? "Academic Programs"
                    : "Registered Engineers"
                  : institution.type === "university"
                    ? "البرامج الأكاديمية"
                    : "المهندسون المسجلون"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? institution.type === "university"
                    ? "Manage your institution's academic programs"
                    : "Manage engineers employed by your company"
                  : institution.type === "university"
                    ? "إدارة البرامج الأكاديمية لمؤسستك"
                    : "إدارة المهندسين العاملين في شركتك"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {institution.type === "university" ? (
                <>
                  {isEditing && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        {language === "en" ? "Add New Program" : "إضافة برنامج جديد"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Input
                            placeholder={language === "en" ? "Program Name (English)" : "اسم البرنامج (بالإنجليزية)"}
                            value={newItem.nameEn}
                            onChange={(e) => setNewItem({ ...newItem, nameEn: e.target.value })}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder={language === "en" ? "Program Name (Arabic)" : "اسم البرنامج (بالعربية)"}
                            value={newItem.nameAr}
                            onChange={(e) => setNewItem({ ...newItem, nameAr: e.target.value })}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder={
                              language === "en"
                                ? "Degree (bachelor, master, phd)"
                                : "الدرجة (بكالوريوس، ماجستير، دكتوراه)"
                            }
                            value={newItem.degree}
                            onChange={(e) => setNewItem({ ...newItem, degree: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder={language === "en" ? "Duration (years)" : "المدة (سنوات)"}
                            value={newItem.duration}
                            onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                          />
                          <Button
                            type="button"
                            onClick={handleAddProgram}
                            disabled={!newItem.nameEn || !newItem.nameAr || !newItem.degree || !newItem.duration}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border rounded-md divide-y">
                    {editedInstitution.programs.map((program) => (
                      <div key={program.id} className="flex items-center justify-between p-4">
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
                        {isEditing && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveProgram(program.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">
                      {language === "en" ? "Faculty Members" : "أعضاء هيئة التدريس"}
                    </h3>

                    {isEditing && (
                      <div className="space-y-4 mb-4">
                        <h4 className="text-md font-medium">
                          {language === "en" ? "Add New Faculty Member" : "إضافة عضو هيئة تدريس جديد"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Input
                              placeholder={language === "en" ? "Name" : "الاسم"}
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder={language === "en" ? "Position" : "المنصب"}
                              value={newItem.position}
                              onChange={(e) => setNewItem({ ...newItem, position: e.target.value })}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder={language === "en" ? "Department" : "القسم"}
                              value={newItem.department}
                              onChange={(e) => setNewItem({ ...newItem, department: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder={language === "en" ? "Qualifications" : "المؤهلات"}
                              value={newItem.qualifications}
                              onChange={(e) => setNewItem({ ...newItem, qualifications: e.target.value })}
                            />
                            <Button
                              type="button"
                              onClick={handleAddFaculty}
                              disabled={
                                !newItem.name || !newItem.position || !newItem.department || !newItem.qualifications
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border rounded-md divide-y">
                      {editedInstitution.faculty.map((faculty) => (
                        <div key={faculty.id} className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">{faculty.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {faculty.position} - {faculty.department}
                            </p>
                            <p className="text-xs text-muted-foreground">{faculty.qualifications}</p>
                          </div>
                          {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveFaculty(faculty.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {isEditing && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        {language === "en" ? "Add New Engineer" : "إضافة مهندس جديد"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Input
                            placeholder={language === "en" ? "Engineer Name" : "اسم المهندس"}
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder={language === "en" ? "Position" : "المنصب"}
                            value={newItem.position}
                            onChange={(e) => setNewItem({ ...newItem, position: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder={language === "en" ? "Registration Number" : "رقم التسجيل"}
                            value={newItem.registrationNumber}
                            onChange={(e) => setNewItem({ ...newItem, registrationNumber: e.target.value })}
                          />
                          <Button
                            type="button"
                            onClick={handleAddEngineer}
                            disabled={!newItem.name || !newItem.position || !newItem.registrationNumber}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {editedInstitution.engineers.length > 0 ? (
                    <div className="border rounded-md divide-y">
                      {editedInstitution.engineers.map((engineer) => (
                        <div key={engineer.id} className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">{engineer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {engineer.position} - {language === "en" ? "Reg. No: " : "رقم التسجيل: "}
                              {engineer.registrationNumber}
                            </p>
                          </div>
                          {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveEngineer(engineer.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border border-dashed rounded-md">
                      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {language === "en" ? "No Engineers Added Yet" : "لم تتم إضافة مهندسين بعد"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {language === "en"
                          ? "Add engineers who are registered in the system and employed by your company"
                          : "أضف المهندسين المسجلين في النظام والعاملين في شركتك"}
                      </p>
                      {isEditing && (
                        <Button onClick={() => document.getElementById("add-engineer-section")?.scrollIntoView()}>
                          {language === "en" ? "Add Engineer" : "إضافة مهندس"}
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Compliance History" : "سجل الامتثال"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Track your institution's compliance over time"
                  : "تتبع امتثال مؤسستك على مر الزمن"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {language === "en" ? "Current Compliance Score" : "درجة الامتثال الحالية"}
                  </h3>
                  <Badge
                    className={
                      institution.complianceScore >= 90
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : institution.complianceScore >= 70
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }
                  >
                    {institution.complianceScore}%
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">
                      {language === "en" ? "Documentation Compliance" : "امتثال الوثائق"}
                    </h4>
                    <span className="text-sm">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />

                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">
                      {language === "en"
                        ? institution.type === "university"
                          ? "Faculty Credentials"
                          : "Engineer Registrations"
                        : institution.type === "university"
                          ? "اعتمادات هيئة التدريس"
                          : "تسجيلات المهندسين"}
                    </h4>
                    <span className="text-sm">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />

                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">
                      {language === "en"
                        ? institution.type === "university"
                          ? "Program Accreditation"
                          : "Professional Standards"
                        : institution.type === "university"
                          ? "اعتماد البرامج"
                          : "المعايير المهنية"}
                    </h4>
                    <span className="text-sm">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    {language === "en" ? "Compliance History" : "سجل الامتثال"}
                  </h3>
                  <div className="border rounded-md divide-y">
                    {institution.complianceHistory.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">
                            {new Date(record.date).toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}
                          </p>
                          <p className="text-sm text-muted-foreground">{record.notes}</p>
                        </div>
                        <Badge
                          className={
                            record.score >= 90
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : record.score >= 70
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }
                        >
                          {record.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => router.push("/institution/compliance-report")} className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {language === "en" ? "View Detailed Compliance Report" : "عرض تقرير الامتثال المفصل"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Documents" : "المستندات"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Manage your institution's documents and certifications"
                  : "إدارة مستندات وشهادات مؤسستك"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{language === "en" ? "Upload Document" : "تحميل مستند"}</h3>
                  <FileUpload onUpload={handleFileUpload} acceptedFileTypes=".pdf,.jpg,.jpeg,.png" maxFileSizeMB={10} />
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">
                  {language === "en" ? "Uploaded Documents" : "المستندات المحملة"}
                </h3>
                {editedInstitution.documents.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {editedInstitution.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.status === "verified"
                                ? language === "en"
                                  ? "Verified"
                                  : "تم التحقق"
                                : doc.status === "pending"
                                  ? language === "en"
                                    ? "Pending Verification"
                                    : "في انتظار التحقق"
                                  : language === "en"
                                    ? "Rejected"
                                    : "مرفوض"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveDocument(doc.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border border-dashed rounded-md">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === "en" ? "No Documents Uploaded Yet" : "لم يتم تحميل مستندات بعد"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === "en"
                        ? "Upload your institution's documents for verification"
                        : "قم بتحميل مستندات مؤسستك للتحقق منها"}
                    </p>
                    {isEditing && (
                      <Button onClick={() => document.getElementById("upload-document-section")?.scrollIntoView()}>
                        {language === "en" ? "Upload Document" : "تحميل مستند"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-green hover:opacity-90"
                onClick={() => router.push("/institution/documents/upload")}
              >
                <FileText className="mr-2 h-4 w-4" />
                {language === "en" ? "Upload New Document" : "تحميل مستند جديد"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
