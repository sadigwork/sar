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
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"

export default function EditCompanyPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Sample company data - in a real app, this would be fetched from an API
  const [company, setCompany] = useState({
    id: params.id,
    nameEn: "Agricultural Development Company",
    nameAr: "شركة التنمية الزراعية",
    commercialRegister: "CR-78901",
    establishmentYear: "2005",
    address: "456 Business Park, Jeddah",
    city: "Jeddah",
    country: "saudi_arabia",
    website: "https://agri-dev.com",
    contactEmail: "info@agri-dev.com",
    contactPhone: "+966 12 345 6789",
    description:
      "A leading agricultural company specializing in modern farming techniques, irrigation systems, and sustainable agricultural practices.",
    sector: "irrigation",
    size: "medium",
    status: "approved", // pending, approved, rejected
    engineers: [
      {
        id: "eng-1",
        name: "Mohammed Al-Harbi",
        position: "Senior Agricultural Engineer",
        registrationNumber: "AE-2022-5678",
      },
      {
        id: "eng-2",
        name: "Sara Al-Otaibi",
        position: "Irrigation Systems Specialist",
        registrationNumber: "AE-2021-9012",
      },
    ],
    projects: [
      {
        id: "proj-1",
        nameEn: "Modern Irrigation System Implementation",
        nameAr: "تنفيذ نظام ري حديث",
        location: "Riyadh Region",
        startDate: "2022-03-15",
        endDate: "2023-02-28",
        status: "completed",
        description: "Implementation of water-efficient irrigation systems for large-scale farms in the Riyadh region.",
      },
      {
        id: "proj-2",
        nameEn: "Sustainable Farming Initiative",
        nameAr: "مبادرة الزراعة المستدامة",
        location: "Eastern Province",
        startDate: "2023-01-10",
        endDate: null,
        status: "in_progress",
        description: "Developing sustainable farming practices to reduce water usage and increase crop yield.",
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "Commercial Registration.pdf",
        type: "application/pdf",
        status: "verified",
      },
      {
        id: "doc-2",
        name: "Company Profile.pdf",
        type: "application/pdf",
        status: "verified",
      },
    ],
  })

  // New item templates
  const [newEngineer, setNewEngineer] = useState({
    name: "",
    position: "",
    registrationNumber: "",
  })

  const [newProject, setNewProject] = useState({
    nameEn: "",
    nameAr: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "in_progress",
    description: "",
  })

  // Check if user is logged in and is a registrar
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "registrar") {
        router.push("/dashboard")
      } else {
        // In a real app, fetch the company data here
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router, params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewEngineerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEngineer((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddEngineer = () => {
    if (!newEngineer.name || !newEngineer.position || !newEngineer.registrationNumber) {
      return
    }

    setCompany((prev) => ({
      ...prev,
      engineers: [
        ...prev.engineers,
        {
          id: `eng-${Date.now()}`,
          ...newEngineer,
        },
      ],
    }))

    setNewEngineer({
      name: "",
      position: "",
      registrationNumber: "",
    })
  }

  const handleAddProject = () => {
    if (!newProject.nameEn || !newProject.nameAr || !newProject.location || !newProject.startDate) {
      return
    }

    setCompany((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj-${Date.now()}`,
          ...newProject,
        },
      ],
    }))

    setNewProject({
      nameEn: "",
      nameAr: "",
      location: "",
      startDate: "",
      endDate: "",
      status: "in_progress",
      description: "",
    })
  }

  const handleRemoveEngineer = (id: string) => {
    setCompany((prev) => ({
      ...prev,
      engineers: prev.engineers.filter((engineer) => engineer.id !== id),
    }))
  }

  const handleRemoveProject = (id: string) => {
    setCompany((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }))
  }

  const handleFileUpload = (file: { name: string; type: string }) => {
    setCompany((prev) => ({
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
    setCompany((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    // In a real app, this would be an API call to update the company data
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: language === "en" ? "Changes saved successfully" : "تم حفظ التغييرات بنجاح",
        description: language === "en" ? "The company's information has been updated." : "تم تحديث معلومات الشركة.",
      })
      router.push(`/registrar/companies/${params.id}`)
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
        <Button variant="outline" onClick={() => router.push(`/registrar/companies/${params.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Company Details" : "العودة إلى تفاصيل الشركة"}
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
        <h1 className="text-3xl font-bold mb-2">{language === "en" ? "Edit Company" : "تعديل بيانات الشركة"}</h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Update the company's information, engineers, projects, and documents."
            : "تحديث معلومات الشركة والمهندسين والمشاريع والوثائق."}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="basic">{language === "en" ? "Basic Information" : "المعلومات الأساسية"}</TabsTrigger>
          <TabsTrigger value="engineers">{language === "en" ? "Engineers" : "المهندسون"}</TabsTrigger>
          <TabsTrigger value="projects">{language === "en" ? "Projects" : "المشاريع"}</TabsTrigger>
          <TabsTrigger value="documents">{language === "en" ? "Documents" : "الوثائق"}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Basic Information" : "المعلومات الأساسية"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Update the company's basic information." : "تحديث المعلومات الأساسية للشركة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">
                    {language === "en" ? "Company Name (English)" : "اسم الشركة (بالإنجليزية)"}
                  </Label>
                  <Input id="nameEn" name="nameEn" value={company.nameEn} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">
                    {language === "en" ? "Company Name (Arabic)" : "اسم الشركة (بالعربية)"}
                  </Label>
                  <Input id="nameAr" name="nameAr" value={company.nameAr} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="commercialRegister">
                    {language === "en" ? "Commercial Registration Number" : "رقم السجل التجاري"}
                  </Label>
                  <Input
                    id="commercialRegister"
                    name="commercialRegister"
                    value={company.commercialRegister}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishmentYear">{language === "en" ? "Establishment Year" : "سنة التأسيس"}</Label>
                  <Input
                    id="establishmentYear"
                    name="establishmentYear"
                    value={company.establishmentYear}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{language === "en" ? "Address" : "العنوان"}</Label>
                <Textarea id="address" name="address" value={company.address} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">{language === "en" ? "City" : "المدينة"}</Label>
                  <Input id="city" name="city" value={company.city} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{language === "en" ? "Country" : "الدولة"}</Label>
                  <Select value={company.country} onValueChange={(value) => handleSelectChange("country", value)}>
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
                  <Input id="website" name="website" value={company.website} onChange={handleInputChange} />
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
                    value={company.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{language === "en" ? "Contact Phone" : "رقم الهاتف للتواصل"}</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={company.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{language === "en" ? "Description" : "الوصف"}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={company.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sector">{language === "en" ? "Agricultural Sector" : "القطاع الزراعي"}</Label>
                  <Select value={company.sector} onValueChange={(value) => handleSelectChange("sector", value)}>
                    <SelectTrigger>
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
                      <SelectItem value="other">{language === "en" ? "Other" : "أخرى"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">{language === "en" ? "Company Size" : "حجم الشركة"}</Label>
                  <Select value={company.size} onValueChange={(value) => handleSelectChange("size", value)}>
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

              <div className="space-y-2">
                <Label htmlFor="status">{language === "en" ? "Status" : "الحالة"}</Label>
                <Select value={company.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engineers">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Engineers" : "المهندسون"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Manage engineers employed by the company."
                  : "إدارة المهندسين العاملين في الشركة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Add New Engineer" : "إضافة مهندس جديد"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineerName">{language === "en" ? "Name" : "الاسم"}</Label>
                    <Input
                      id="engineerName"
                      name="name"
                      value={newEngineer.name}
                      onChange={handleNewEngineerChange}
                      placeholder={language === "en" ? "Enter name" : "أدخل الاسم"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">{language === "en" ? "Position" : "المنصب"}</Label>
                    <Input
                      id="position"
                      name="position"
                      value={newEngineer.position}
                      onChange={handleNewEngineerChange}
                      placeholder={language === "en" ? "Enter position" : "أدخل المنصب"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">
                      {language === "en" ? "Registration Number" : "رقم التسجيل"}
                    </Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={newEngineer.registrationNumber}
                      onChange={handleNewEngineerChange}
                      placeholder={language === "en" ? "Enter registration number" : "أدخل رقم التسجيل"}
                    />
                  </div>
                </div>
                <Button onClick={handleAddEngineer} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Engineer" : "إضافة مهندس"}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "en" ? "Current Engineers" : "المهندسون الحاليون"}
                </h3>
                {company.engineers.length === 0 ? (
                  <p className="text-muted-foreground">
                    {language === "en" ? "No engineers added yet." : "لم تتم إضافة مهندسين بعد."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {company.engineers.map((engineer) => (
                      <div key={engineer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{engineer.name}</p>
                          <p className="text-sm text-muted-foreground">{engineer.position}</p>
                          <p className="text-sm text-muted-foreground">{engineer.registrationNumber}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveEngineer(engineer.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Projects" : "المشاريع"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Manage agricultural projects undertaken by the company."
                  : "إدارة المشاريع الزراعية التي تنفذها الشركة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Add New Project" : "إضافة مشروع جديد"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectNameEn">
                      {language === "en" ? "Project Name (English)" : "اسم المشروع (بالإنجليزية)"}
                    </Label>
                    <Input
                      id="projectNameEn"
                      name="nameEn"
                      value={newProject.nameEn}
                      onChange={handleNewProjectChange}
                      placeholder={language === "en" ? "Enter project name" : "أدخل اسم المشروع"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectNameAr">
                      {language === "en" ? "Project Name (Arabic)" : "اسم المشروع (بالعربية)"}
                    </Label>
                    <Input
                      id="projectNameAr"
                      name="nameAr"
                      value={newProject.nameAr}
                      onChange={handleNewProjectChange}
                      placeholder={language === "en" ? "Enter project name" : "أدخل اسم المشروع"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">{language === "en" ? "Location" : "الموقع"}</Label>
                    <Input
                      id="location"
                      name="location"
                      value={newProject.location}
                      onChange={handleNewProjectChange}
                      placeholder={language === "en" ? "Enter location" : "أدخل الموقع"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">{language === "en" ? "Start Date" : "تاريخ البدء"}</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={handleNewProjectChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">{language === "en" ? "End Date" : "تاريخ الانتهاء"}</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newProject.endDate || ""}
                      onChange={handleNewProjectChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectStatus">{language === "en" ? "Status" : "الحالة"}</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value) => setNewProject((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger id="projectStatus">
                      <SelectValue placeholder={language === "en" ? "Select status" : "اختر الحالة"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">{language === "en" ? "Planned" : "مخطط"}</SelectItem>
                      <SelectItem value="in_progress">{language === "en" ? "In Progress" : "قيد التنفيذ"}</SelectItem>
                      <SelectItem value="completed">{language === "en" ? "Completed" : "مكتمل"}</SelectItem>
                      <SelectItem value="cancelled">{language === "en" ? "Cancelled" : "ملغي"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">{language === "en" ? "Description" : "الوصف"}</Label>
                  <Textarea
                    id="projectDescription"
                    name="description"
                    value={newProject.description}
                    onChange={handleNewProjectChange}
                    placeholder={language === "en" ? "Enter project description" : "أدخل وصف المشروع"}
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddProject} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Project" : "إضافة مشروع"}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Current Projects" : "المشاريع الحالية"}</h3>
                {company.projects.length === 0 ? (
                  <p className="text-muted-foreground">
                    {language === "en" ? "No projects added yet." : "لم تتم إضافة مشاريع بعد."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {company.projects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{language === "en" ? project.nameEn : project.nameAr}</h4>
                            <p className="text-sm text-muted-foreground">{project.location}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveProject(project.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                          <div>
                            <span className="text-xs text-muted-foreground">
                              {language === "en" ? "Start Date" : "تاريخ البدء"}:{" "}
                            </span>
                            <span className="text-xs">{project.startDate}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">
                              {language === "en" ? "End Date" : "تاريخ الانتهاء"}:{" "}
                            </span>
                            <span className="text-xs">
                              {project.endDate || (language === "en" ? "Ongoing" : "مستمر")}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">
                              {language === "en" ? "Status" : "الحالة"}:{" "}
                            </span>
                            <span className="text-xs capitalize">{project.status.replace("_", " ")}</span>
                          </div>
                        </div>
                        <p className="text-sm">{project.description}</p>
                      </div>
                    ))}
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
                {language === "en" ? "Manage company documents and certificates." : "إدارة وثائق وشهادات الشركة."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {language === "en" ? "Upload New Document" : "تحميل وثيقة جديدة"}
                </h3>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="mb-2">
                    {language === "en"
                      ? "Drag and drop files here or click to browse"
                      : "اسحب وأفلت الملفات هنا أو انقر للتصفح"}
                  </p>
                  <Button variant="outline">{language === "en" ? "Browse Files" : "تصفح الملفات"}</Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {language === "en"
                      ? "Supported formats: PDF, JPG, PNG. Max file size: 10MB"
                      : "الصيغ المدعومة: PDF، JPG، PNG. الحد الأقصى لحجم الملف: 10 ميجابايت"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{language === "en" ? "Current Documents" : "الوثائق الحالية"}</h3>
                {company.documents.length === 0 ? (
                  <p className="text-muted-foreground">
                    {language === "en" ? "No documents uploaded yet." : "لم يتم تحميل وثائق بعد."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {company.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="mr-4 p-2 bg-muted rounded">
                            {doc.type.includes("pdf") ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-primary"
                              >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-primary"
                              >
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <div className="flex items-center mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  doc.status === "verified"
                                    ? "bg-green-100 text-green-800"
                                    : doc.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {doc.status === "verified"
                                  ? language === "en"
                                    ? "Verified"
                                    : "تم التحقق"
                                  : doc.status === "rejected"
                                    ? language === "en"
                                      ? "Rejected"
                                      : "مرفوض"
                                    : language === "en"
                                      ? "Pending"
                                      : "قيد الانتظار"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <Button variant="ghost" size="icon" className="mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveDocument(doc.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
