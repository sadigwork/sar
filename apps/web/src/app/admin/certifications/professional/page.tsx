"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Check, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"

// Mock data for professional certifications
const mockCertifications = [
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
    isActive: true,
    createdAt: "2023-05-15",
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
    isActive: true,
    createdAt: "2023-06-20",
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
    isActive: false,
    createdAt: "2023-08-10",
  },
]

export default function ProfessionalCertificationsPage() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [certifications, setCertifications] = useState(mockCertifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCertification, setCurrentCertification] = useState<any>(null)
  const [newRequirement, setNewRequirement] = useState({ nameEn: "", nameAr: "" })

  // Filter certifications based on search query
  const filteredCertifications = certifications.filter(
    (cert) => cert.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || cert.nameAr.includes(searchQuery),
  )

  const handleAddCertification = () => {
    const newCertification = {
      id: `cert${certifications.length + 1}`,
      nameEn: currentCertification.nameEn,
      nameAr: currentCertification.nameAr,
      descriptionEn: currentCertification.descriptionEn,
      descriptionAr: currentCertification.descriptionAr,
      requirements: currentCertification.requirements || [],
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setCertifications([...certifications, newCertification])
    setIsAddDialogOpen(false)
    setCurrentCertification(null)

    toast({
      title: language === "en" ? "Certification Added" : "تمت إضافة الشهادة",
      description: language === "en" ? "The certification has been added successfully" : "تمت إضافة الشهادة بنجاح",
    })
  }

  const handleEditCertification = () => {
    const updatedCertifications = certifications.map((cert) =>
      cert.id === currentCertification.id ? currentCertification : cert,
    )

    setCertifications(updatedCertifications)
    setIsEditDialogOpen(false)
    setCurrentCertification(null)

    toast({
      title: language === "en" ? "Certification Updated" : "تم تحديث الشهادة",
      description: language === "en" ? "The certification has been updated successfully" : "تم تحديث الشهادة بنجاح",
    })
  }

  const handleDeleteCertification = () => {
    const updatedCertifications = certifications.filter((cert) => cert.id !== currentCertification.id)

    setCertifications(updatedCertifications)
    setIsDeleteDialogOpen(false)
    setCurrentCertification(null)

    toast({
      title: language === "en" ? "Certification Deleted" : "تم حذف الشهادة",
      description: language === "en" ? "The certification has been deleted successfully" : "تم حذف الشهادة بنجاح",
    })
  }

  const handleToggleStatus = (id: string) => {
    const updatedCertifications = certifications.map((cert) =>
      cert.id === id ? { ...cert, isActive: !cert.isActive } : cert,
    )

    setCertifications(updatedCertifications)

    toast({
      title: language === "en" ? "Status Updated" : "تم تحديث الحالة",
      description: language === "en" ? "The certification status has been updated" : "تم تحديث حالة الشهادة",
    })
  }

  const handleAddRequirement = () => {
    if (!newRequirement.nameEn || !newRequirement.nameAr) return

    const updatedRequirements = [
      ...(currentCertification.requirements || []),
      {
        id: `req${Date.now()}`,
        nameEn: newRequirement.nameEn,
        nameAr: newRequirement.nameAr,
      },
    ]

    setCurrentCertification({
      ...currentCertification,
      requirements: updatedRequirements,
    })

    setNewRequirement({ nameEn: "", nameAr: "" })
  }

  const handleRemoveRequirement = (reqId: string) => {
    const updatedRequirements = currentCertification.requirements.filter((req: any) => req.id !== reqId)

    setCurrentCertification({
      ...currentCertification,
      requirements: updatedRequirements,
    })
  }

  const openAddDialog = () => {
    setCurrentCertification({
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      requirements: [],
    })
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (certification: any) => {
    setCurrentCertification({ ...certification })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (certification: any) => {
    setCurrentCertification(certification)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "en" ? "Professional Certifications" : "الشهادات المهنية"}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Manage professional certifications for agricultural engineers"
              : "إدارة الشهادات المهنية للمهندسين الزراعيين"}
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-gradient-green hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          {language === "en" ? "Add Certification" : "إضافة شهادة"}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{language === "en" ? "Certifications" : "الشهادات"}</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "en" ? "Search certifications..." : "البحث عن الشهادات..."}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "en" ? "Name" : "الاسم"}</TableHead>
                <TableHead>{language === "en" ? "Description" : "الوصف"}</TableHead>
                <TableHead>{language === "en" ? "Requirements" : "المتطلبات"}</TableHead>
                <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                <TableHead>{language === "en" ? "Created" : "تاريخ الإنشاء"}</TableHead>
                <TableHead className="text-right">{language === "en" ? "Actions" : "الإجراءات"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    {language === "en" ? "No certifications found" : "لم يتم العثور على شهادات"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCertifications.map((certification) => (
                  <TableRow key={certification.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        {language === "en" ? certification.nameEn : certification.nameAr}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {language === "en" ? certification.descriptionEn : certification.descriptionAr}
                    </TableCell>
                    <TableCell>{certification.requirements.length}</TableCell>
                    <TableCell>
                      <Badge
                        variant={certification.isActive ? "default" : "outline"}
                        className={
                          certification.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
                            : ""
                        }
                      >
                        {certification.isActive
                          ? language === "en"
                            ? "Active"
                            : "نشط"
                          : language === "en"
                            ? "Inactive"
                            : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>{certification.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{language === "en" ? "Actions" : "الإجراءات"}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(certification)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {language === "en" ? "Edit" : "تعديل"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(certification.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            {certification.isActive
                              ? language === "en"
                                ? "Set as Inactive"
                                : "تعيين كغير نشط"
                              : language === "en"
                                ? "Set as Active"
                                : "تعيين كنشط"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => openDeleteDialog(certification)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {language === "en" ? "Delete" : "حذف"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Certification Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Add New Certification" : "إضافة شهادة جديدة"}</DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Create a new professional certification for agricultural engineers."
                : "إنشاء شهادة مهنية جديدة للمهندسين الزراعيين."}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">{language === "en" ? "General Information" : "معلومات عامة"}</TabsTrigger>
              <TabsTrigger value="requirements">{language === "en" ? "Requirements" : "المتطلبات"}</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">{language === "en" ? "Name (English)" : "الاسم (بالإنجليزية)"}</Label>
                  <Input
                    id="nameEn"
                    value={currentCertification?.nameEn || ""}
                    onChange={(e) => setCurrentCertification({ ...currentCertification, nameEn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">{language === "en" ? "Name (Arabic)" : "الاسم (بالعربية)"}</Label>
                  <Input
                    id="nameAr"
                    value={currentCertification?.nameAr || ""}
                    onChange={(e) => setCurrentCertification({ ...currentCertification, nameAr: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">
                    {language === "en" ? "Description (English)" : "الوصف (بالإنجليزية)"}
                  </Label>
                  <Textarea
                    id="descriptionEn"
                    value={currentCertification?.descriptionEn || ""}
                    onChange={(e) =>
                      setCurrentCertification({ ...currentCertification, descriptionEn: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">
                    {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    value={currentCertification?.descriptionAr || ""}
                    onChange={(e) =>
                      setCurrentCertification({ ...currentCertification, descriptionAr: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="isActive"
                    checked={currentCertification?.isActive !== false}
                    onCheckedChange={(checked) =>
                      setCurrentCertification({ ...currentCertification, isActive: !!checked })
                    }
                  />
                  <Label htmlFor="isActive">{language === "en" ? "Active Certification" : "شهادة نشطة"}</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reqNameEn">
                      {language === "en" ? "Requirement (English)" : "المتطلب (بالإنجليزية)"}
                    </Label>
                    <Input
                      id="reqNameEn"
                      value={newRequirement.nameEn}
                      onChange={(e) => setNewRequirement({ ...newRequirement, nameEn: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reqNameAr">
                      {language === "en" ? "Requirement (Arabic)" : "المتطلب (بالعربية)"}
                    </Label>
                    <Input
                      id="reqNameAr"
                      value={newRequirement.nameAr}
                      onChange={(e) => setNewRequirement({ ...newRequirement, nameAr: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRequirement}
                  disabled={!newRequirement.nameEn || !newRequirement.nameAr}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Requirement" : "إضافة متطلب"}
                </Button>

                <div className="space-y-2">
                  <Label>{language === "en" ? "Requirements List" : "قائمة المتطلبات"}</Label>
                  {currentCertification?.requirements?.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      {language === "en" ? "No requirements added yet" : "لم تتم إضافة متطلبات بعد"}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentCertification?.requirements?.map((req: any) => (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/50"
                        >
                          <span>{language === "en" ? req.nameEn : req.nameAr}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRequirement(req.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{language === "en" ? "Remove" : "إزالة"}</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              {language === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button onClick={handleAddCertification} className="bg-gradient-green hover:opacity-90">
              {language === "en" ? "Add Certification" : "إضافة شهادة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Certification Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Edit Certification" : "تعديل الشهادة"}</DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Update the certification details and requirements."
                : "تحديث تفاصيل ومتطلبات الشهادة."}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">{language === "en" ? "General Information" : "معلومات عامة"}</TabsTrigger>
              <TabsTrigger value="requirements">{language === "en" ? "Requirements" : "المتطلبات"}</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nameEn">{language === "en" ? "Name (English)" : "الاسم (بالإنجليزية)"}</Label>
                  <Input
                    id="edit-nameEn"
                    value={currentCertification?.nameEn || ""}
                    onChange={(e) => setCurrentCertification({ ...currentCertification, nameEn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-nameAr">{language === "en" ? "Name (Arabic)" : "الاسم (بالعربية)"}</Label>
                  <Input
                    id="edit-nameAr"
                    value={currentCertification?.nameAr || ""}
                    onChange={(e) => setCurrentCertification({ ...currentCertification, nameAr: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-descriptionEn">
                    {language === "en" ? "Description (English)" : "الوصف (بالإنجليزية)"}
                  </Label>
                  <Textarea
                    id="edit-descriptionEn"
                    value={currentCertification?.descriptionEn || ""}
                    onChange={(e) =>
                      setCurrentCertification({ ...currentCertification, descriptionEn: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-descriptionAr">
                    {language === "en" ? "Description (Arabic)" : "الوصف (بالعربية)"}
                  </Label>
                  <Textarea
                    id="edit-descriptionAr"
                    value={currentCertification?.descriptionAr || ""}
                    onChange={(e) =>
                      setCurrentCertification({ ...currentCertification, descriptionAr: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="edit-isActive"
                    checked={currentCertification?.isActive}
                    onCheckedChange={(checked) =>
                      setCurrentCertification({ ...currentCertification, isActive: !!checked })
                    }
                  />
                  <Label htmlFor="edit-isActive">{language === "en" ? "Active Certification" : "شهادة نشطة"}</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-reqNameEn">
                      {language === "en" ? "Requirement (English)" : "المتطلب (بالإنجليزية)"}
                    </Label>
                    <Input
                      id="edit-reqNameEn"
                      value={newRequirement.nameEn}
                      onChange={(e) => setNewRequirement({ ...newRequirement, nameEn: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-reqNameAr">
                      {language === "en" ? "Requirement (Arabic)" : "المتطلب (بالعربية)"}
                    </Label>
                    <Input
                      id="edit-reqNameAr"
                      value={newRequirement.nameAr}
                      onChange={(e) => setNewRequirement({ ...newRequirement, nameAr: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRequirement}
                  disabled={!newRequirement.nameEn || !newRequirement.nameAr}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Requirement" : "إضافة متطلب"}
                </Button>

                <div className="space-y-2">
                  <Label>{language === "en" ? "Requirements List" : "قائمة المتطلبات"}</Label>
                  {currentCertification?.requirements?.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      {language === "en" ? "No requirements added yet" : "لم تتم إضافة متطلبات بعد"}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentCertification?.requirements?.map((req: any) => (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/50"
                        >
                          <span>{language === "en" ? req.nameEn : req.nameAr}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRequirement(req.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{language === "en" ? "Remove" : "إزالة"}</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {language === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button onClick={handleEditCertification} className="bg-gradient-green hover:opacity-90">
              {language === "en" ? "Save Changes" : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Delete Certification" : "حذف الشهادة"}</DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Are you sure you want to delete this certification? This action cannot be undone."
                : "هل أنت متأكد من رغبتك في حذف هذه الشهادة؟ لا يمكن التراجع عن هذا الإجراء."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {language === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button variant="destructive" onClick={handleDeleteCertification}>
              {language === "en" ? "Delete" : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}