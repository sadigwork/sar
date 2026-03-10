"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CertificationLevel {
  id: string
  name: string
  nameAr: string
  minYears: number
  maxYears: number
  description: string
  descriptionAr: string
}

export default function CertificationLevelsPage() {
  const { t, language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [levels, setLevels] = useState<CertificationLevel[]>([
    {
      id: "1",
      name: "Entry Level",
      nameAr: "مستوى المبتدئ",
      minYears: 0,
      maxYears: 2,
      description: "For agricultural engineers with 0-2 years of experience",
      descriptionAr: "للمهندسين الزراعيين ذوي خبرة 0-2 سنوات",
    },
    {
      id: "2",
      name: "Intermediate",
      nameAr: "متوسط",
      minYears: 3,
      maxYears: 5,
      description: "For agricultural engineers with 3-5 years of experience",
      descriptionAr: "للمهندسين الزراعيين ذوي خبرة 3-5 سنوات",
    },
    {
      id: "3",
      name: "Advanced",
      nameAr: "متقدم",
      minYears: 6,
      maxYears: 8,
      description: "For agricultural engineers with 6-8 years of experience",
      descriptionAr: "للمهندسين الزراعيين ذوي خبرة 6-8 سنوات",
    },
    {
      id: "4",
      name: "Expert",
      nameAr: "خبير",
      minYears: 9,
      maxYears: 12,
      description: "For agricultural engineers with 9-12 years of experience",
      descriptionAr: "للمهندسين الزراعيين ذوي خبرة 9-12 سنة",
    },
    {
      id: "5",
      name: "Senior Expert",
      nameAr: "خبير متقدم",
      minYears: 13,
      maxYears: 16,
      description: "For agricultural engineers with 13-16 years of experience",
      descriptionAr: "للمهندسين الزراعيين ذوي خبرة 13-16 سنة",
    },
    {
      id: "6",
      name: "Consultant",
      nameAr: "استشاري",
      minYears: 17,
      maxYears: 100,
      description: "For agricultural engineers with 17+ years of experience",
      descriptionAr: "للمهندسين الزراعيين ذوي خبرة 17+ سنة",
    },
  ])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<CertificationLevel | null>(null)
  const [formData, setFormData] = useState<CertificationLevel>({
    id: "",
    name: "",
    nameAr: "",
    minYears: 0,
    maxYears: 0,
    description: "",
    descriptionAr: "",
  })

  // Check if user is logged in and is an admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "admin") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const handleAddLevel = () => {
    setEditingLevel(null)
    setFormData({
      id: Date.now().toString(),
      name: "",
      nameAr: "",
      minYears: 0,
      maxYears: 0,
      description: "",
      descriptionAr: "",
    })
    setDialogOpen(true)
  }

  const handleEditLevel = (level: CertificationLevel) => {
    setEditingLevel(level)
    setFormData({ ...level })
    setDialogOpen(true)
  }

  const handleDeleteLevel = (id: string) => {
    setLevels(levels.filter((level) => level.id !== id))
    toast({
      title: t("language") === "en" ? "Level Deleted" : "تم حذف المستوى",
      description:
        t("language") === "en" ? "The certification level has been deleted successfully" : "تم حذف مستوى الشهادة بنجاح",
    })
  }

  const handleSaveLevel = () => {
    if (editingLevel) {
      // Update existing level
      setLevels(levels.map((level) => (level.id === editingLevel.id ? formData : level)))
      toast({
        title: t("language") === "en" ? "Level Updated" : "تم تحديث المستوى",
        description:
          t("language") === "en"
            ? "The certification level has been updated successfully"
            : "تم تحديث مستوى الشهادة بنجاح",
      })
    } else {
      // Add new level
      setLevels([...levels, formData])
      toast({
        title: t("language") === "en" ? "Level Added" : "تمت إضافة المستوى",
        description:
          t("language") === "en"
            ? "The certification level has been added successfully"
            : "تمت إضافة مستوى الشهادة بنجاح",
      })
    }
    setDialogOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "minYears" || name === "maxYears" ? Number.parseInt(value) : value,
    })
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("language") === "en" ? "Certification Levels" : "مستويات الشهادات"}
          </h1>
          <p className="text-muted-foreground">
            {t("language") === "en"
              ? "Manage certification levels for agricultural engineers"
              : "إدارة مستويات الشهادات للمهندسين الزراعيين"}
          </p>
        </div>
        <Button onClick={handleAddLevel} className="bg-gradient-green hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          {t("language") === "en" ? "Add Level" : "إضافة مستوى"}
        </Button>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Certification Levels" : "مستويات الشهادات"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("language") === "en" ? "Level Name" : "اسم المستوى"}</TableHead>
                <TableHead>{t("language") === "en" ? "Experience Range" : "نطاق الخبرة"}</TableHead>
                <TableHead>{t("language") === "en" ? "Description" : "الوصف"}</TableHead>
                <TableHead className="text-right">{t("language") === "en" ? "Actions" : "الإجراءات"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell className="font-medium">{language === "en" ? level.name : level.nameAr}</TableCell>
                  <TableCell>
                    {level.minYears}-{level.maxYears === 100 ? "+" : level.maxYears}{" "}
                    {t("language") === "en" ? "years" : "سنوات"}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {language === "en" ? level.description : level.descriptionAr}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditLevel(level)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t("language") === "en" ? "Edit" : "تعديل"}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLevel(level.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t("language") === "en" ? "Delete" : "حذف"}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLevel
                ? t("language") === "en"
                  ? "Edit Certification Level"
                  : "تعديل مستوى الشهادة"
                : t("language") === "en"
                  ? "Add Certification Level"
                  : "إضافة مستوى شهادة"}
            </DialogTitle>
            <DialogDescription>
              {t("language") === "en"
                ? "Define the certification level details for agricultural engineers"
                : "تحديد تفاصيل مستوى الشهادة للمهندسين الزراعيين"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t("language") === "en" ? "Level Name (English)" : "اسم المستوى (بالإنجليزية)"}
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("language") === "en" ? "e.g. Expert" : "مثال: Expert"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">
                  {t("language") === "en" ? "Level Name (Arabic)" : "اسم المستوى (بالعربية)"}
                </Label>
                <Input
                  id="nameAr"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                  placeholder={t("language") === "en" ? "e.g. خبير" : "مثال: خبير"}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minYears">
                  {t("language") === "en" ? "Minimum Years of Experience" : "الحد الأدنى لسنوات الخبرة"}
                </Label>
                <Input
                  id="minYears"
                  name="minYears"
                  type="number"
                  min="0"
                  value={formData.minYears}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxYears">
                  {t("language") === "en" ? "Maximum Years of Experience" : "الحد الأقصى لسنوات الخبرة"}
                </Label>
                <Input
                  id="maxYears"
                  name="maxYears"
                  type="number"
                  min="0"
                  value={formData.maxYears}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                {t("language") === "en" ? "Description (English)" : "الوصف (بالإنجليزية)"}
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={
                  t("language") === "en"
                    ? "e.g. For agricultural engineers with 9-12 years of experience"
                    : "مثال: For agricultural engineers with 9-12 years of experience"
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionAr">
                {t("language") === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
              </Label>
              <Input
                id="descriptionAr"
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleChange}
                placeholder={
                  t("language") === "en"
                    ? "e.g. للمهندسين الزراعيين ذوي خبرة 9-12 سنة"
                    : "مثال: للمهندسين الزراعيين ذوي خبرة 9-12 سنة"
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("language") === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button onClick={handleSaveLevel} className="bg-gradient-green hover:opacity-90">
              <Save className="mr-2 h-4 w-4" />
              {t("language") === "en" ? "Save" : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}