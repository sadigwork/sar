"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Trash2, Download, Eye } from "lucide-react"
// import { SupabaseFileUpload } from "@/components/supabase-file-upload"
import { useToast } from "@/hooks/use-toast"
// import { createClientComponentClient } from "@/lib/supabase/client"

interface Document {
  id: string
  type: string
  name: string
  file_url: string
  file_size?: number
  mime_type?: string
  upload_date: string
  status: "pending" | "verified" | "rejected"
}

interface DocumentsFormProps {
  data: Document[]
  updateData: (data: Document[]) => void
  applicationId?: string
}

export function DocumentsForm({ data, updateData, applicationId }: DocumentsFormProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [documentType, setDocumentType] = useState("")
  const [uploading, setUploading] = useState(false)
  // const supabase = createClientComponentClient()

  const handleFileUpload = async (url: string, fileData: any) => {
    if (!documentType) {
      toast({
        title: t("language") === "en" ? "Error" : "خطأ",
        description: t("language") === "en" ? "Please select document type first" : "يرجى اختيار نوع المستند أولاً",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      const newDocument: Document = {
        id: Date.now().toString(),
        type: documentType,
        name: fileData.name,
        file_url: url,
        file_size: fileData.size,
        mime_type: fileData.type,
        upload_date: new Date().toISOString(),
        status: "pending",
      }

      // If we have an applicationId, save to database
      if (applicationId) {
        const { error } = await supabase.from("documents").insert({
          application_id: applicationId,
          type: documentType,
          name: fileData.name,
          file_url: url,
          file_size: fileData.size,
          mime_type: fileData.type,
          status: "pending",
        })

        if (error) throw error
      }

      updateData([...data, newDocument])
      setDocumentType("")

      toast({
        title: t("language") === "en" ? "Document Uploaded" : "تم رفع المستند",
        description: t("language") === "en" ? "Document uploaded successfully" : "تم رفع المستند بنجاح",
      })
    } catch (error: any) {
      toast({
        title: t("language") === "en" ? "Upload Failed" : "فشل الرفع",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (index: number) => {
    try {
      const document = data[index]

      // Delete from Supabase Storage
      if (document.file_url) {
        const filePath = document.file_url.split("/").pop()
        if (filePath) {
          await supabase.storage.from("documents").remove([`applications/${filePath}`])
        }
      }

      // Delete from database if we have applicationId
      if (applicationId && document.id) {
        await supabase.from("documents").delete().eq("id", document.id)
      }

      const newData = [...data]
      newData.splice(index, 1)
      updateData(newData)

      toast({
        title: t("language") === "en" ? "Document Deleted" : "تم حذف المستند",
        description: t("language") === "en" ? "Document deleted successfully" : "تم حذف المستند بنجاح",
      })
    } catch (error: any) {
      toast({
        title: t("language") === "en" ? "Delete Failed" : "فشل الحذف",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleViewDocument = (document: Document) => {
    window.open(document.file_url, "_blank")
  }

  const handleDownloadDocument = async (document: Document) => {
    try {
      const response = await fetch(document.file_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = document.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: t("language") === "en" ? "Download Failed" : "فشل التحميل",
        description: t("language") === "en" ? "Could not download file" : "لا يمكن تحميل الملف",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(t("language") === "en" ? "en-US" : "ar-SA")
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "id":
        return t("language") === "en" ? "National ID" : "الهوية الوطنية"
      case "degree":
        return t("language") === "en" ? "Degree Certificate" : "شهادة الدرجة العلمية"
      case "experience":
        return t("language") === "en" ? "Experience Certificate" : "شهادة الخبرة"
      case "training":
        return t("language") === "en" ? "Training Certificate" : "شهادة التدريب"
      case "cv":
        return t("language") === "en" ? "CV/Resume" : "السيرة الذاتية"
      case "other":
        return t("language") === "en" ? "Other Document" : "مستند آخر"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: t("language") === "en" ? "Pending" : "قيد الانتظار",
        className: "bg-yellow-100 text-yellow-800",
      },
      verified: {
        label: t("language") === "en" ? "Verified" : "تم التحقق",
        className: "bg-green-100 text-green-800",
      },
      rejected: {
        label: t("language") === "en" ? "Rejected" : "مرفوض",
        className: "bg-red-100 text-red-800",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>{config.label}</span>
  }

  return (
    <div className="space-y-6">
      {data.length > 0 && (
        <div className="grid gap-4">
          {data.map((document, index) => (
            <Card key={document.id} className="bg-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <FileText className="h-8 w-8 mt-1 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{getDocumentTypeLabel(document.type)}</h3>
                      <p className="text-sm text-muted-foreground truncate">{document.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {t("language") === "en" ? "Uploaded: " : "تم الرفع: "}
                          {formatDate(document.upload_date)}
                        </span>
                        {document.file_size && <span>{formatFileSize(document.file_size)}</span>}
                        {getStatusBadge(document.status)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(document)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Upload New Document" : "رفع مستند جديد"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">{t("language") === "en" ? "Document Type" : "نوع المستند"}</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="documentType">
                <SelectValue placeholder={t("language") === "en" ? "Select document type" : "اختر نوع المستند"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">{t("language") === "en" ? "National ID" : "الهوية الوطنية"}</SelectItem>
                <SelectItem value="degree">
                  {t("language") === "en" ? "Degree Certificate" : "شهادة الدرجة العلمية"}
                </SelectItem>
                <SelectItem value="experience">
                  {t("language") === "en" ? "Experience Certificate" : "شهادة الخبرة"}
                </SelectItem>
                <SelectItem value="training">
                  {t("language") === "en" ? "Training Certificate" : "شهادة التدريب"}
                </SelectItem>
                <SelectItem value="cv">{t("language") === "en" ? "CV/Resume" : "السيرة الذاتية"}</SelectItem>
                <SelectItem value="other">{t("language") === "en" ? "Other Document" : "مستند آخر"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {documentType && (
            <SupabaseFileUpload
              bucket="documents"
              folder={applicationId ? `applications/${applicationId}` : "temp"}
              onUploadComplete={handleFileUpload}
              acceptedFileTypes="image/*,application/pdf,.doc,.docx"
              maxSizeMB={10}
              className="w-full"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
