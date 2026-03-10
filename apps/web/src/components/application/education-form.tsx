"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, Plus, Trash2 } from "lucide-react"

interface Education {
  id: string
  degree: string
  field: string
  institution: string
  country: string
  startYear: string
  endYear: string
  inProgress: boolean
}

interface EducationFormProps {
  data: Education[]
  updateData: (data: Education[]) => void
}

export function EducationForm({ data, updateData }: EducationFormProps) {
  const { t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formState, setFormState] = useState<Education>({
    id: "",
    degree: "",
    field: "",
    institution: "",
    country: "",
    startYear: "",
    endYear: "",
    inProgress: false,
  })

  const handleAddEducation = () => {
    setEditIndex(null)
    setFormState({
      id: Date.now().toString(),
      degree: "",
      field: "",
      institution: "",
      country: "",
      startYear: "",
      endYear: "",
      inProgress: false,
    })
    setDialogOpen(true)
  }

  const handleEditEducation = (index: number) => {
    setEditIndex(index)
    setFormState(data[index])
    setDialogOpen(true)
  }

  const handleDeleteEducation = (index: number) => {
    const newData = [...data]
    newData.splice(index, 1)
    updateData(newData)
  }

  const handleSaveEducation = () => {
    if (editIndex !== null) {
      // Edit existing education
      const newData = [...data]
      newData[editIndex] = formState
      updateData(newData)
    } else {
      // Add new education
      updateData([...data, formState])
    }
    setDialogOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  // Generate years for dropdown (from 1950 to current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => (currentYear - i).toString())

  return (
    <div className="space-y-4">
      {data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((education, index) => (
            <Card key={education.id} className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle>
                  {education.degree} {t("language") === "en" ? "in" : "في"} {education.field}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm">
                    {education.institution}, {education.country}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {education.startYear} -{" "}
                    {education.inProgress ? (t("language") === "en" ? "Present" : "الحالي") : education.endYear}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditEducation(index)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  {t("language") === "en" ? "Edit" : "تعديل"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteEducation(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("language") === "en" ? "Delete" : "حذف"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            {t("language") === "en" ? "No educational qualifications added yet" : "لم تتم إضافة مؤهلات تعليمية بعد"}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button onClick={handleAddEducation} className="bg-gradient-green hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          {t("language") === "en" ? "Add Education" : "إضافة تعليم"}
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null
                ? t("language") === "en"
                  ? "Edit Education"
                  : "تعديل التعليم"
                : t("language") === "en"
                  ? "Add Education"
                  : "إضافة تعليم"}
            </DialogTitle>
            <DialogDescription>
              {t("language") === "en" ? "Enter your educational qualification details" : "أدخل تفاصيل مؤهلك التعليمي"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">{t("language") === "en" ? "Degree" : "الدرجة العلمية"}</Label>
                <Select value={formState.degree} onValueChange={(value) => handleSelectChange("degree", value)}>
                  <SelectTrigger id="degree">
                    <SelectValue placeholder={t("language") === "en" ? "Select degree" : "اختر الدرجة العلمية"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">
                      {t("language") === "en" ? "Bachelor's Degree" : "بكالوريوس"}
                    </SelectItem>
                    <SelectItem value="master">{t("language") === "en" ? "Master's Degree" : "ماجستير"}</SelectItem>
                    <SelectItem value="phd">{t("language") === "en" ? "PhD" : "دكتوراه"}</SelectItem>
                    <SelectItem value="diploma">{t("language") === "en" ? "Diploma" : "دبلوم"}</SelectItem>
                    <SelectItem value="certificate">{t("language") === "en" ? "Certificate" : "شهادة"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">{t("language") === "en" ? "Field of Study" : "مجال الدراسة"}</Label>
                <Input
                  id="field"
                  name="field"
                  value={formState.field}
                  onChange={handleChange}
                  placeholder={t("language") === "en" ? "e.g. Agricultural Engineering" : "مثل: الهندسة الزراعية"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">{t("language") === "en" ? "Institution" : "المؤسسة التعليمية"}</Label>
              <Input
                id="institution"
                name="institution"
                value={formState.institution}
                onChange={handleChange}
                placeholder={t("language") === "en" ? "Enter institution name" : "أدخل اسم المؤسسة التعليمية"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t("language") === "en" ? "Country" : "الدولة"}</Label>
              <Select value={formState.country} onValueChange={(value) => handleSelectChange("country", value)}>
                <SelectTrigger id="country">
                  <SelectValue placeholder={t("language") === "en" ? "Select country" : "اختر الدولة"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saudi_arabia">
                    {t("language") === "en" ? "Saudi Arabia" : "المملكة العربية السعودية"}
                  </SelectItem>
                  <SelectItem value="egypt">{t("language") === "en" ? "Egypt" : "مصر"}</SelectItem>
                  <SelectItem value="uae">
                    {t("language") === "en" ? "United Arab Emirates" : "الإمارات العربية المتحدة"}
                  </SelectItem>
                  <SelectItem value="kuwait">{t("language") === "en" ? "Kuwait" : "الكويت"}</SelectItem>
                  <SelectItem value="bahrain">{t("language") === "en" ? "Bahrain" : "البحرين"}</SelectItem>
                  <SelectItem value="qatar">{t("language") === "en" ? "Qatar" : "قطر"}</SelectItem>
                  <SelectItem value="oman">{t("language") === "en" ? "Oman" : "عمان"}</SelectItem>
                  <SelectItem value="jordan">{t("language") === "en" ? "Jordan" : "الأردن"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startYear">{t("language") === "en" ? "Start Year" : "سنة البدء"}</Label>
                <Select value={formState.startYear} onValueChange={(value) => handleSelectChange("startYear", value)}>
                  <SelectTrigger id="startYear">
                    <SelectValue placeholder={t("language") === "en" ? "Select year" : "اختر السنة"} />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endYear">{t("language") === "en" ? "End Year" : "سنة الانتهاء"}</Label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="inProgress"
                      name="inProgress"
                      checked={formState.inProgress}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <Label htmlFor="inProgress" className="text-sm font-normal">
                      {t("language") === "en" ? "Currently studying" : "أدرس حاليًا"}
                    </Label>
                  </div>
                </div>
                <Select
                  value={formState.endYear}
                  onValueChange={(value) => handleSelectChange("endYear", value)}
                  disabled={formState.inProgress}
                >
                  <SelectTrigger id="endYear">
                    <SelectValue placeholder={t("language") === "en" ? "Select year" : "اختر السنة"} />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("language") === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button onClick={handleSaveEducation} className="bg-gradient-green hover:opacity-90">
              {t("language") === "en" ? "Save" : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
