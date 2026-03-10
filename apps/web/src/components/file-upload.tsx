"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onUpload: (file: { name: string; type: string }) => void
  acceptedFileTypes?: string
  maxFileSizeMB?: number
}

export function FileUpload({
  onUpload,
  acceptedFileTypes = ".pdf,.jpg,.jpeg,.png",
  maxFileSizeMB = 5,
}: FileUploadProps) {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check file type
    const fileType = file.type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`

    if (!acceptedFileTypes.includes(fileExtension) && !acceptedFileTypes.includes(fileType)) {
      toast({
        title: language === "en" ? "Invalid File Type" : "نوع ملف غير صالح",
        description:
          language === "en"
            ? `Please upload a file with one of these formats: ${acceptedFileTypes}`
            : `يرجى تحميل ملف بأحد هذه التنسيقات: ${acceptedFileTypes}`,
        variant: "destructive",
      })
      return
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSizeMB) {
      toast({
        title: language === "en" ? "File Too Large" : "الملف كبير جدًا",
        description:
          language === "en"
            ? `File size should not exceed ${maxFileSizeMB}MB`
            : `يجب ألا يتجاوز حجم الملف ${maxFileSizeMB} ميجابايت`,
        variant: "destructive",
      })
      return
    }

    // Simulate upload
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onUpload({ name: file.name, type: file.type })
          return 0
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          accept={acceptedFileTypes}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col space-y-1 text-center">
            <p className="text-sm font-medium">
              {language === "en" ? "Drag & drop files here" : "اسحب وأفلت الملفات هنا"}
            </p>
            <p className="text-xs text-muted-foreground">
              {language === "en"
                ? `Supported formats: ${acceptedFileTypes} (Max: ${maxFileSizeMB}MB)`
                : `التنسيقات المدعومة: ${acceptedFileTypes} (الحد الأقصى: ${maxFileSizeMB} ميجابايت)`}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {language === "en" ? "Select File" : "اختر ملفًا"}
          </Button>
        </div>
      </div>

      {isUploading && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{language === "en" ? "Uploading..." : "جارٍ التحميل..."}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsUploading(false)
                setUploadProgress(0)
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{language === "en" ? "Cancel" : "إلغاء"}</span>
            </Button>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  )
}
