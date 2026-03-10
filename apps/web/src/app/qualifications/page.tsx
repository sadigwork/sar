"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Pencil, Plus, Trash2 } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { toast } from "@/hooks/use-toast"

// Mock data for qualifications
const initialQualifications = {
  education: [
    {
      id: "edu1",
      degree: "بكالوريوس",
      institution: "جامعة الملك سعود",
      field: "هندسة مدنية",
      graduationYear: "2015",
      certificate: "certificate1.pdf",
    },
    {
      id: "edu2",
      degree: "ماجستير",
      institution: "جامعة الملك فهد للبترول والمعادن",
      field: "هندسة إنشائية",
      graduationYear: "2018",
      certificate: "certificate2.pdf",
    },
  ],
  publications: [
    {
      id: "pub1",
      title: "تحليل الأداء الزلزالي للمباني الخرسانية",
      journal: "المجلة العربية للهندسة المدنية",
      year: "2019",
      link: "https://example.com/publication1",
      document: "publication1.pdf",
    },
    {
      id: "pub2",
      title: "تقنيات حديثة في تصميم الجسور المعلقة",
      journal: "مجلة الهندسة الإنشائية",
      year: "2020",
      link: "https://example.com/publication2",
      document: "publication2.pdf",
    },
  ],
  experience: [
    {
      id: "exp1",
      title: "مهندس مشروع",
      company: "شركة المقاولون العرب",
      startDate: "2015-06",
      endDate: "2018-05",
      description: "إدارة مشاريع البنية التحتية وتنفيذ الطرق والجسور",
      document: "experience1.pdf",
    },
    {
      id: "exp2",
      title: "مهندس تصميم",
      company: "مكتب ABC للاستشارات الهندسية",
      startDate: "2018-06",
      endDate: "2021-12",
      description: "تصميم المباني السكنية والتجارية وإعداد المخططات الهندسية",
      document: "experience2.pdf",
    },
    {
      id: "exp3",
      title: "مدير مشاريع",
      company: "شركة XYZ للتطوير العقاري",
      startDate: "2022-01",
      endDate: "",
      description: "إدارة المشاريع العقارية الكبرى وتنسيق العمل بين الفرق المختلفة",
      document: "experience3.pdf",
    },
  ],
  certifications: [
    {
      id: "cert1",
      name: "PMP - محترف إدارة مشاريع",
      issuer: "معهد إدارة المشاريع",
      issueDate: "2019-08",
      expiryDate: "2022-08",
      document: "certification1.pdf",
    },
    {
      id: "cert2",
      name: "LEED AP - محترف معتمد في المباني الخضراء",
      issuer: "المجلس الأمريكي للمباني الخضراء",
      issueDate: "2020-03",
      expiryDate: "2024-03",
      document: "certification2.pdf",
    },
  ],
}

