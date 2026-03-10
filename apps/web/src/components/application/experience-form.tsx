"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface Experience {
  id: string
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
}

interface ExperienceFormProps {
  data: Experience[]
  updateData: (data: Experience[]) => void
}

export function ExperienceForm({ data, updateData }: ExperienceFormProps) {
  const { t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [formState, setFormState] = useState<Experience>({
    id: "",
    position: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  })

  const handleAddExperience = () => {
    setEditIndex(null)
    setFormState({
      id: Date.now().toString(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    })
    setDialogOpen(true)
  }

  const handleEditExperience = (index: number) => {
    setEditIndex(index)
    setFormState(data[index])
    setDialogOpen(true)
  }

  const handleDeleteExperience = (index: number) => {
    const newData = [...data]
    newData.splice(index, 1)
    updateData(newData)
  }

  const handleSaveExperience = () => {
    if (editIndex !== null) {
      // Edit existing experience
      const newData = [...data]
      newData[editIndex] = formState
      updateData(newData)
    } else {
      // Add new experience
      updateData([...data, formState])
    }
    setDialogOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(t("language") === "en" ? "en-US" : "ar-SA", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <div className="space-y-4">
      {data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((experience, index) => (
            <Card key={experience.id} className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle>{experience.position}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm">
                    {experience.company}, {experience.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(experience.startDate)} -{" "}
                    {experience.currentlyWorking
                      ? t("language") === "en"
                        ? "Present"
                        : "الحالي"
                      : formatDate(experience.endDate)}
                  </p>
                  <p className="text-sm mt-2">{experience.description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditExperience(index)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  {t("language") === "en" ? "Edit" : "تعديل"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteExperience(index)}
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
            {t("language") === "en" ? "No work experience added yet" : "لم تتم إضافة خبرة عملية بعد"}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button onClick={handleAddExperience} className="bg-gradient-green hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          {t("language") === "en" ? "Add Experience" : "إضافة خبرة"}
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null
                ? t("language") === "en"
                  ? "Edit Experience"
                  : "تعديل الخبرة"
                : t("language") === "en"
                  ? "Add Experience"
                  : "إضافة خبرة"}
            </DialogTitle>
            <DialogDescription>
              {t("language") === "en" ? "Enter your work experience details" : "أدخل تفاصيل خبرتك العملية"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="position">{t("language") === "en" ? "Position" : "المنصب"}</Label>
              <Input
                id="position"
                name="position"
                value={formState.position}
                onChange={handleChange}
                placeholder={t("language") === "en" ? "e.g. Agricultural Engineer" : "مثل: مهندس زراعي"}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">{t("language") === "en" ? "Company" : "الشركة"}</Label>
                <Input
                  id="company"
                  name="company"
                  value={formState.company}
                  onChange={handleChange}
                  placeholder={t("language") === "en" ? "Enter company name" : "أدخل اسم الشركة"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t("language") === "en" ? "Location" : "الموقع"}</Label>
                <Input
                  id="location"
                  name="location"
                  value={formState.location}
                  onChange={handleChange}
                  placeholder={t("language") === "en" ? "City, Country" : "المدينة، الدولة"}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t("language") === "en" ? "Start Date" : "تاريخ البدء"}</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="month"
                  value={formState.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endDate">{t("language") === "en" ? "End Date" : "تاريخ الانتهاء"}</Label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="currentlyWorking"
                      name="currentlyWorking"
                      checked={formState.currentlyWorking}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <Label htmlFor="currentlyWorking" className="text-sm font-normal">
                      {t("language") === "en" ? "Currently working here" : "أعمل هنا حاليًا"}
                    </Label>
                  </div>
                </div>
                <Input
                  id="endDate"
                  name="endDate"
                  type="month"
                  value={formState.endDate}
                  onChange={handleChange}
                  disabled={formState.currentlyWorking}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("language") === "en" ? "Description" : "الوصف"}</Label>
              <Textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder={
                  t("language") === "en" ? "Describe your responsibilities and achievements" : "صف مسؤولياتك وإنجازاتك"
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("language") === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button onClick={handleSaveExperience} className="bg-gradient-green hover:opacity-90">
              {t("language") === "en" ? "Save" : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