export default function QualificationsPage() {
  const { t } = useLanguage()

  // State for qualifications
  const [qualifications, setQualifications] = useState(initialQualifications)

  // State for dialogs
  const [educationDialogOpen, setEducationDialogOpen] = useState(false)
  const [publicationDialogOpen, setPublicationDialogOpen] = useState(false)
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false)
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false)

  // State for editing
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)

  // State for form data
  const [educationForm, setEducationForm] = useState({
    degree: "",
    institution: "",
    field: "",
    graduationYear: "",
    certificate: "",
  })

  const [publicationForm, setPublicationForm] = useState({
    title: "",
    journal: "",
    year: "",
    link: "",
    document: "",
  })

  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    document: "",
  })

  const [certificationForm, setCertificationForm] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    document: "",
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!educationDialogOpen) {
      setEducationForm({
        degree: "",
        institution: "",
        field: "",
        graduationYear: "",
        certificate: "",
      })
      setIsEditing(false)
      setCurrentEditId(null)
    }
  }, [educationDialogOpen])

  useEffect(() => {
    if (!publicationDialogOpen) {
      setPublicationForm({
        title: "",
        journal: "",
        year: "",
        link: "",
        document: "",
      })
      setIsEditing(false)
      setCurrentEditId(null)
    }
  }, [publicationDialogOpen])

  useEffect(() => {
    if (!experienceDialogOpen) {
      setExperienceForm({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        document: "",
      })
      setIsEditing(false)
      setCurrentEditId(null)
    }
  }, [experienceDialogOpen])

  useEffect(() => {
    if (!certificationDialogOpen) {
      setCertificationForm({
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        document: "",
      })
      setIsEditing(false)
      setCurrentEditId(null)
    }
  }, [certificationDialogOpen])

  // Handle edit
  const handleEditEducation = (id) => {
    const education = qualifications.education.find((edu) => edu.id === id)
    if (education) {
      setEducationForm({
        degree: education.degree,
        institution: education.institution,
        field: education.field,
        graduationYear: education.graduationYear,
        certificate: education.certificate,
      })
      setIsEditing(true)
      setCurrentEditId(id)
      setEducationDialogOpen(true)
    }
  }

  const handleEditPublication = (id) => {
    const publication = qualifications.publications.find((pub) => pub.id === id)
    if (publication) {
      setPublicationForm({
        title: publication.title,
        journal: publication.journal,
        year: publication.year,
        link: publication.link,
        document: publication.document,
      })
      setIsEditing(true)
      setCurrentEditId(id)
      setPublicationDialogOpen(true)
    }
  }

  const handleEditExperience = (id) => {
    const experience = qualifications.experience.find((exp) => exp.id === id)
    if (experience) {
      setExperienceForm({
        title: experience.title,
        company: experience.company,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
        document: experience.document,
      })
      setIsEditing(true)
      setCurrentEditId(id)
      setExperienceDialogOpen(true)
    }
  }

  const handleEditCertification = (id) => {
    const certification = qualifications.certifications.find((cert) => cert.id === id)
    if (certification) {
      setCertificationForm({
        name: certification.name,
        issuer: certification.issuer,
        issueDate: certification.issueDate,
        expiryDate: certification.expiryDate,
        document: certification.document,
      })
      setIsEditing(true)
      setCurrentEditId(id)
      setCertificationDialogOpen(true)
    }
  }

  // Handle delete
  const handleDeleteEducation = (id) => {
    setQualifications({
      ...qualifications,
      education: qualifications.education.filter((edu) => edu.id !== id),
    })
    toast({
      title: "تم الحذف",
      description: "تم حذف المؤهل التعليمي بنجاح",
    })
  }

  const handleDeletePublication = (id) => {
    setQualifications({
      ...qualifications,
      publications: qualifications.publications.filter((pub) => pub.id !== id),
    })
    toast({
      title: "تم الحذف",
      description: "تم حذف المنشور بنجاح",
    })
  }

  const handleDeleteExperience = (id) => {
    setQualifications({
      ...qualifications,
      experience: qualifications.experience.filter((exp) => exp.id !== id),
    })
    toast({
      title: "تم الحذف",
      description: "تم حذف الخبرة العملية بنجاح",
    })
  }

  const handleDeleteCertification = (id) => {
    setQualifications({
      ...qualifications,
      certifications: qualifications.certifications.filter((cert) => cert.id !== id),
    })
    toast({
      title: "تم الحذف",
      description: "تم حذف الشهادة بنجاح",
    })
  }

  // Handle submit
  const handleSubmitEducation = () => {
    if (!educationForm.degree || !educationForm.institution || !educationForm.field || !educationForm.graduationYear) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    if (isEditing) {
      setQualifications({
        ...qualifications,
        education: qualifications.education.map((edu) =>
          edu.id === currentEditId ? { ...educationForm, id: currentEditId } : edu,
        ),
      })
      toast({
        title: "تم التحديث",
        description: "تم تحديث المؤهل التعليمي بنجاح",
      })
    } else {
      const newEducation = {
        id: `edu${Date.now()}`,
        ...educationForm,
      }
      setQualifications({
        ...qualifications,
        education: [...qualifications.education, newEducation],
      })
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة المؤهل التعليمي بنجاح",
      })
    }

    setEducationDialogOpen(false)
  }

  const handleSubmitPublication = () => {
    if (!publicationForm.title || !publicationForm.journal || !publicationForm.year) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    if (isEditing) {
      setQualifications({
        ...qualifications,
        publications: qualifications.publications.map((pub) =>
          pub.id === currentEditId ? { ...publicationForm, id: currentEditId } : pub,
        ),
      })
      toast({
        title: "تم التحديث",
        description: "تم تحديث المنشور بنجاح",
      })
    } else {
      const newPublication = {
        id: `pub${Date.now()}`,
        ...publicationForm,
      }
      setQualifications({
        ...qualifications,
        publications: [...qualifications.publications, newPublication],
      })
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة المنشور بنجاح",
      })
    }

    setPublicationDialogOpen(false)
  }

  const handleSubmitExperience = () => {
    if (!experienceForm.title || !experienceForm.company || !experienceForm.startDate || !experienceForm.description) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    if (isEditing) {
      setQualifications({
        ...qualifications,
        experience: qualifications.experience.map((exp) =>
          exp.id === currentEditId ? { ...experienceForm, id: currentEditId } : exp,
        ),
      })
      toast({
        title: "تم التحديث",
        description: "تم تحديث الخبرة العملية بنجاح",
      })
    } else {
      const newExperience = {
        id: `exp${Date.now()}`,
        ...experienceForm,
      }
      setQualifications({
        ...qualifications,
        experience: [...qualifications.experience, newExperience],
      })
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الخبرة العملية بنجاح",
      })
    }

    setExperienceDialogOpen(false)
  }

  const handleSubmitCertification = () => {
    if (!certificationForm.name || !certificationForm.issuer || !certificationForm.issueDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    if (isEditing) {
      setQualifications({
        ...qualifications,
        certifications: qualifications.certifications.map((cert) =>
          cert.id === currentEditId ? { ...certificationForm, id: currentEditId } : cert,
        ),
      })
      toast({
        title: "تم التحديث",
        description: "تم تحديث الشهادة بنجاح",
      })
    } else {
      const newCertification = {
        id: `cert${Date.now()}`,
        ...certificationForm,
      }
      setQualifications({
        ...qualifications,
        certifications: [...qualifications.certifications, newCertification],
      })
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الشهادة بنجاح",
      })
    }

    setCertificationDialogOpen(false)
  }

  // Handle file upload
  const handleFileUpload = (file, type, field) => {
    if (type === "education") {
      setEducationForm({
        ...educationForm,
        [field]: file.name,
      })
    } else if (type === "publication") {
      setPublicationForm({
        ...publicationForm,
        [field]: file.name,
      })
    } else if (type === "experience") {
      setExperienceForm({
        ...experienceForm,
        [field]: file.name,
      })
    } else if (type === "certification") {
      setCertificationForm({
        ...certificationForm,
        [field]: file.name,
      })
    }

    toast({
      title: "تم الرفع",
      description: `تم رفع الملف ${file.name} بنجاح`,
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6 rtl">
      <h1 className="text-3xl font-bold">المؤهلات والخبرات</h1>

      <Tabs defaultValue="education">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="education">المؤهلات التعليمية</TabsTrigger>
          <TabsTrigger value="publications">المنشورات العلمية</TabsTrigger>
          <TabsTrigger value="experience">الخبرات العملية</TabsTrigger>
          <TabsTrigger value="certifications">الشهادات المهنية</TabsTrigger>
        </TabsList>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">المؤهلات التعليمية</h2>
            <Dialog open={educationDialogOpen} onOpenChange={setEducationDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة مؤهل تعليمي
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "تعديل مؤهل تعليمي" : "إضافة مؤهل تعليمي جديد"}</DialogTitle>
                  <DialogDescription>أدخل تفاصيل المؤهل التعليمي الخاص بك.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="degree" className="text-right">
                      الدرجة العلمية
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={educationForm.degree}
                        onValueChange={(value) => setEducationForm({ ...educationForm, degree: value })}
                      >
                        <SelectTrigger id="degree">
                          <SelectValue placeholder="اختر الدرجة العلمية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="دبلوم">دبلوم</SelectItem>
                          <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                          <SelectItem value="ماجستير">ماجستير</SelectItem>
                          <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="institution" className="text-right">
                      المؤسسة التعليمية
                    </Label>
                    <Input
                      id="institution"
                      value={educationForm.institution}
                      onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="field" className="text-right">
                      التخصص
                    </Label>
                    <Input
                      id="field"
                      value={educationForm.field}
                      onChange={(e) => setEducationForm({ ...educationForm, field: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="graduationYear" className="text-right">
                      سنة التخرج
                    </Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      min="1950"
                      max="2030"
                      value={educationForm.graduationYear}
                      onChange={(e) => setEducationForm({ ...educationForm, graduationYear: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="certificate" className="text-right">
                      الشهادة
                    </Label>
                    <div className="col-span-3">
                      <FileUpload
                        onFileUpload={(file) => handleFileUpload(file, "education", "certificate")}
                        acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                        maxFileSize={5}
                      />
                      {educationForm.certificate && (
                        <p className="text-sm text-muted-foreground mt-2">الملف المرفق: {educationForm.certificate}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEducationDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSubmitEducation}>{isEditing ? "تحديث" : "إضافة"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {qualifications.education.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualifications.education.map((education) => (
                <Card key={education.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>
                      {education.degree} في {education.field}
                    </CardTitle>
                    <CardDescription>
                      {education.institution} | {education.graduationYear}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditEducation(education.id)}>
                        <Pencil className="ml-2 h-4 w-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteEducation(education.id)}
                      >
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                    {education.certificate && (
                      <Button variant="ghost" size="sm">
                        <FileText className="ml-2 h-4 w-4" />
                        عرض الشهادة
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">لا توجد مؤهلات تعليمية مضافة</p>
                <Button onClick={() => setEducationDialogOpen(true)}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة مؤهل تعليمي
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Publications Tab */}
        <TabsContent value="publications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">المنشورات العلمية</h2>
            <Dialog open={publicationDialogOpen} onOpenChange={setPublicationDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة منشور علمي
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "تعديل منشور علمي" : "إضافة منشور علمي جديد"}</DialogTitle>
                  <DialogDescription>أدخل تفاصيل المنشور العلمي الخاص بك.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      عنوان المنشور
                    </Label>
                    <Input
                      id="title"
                      value={publicationForm.title}
                      onChange={(e) => setPublicationForm({ ...publicationForm, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="journal" className="text-right">
                      المجلة / المؤتمر
                    </Label>
                    <Input
                      id="journal"
                      value={publicationForm.journal}
                      onChange={(e) => setPublicationForm({ ...publicationForm, journal: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="year" className="text-right">
                      سنة النشر
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      min="1950"
                      max="2030"
                      value={publicationForm.year}
                      onChange={(e) => setPublicationForm({ ...publicationForm, year: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="link" className="text-right">
                      رابط المنشور (اختياري)
                    </Label>
                    <Input
                      id="link"
                      type="url"
                      value={publicationForm.link}
                      onChange={(e) => setPublicationForm({ ...publicationForm, link: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="document" className="text-right">
                      المستند
                    </Label>
                    <div className="col-span-3">
                      <FileUpload
                        onFileUpload={(file) => handleFileUpload(file, "publication", "document")}
                        acceptedFileTypes=".pdf"
                        maxFileSize={10}
                      />
                      {publicationForm.document && (
                        <p className="text-sm text-muted-foreground mt-2">الملف المرفق: {publicationForm.document}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPublicationDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSubmitPublication}>{isEditing ? "تحديث" : "إضافة"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {qualifications.publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualifications.publications.map((publication) => (
                <Card key={publication.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{publication.title}</CardTitle>
                    <CardDescription>
                      {publication.journal} | {publication.year}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditPublication(publication.id)}>
                        <Pencil className="ml-2 h-4 w-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeletePublication(publication.id)}
                      >
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      {publication.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={publication.link} target="_blank" rel="noopener noreferrer">
                            رابط المنشور
                          </a>
                        </Button>
                      )}
                      {publication.document && (
                        <Button variant="ghost" size="sm">
                          <FileText className="ml-2 h-4 w-4" />
                          عرض المستند
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">لا توجد منشورات علمية مضافة</p>
                <Button onClick={() => setPublicationDialogOpen(true)}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة منشور علمي
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">الخبرات العملية</h2>
            <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة خبرة عملية
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "تعديل خبرة عملية" : "إضافة خبرة عملية جديدة"}</DialogTitle>
                  <DialogDescription>أدخل تفاصيل الخبرة العملية الخاصة بك.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      المسمى الوظيفي
                    </Label>
                    <Input
                      id="title"
                      value={experienceForm.title}
                      onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      الشركة / المؤسسة
                    </Label>
                    <Input
                      id="company"
                      value={experienceForm.company}
                      onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      تاريخ البدء
                    </Label>
                    <Input
                      id="startDate"
                      type="month"
                      value={experienceForm.startDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      تاريخ الانتهاء
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="endDate"
                        type="month"
                        value={experienceForm.endDate}
                        onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                        disabled={experienceForm.current}
                      />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="current"
                          checked={!experienceForm.endDate}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExperienceForm({ ...experienceForm, endDate: "" })
                            }
                          }}
                          className="ml-2"
                        />
                        <label htmlFor="current" className="text-sm">
                          أعمل حاليًا في هذه الوظيفة
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      وصف المهام
                    </Label>
                    <Textarea
                      id="description"
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="document" className="text-right">
                      شهادة الخبرة
                    </Label>
                    <div className="col-span-3">
                      <FileUpload
                        onFileUpload={(file) => handleFileUpload(file, "experience", "document")}
                        acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                        maxFileSize={5}
                      />
                      {experienceForm.document && (
                        <p className="text-sm text-muted-foreground mt-2">الملف المرفق: {experienceForm.document}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExperienceDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSubmitExperience}>{isEditing ? "تحديث" : "إضافة"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {qualifications.experience.length > 0 ? (
            <div className="space-y-4">
              {qualifications.experience.map((experience) => (
                <Card key={experience.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{experience.title}</CardTitle>
                        <CardDescription>
                          {experience.company} | {experience.startDate} - {experience.endDate || "حتى الآن"}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditExperience(experience.id)}>
                          <Pencil className="ml-2 h-4 w-4" />
                          تعديل
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDeleteExperience(experience.id)}
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{experience.description}</p>
                  </CardContent>
                  {experience.document && (
                    <CardFooter>
                      <Button variant="outline" size="sm">
                        <FileText className="ml-2 h-4 w-4" />
                        عرض شهادة الخبرة
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">لا توجد خبرات عملية مضافة</p>
                <Button onClick={() => setExperienceDialogOpen(true)}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة خبرة عملية
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">الشهادات المهنية</h2>
            <Dialog open={certificationDialogOpen} onOpenChange={setCertificationDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة شهادة مهنية
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "تعديل شهادة مهنية" : "إضافة شهادة مهنية جديدة"}</DialogTitle>
                  <DialogDescription>أدخل تفاصيل الشهادة المهنية الخاصة بك.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      اسم الشهادة
                    </Label>
                    <Input
                      id="name"
                      value={certificationForm.name}
                      onChange={(e) => setCertificationForm({ ...certificationForm, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="issuer" className="text-right">
                      الجهة المانحة
                    </Label>
                    <Input
                      id="issuer"
                      value={certificationForm.issuer}
                      onChange={(e) => setCertificationForm({ ...certificationForm, issuer: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="issueDate" className="text-right">
                      تاريخ الإصدار
                    </Label>
                    <Input
                      id="issueDate"
                      type="month"
                      value={certificationForm.issueDate}
                      onChange={(e) => setCertificationForm({ ...certificationForm, issueDate: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiryDate" className="text-right">
                      تاريخ الانتهاء (اختياري)
                    </Label>
                    <Input
                      id="expiryDate"
                      type="month"
                      value={certificationForm.expiryDate}
                      onChange={(e) => setCertificationForm({ ...certificationForm, expiryDate: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="document" className="text-right">
                      المستند
                    </Label>
                    <div className="col-span-3">
                      <FileUpload
                        onFileUpload={(file) => handleFileUpload(file, "certification", "document")}
                        acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                        maxFileSize={5}
                      />
                      {certificationForm.document && (
                        <p className="text-sm text-muted-foreground mt-2">الملف المرفق: {certificationForm.document}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCertificationDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSubmitCertification}>{isEditing ? "تحديث" : "إضافة"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {qualifications.certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualifications.certifications.map((certification) => (
                <Card key={certification.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{certification.name}</CardTitle>
                    <CardDescription>
                      {certification.issuer} | {certification.issueDate}
                      {certification.expiryDate && ` - ${certification.expiryDate}`}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCertification(certification.id)}>
                        <Pencil className="ml-2 h-4 w-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteCertification(certification.id)}
                      >
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                    {certification.document && (
                      <Button variant="ghost" size="sm">
                        <FileText className="ml-2 h-4 w-4" />
                        عرض المستند
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">لا توجد شهادات مهنية مضافة</p>
                <Button onClick={() => setCertificationDialogOpen(true)}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة شهادة مهنية
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
