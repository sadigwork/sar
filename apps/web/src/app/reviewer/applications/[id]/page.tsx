"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, FileText, ArrowLeft, Clock, AlertCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

// Types imported from our data layer
import type { ApplicationWithDetails } from "@/lib/data/applications"
import type { Education, Experience, Training, Document } from "@/lib/data/verification"

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { language, t } = useLanguage()
  const [application, setApplication] = useState<ApplicationWithDetails | null>(null)
  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [training, setTraining] = useState<Training[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [verificationHistory, setVerificationHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<{
    id: string
    type: "education" | "experience" | "training" | "document"
    name: string
  } | null>(null)
  const [verificationNote, setVerificationNote] = useState("")
  const [documentPreview, setDocumentPreview] = useState<{
    url: string
    name: string
  } | null>(null)

  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = "r1111111-1111-1111-1111-111111111111"

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true)

        // Fetch application details
        const appResponse = await fetch(`/api/applications/${params.id}`)
        if (!appResponse.ok) throw new Error("Failed to fetch application")
        const appData = await appResponse.json()
        setApplication(appData)

        // Fetch education records
        const eduResponse = await fetch(`/api/applications/${params.id}/education`)
        if (eduResponse.ok) {
          const eduData = await eduResponse.json()
          setEducation(eduData)
        }

        // Fetch experience records
        const expResponse = await fetch(`/api/applications/${params.id}/experience`)
        if (expResponse.ok) {
          const expData = await expResponse.json()
          setExperience(expData)
        }

        // Fetch training records
        const trainingResponse = await fetch(`/api/applications/${params.id}/training`)
        if (trainingResponse.ok) {
          const trainingData = await trainingResponse.json()
          setTraining(trainingData)
        }

        // Fetch documents
        const docsResponse = await fetch(`/api/applications/${params.id}/documents`)
        if (docsResponse.ok) {
          const docsData = await docsResponse.json()
          setDocuments(docsData)
        }

        // Fetch verification history
        const historyResponse = await fetch(`/api/applications/${params.id}/verification-history`)
        if (historyResponse.ok) {
          const historyData = await historyResponse.json()
          setVerificationHistory(historyData)
        }
      } catch (error) {
        console.error("Error fetching application data:", error)
        toast({
          title: t("Error"),
          description: t("Failed to load application data"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchApplicationData()
    }
  }, [params.id, toast, t])

  const handleApprove = async () => {
    try {
      const response = await fetch("/api/applications/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: params.id,
          status: "approved",
          userId: currentUserId,
        }),
      })

      if (!response.ok) throw new Error("Failed to approve application")

      toast({
        title: t("Success"),
        description: t("Application approved successfully"),
      })

      // Update local state
      setApplication((prev) => (prev ? { ...prev, status: "approved" } : null))

      // Refresh verification history
      const historyResponse = await fetch(`/api/applications/${params.id}/verification-history`)
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setVerificationHistory(historyData)
      }
    } catch (error) {
      console.error("Error approving application:", error)
      toast({
        title: t("Error"),
        description: t("Failed to approve application"),
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    try {
      const response = await fetch("/api/applications/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: params.id,
          status: "rejected",
          userId: currentUserId,
          reason: rejectionReason,
        }),
      })

      if (!response.ok) throw new Error("Failed to reject application")

      toast({
        title: t("Success"),
        description: t("Application rejected successfully"),
      })

      // Update local state
      setApplication((prev) =>
        prev
          ? {
              ...prev,
              status: "rejected",
              rejectionReason,
            }
          : null,
      )

      // Close dialog
      setRejectionDialogOpen(false)

      // Refresh verification history
      const historyResponse = await fetch(`/api/applications/${params.id}/verification-history`)
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setVerificationHistory(historyData)
      }
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast({
        title: t("Error"),
        description: t("Failed to reject application"),
        variant: "destructive",
      })
    }
  }

  const handleVerifyItem = async () => {
    if (!currentItem) return

    try {
      const response = await fetch("/api/verification/verify-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemType: currentItem.type,
          itemId: currentItem.id,
          userId: currentUserId,
          notes: verificationNote,
        }),
      })

      if (!response.ok) throw new Error(`Failed to verify ${currentItem.type}`)

      toast({
        title: t("Success"),
        description: t(`${currentItem.name} verified successfully`),
      })

      // Update local state based on item type
      if (currentItem.type === "education") {
        setEducation((prev) =>
          prev.map((item) =>
            item.id === currentItem.id
              ? { ...item, isVerified: true, verifiedBy: currentUserId, verificationDate: new Date() }
              : item,
          ),
        )
      } else if (currentItem.type === "experience") {
        setExperience((prev) =>
          prev.map((item) =>
            item.id === currentItem.id
              ? { ...item, isVerified: true, verifiedBy: currentUserId, verificationDate: new Date() }
              : item,
          ),
        )
      } else if (currentItem.type === "training") {
        setTraining((prev) =>
          prev.map((item) =>
            item.id === currentItem.id
              ? { ...item, isVerified: true, verifiedBy: currentUserId, verificationDate: new Date() }
              : item,
          ),
        )
      } else if (currentItem.type === "document") {
        setDocuments((prev) =>
          prev.map((item) =>
            item.id === currentItem.id
              ? { ...item, isVerified: true, verifiedBy: currentUserId, verificationDate: new Date() }
              : item,
          ),
        )
      }

      // Close dialog and reset state
      setVerifyDialogOpen(false)
      setCurrentItem(null)
      setVerificationNote("")

      // Refresh verification history
      const historyResponse = await fetch(`/api/applications/${params.id}/verification-history`)
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setVerificationHistory(historyData)
      }
    } catch (error) {
      console.error("Error verifying item:", error)
      toast({
        title: t("Error"),
        description: t(`Failed to verify ${currentItem.name}`),
        variant: "destructive",
      })
    }
  }

  const openVerifyDialog = (id: string, type: "education" | "experience" | "training" | "document", name: string) => {
    setCurrentItem({ id, type, name })
    setVerifyDialogOpen(true)
  }

  const viewDocument = (url: string, name: string) => {
    setDocumentPreview({ url, name })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back")}
          </Button>
          <h1 className="text-2xl font-bold">{t("Loading application...")}</h1>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back")}
          </Button>
          <h1 className="text-2xl font-bold">{t("Application not found")}</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium">{t("Application not found")}</h2>
              <p className="text-gray-500 mt-2">
                {t("The requested application could not be found or you do not have permission to view it.")}
              </p>
              <Button className="mt-6" onClick={() => router.push("/reviewer/applications")}>
                {t("View All Applications")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">{t("Approved")}</Badge>
      case "rejected":
        return <Badge variant="destructive">{t("Rejected")}</Badge>
      case "registered":
        return <Badge className="bg-blue-500">{t("Registered")}</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            {t("Pending")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{t("New")}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back")}
        </Button>
        <h1 className="text-2xl font-bold">{t("Application Review")}</h1>
        {getStatusBadge(application.status)}
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Applicant Information")}</CardTitle>
            <CardDescription>
              {t("Submitted on")} {new Date(application.submissionDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{t("Name")}</p>
                <p>{application.userName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t("Email")}</p>
                <p>{application.userEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t("Specialization")}</p>
                <p>{application.specializationName || t("Not specified")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t("Certification Level")}</p>
                <p>{application.certificationLevelName || t("Not specified")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="education" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="education">{t("Education")}</TabsTrigger>
          <TabsTrigger value="experience">{t("Experience")}</TabsTrigger>
          <TabsTrigger value="training">{t("Training")}</TabsTrigger>
          <TabsTrigger value="documents">{t("Documents")}</TabsTrigger>
          <TabsTrigger value="history">{t("Verification History")}</TabsTrigger>
        </TabsList>

        <TabsContent value="education">
          {education.length > 0 ? (
            <div className="grid gap-4">
              {education.map((edu) => (
                <Card key={edu.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{edu.degree}</CardTitle>
                        <CardDescription>{edu.institution}</CardDescription>
                      </div>
                      {edu.isVerified ? (
                        <Badge className="bg-green-500 flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          {t("Verified")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {t("Pending Verification")}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t("Field of Study")}</p>
                        <p>{edu.field}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t("Graduation Year")}</p>
                        <p>{edu.graduationYear}</p>
                      </div>
                    </div>
                    {edu.certificateUrl && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">{t("Certificate")}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1"
                          onClick={() => viewDocument(edu.certificateUrl!, t("Certificate"))}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {t("View Certificate")}
                        </Button>
                      </div>
                    )}
                    {edu.isVerified && edu.verificationNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500">{t("Verification Notes")}</p>
                        <p className="text-sm">{edu.verificationNotes}</p>
                      </div>
                    )}
                  </CardContent>
                  {!edu.isVerified && application.status !== "approved" && application.status !== "rejected" && (
                    <CardFooter>
                      <Button onClick={() => openVerifyDialog(edu.id, "education", edu.degree)} className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t("Verify")}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p>{t("No education records found")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="experience">
          {experience.length > 0 ? (
            <div className="grid gap-4">
              {experience.map((exp) => (
                <Card key={exp.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{exp.title}</CardTitle>
                        <CardDescription>{exp.company}</CardDescription>
                      </div>
                      {exp.isVerified ? (
                        <Badge className="bg-green-500 flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          {t("Verified")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {t("Pending Verification")}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t("Duration")}</p>
                        <p>
                          {new Date(exp.startDate).toLocaleDateString()} -{" "}
                          {exp.isCurrent ? t("Present") : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>
                    {exp.description && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">{t("Description")}</p>
                        <p className="text-sm">{exp.description}</p>
                      </div>
                    )}
                    {exp.documentUrl && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">{t("Supporting Document")}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1"
                          onClick={() => viewDocument(exp.documentUrl!, t("Experience Document"))}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {t("View Document")}
                        </Button>
                      </div>
                    )}
                    {exp.isVerified && exp.verificationNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500">{t("Verification Notes")}</p>
                        <p className="text-sm">{exp.verificationNotes}</p>
                      </div>
                    )}
                  </CardContent>
                  {!exp.isVerified && application.status !== "approved" && application.status !== "rejected" && (
                    <CardFooter>
                      <Button onClick={() => openVerifyDialog(exp.id, "experience", exp.title)} className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t("Verify")}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p>{t("No experience records found")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="training">
          {training.length > 0 ? (
            <div className="grid gap-4">
              {training.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.provider}</CardDescription>
                      </div>
                      {item.isVerified ? (
                        <Badge className="bg-green-500 flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          {t("Verified")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {t("Pending Verification")}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t("Duration")}</p>
                        <p>
                          {new Date(item.startDate).toLocaleDateString()} -{" "}
                          {new Date(item.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      {item.hours && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">{t("Hours")}</p>
                          <p>{item.hours}</p>
                        </div>
                      )}
                    </div>
                    {item.certificateUrl && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">{t("Certificate")}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1"
                          onClick={() => viewDocument(item.certificateUrl!, t("Training Certificate"))}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {t("View Certificate")}
                        </Button>
                      </div>
                    )}
                    {item.isVerified && item.verificationNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500">{t("Verification Notes")}</p>
                        <p className="text-sm">{item.verificationNotes}</p>
                      </div>
                    )}
                  </CardContent>
                  {!item.isVerified && application.status !== "approved" && application.status !== "rejected" && (
                    <CardFooter>
                      <Button onClick={() => openVerifyDialog(item.id, "training", item.title)} className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t("Verify")}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p>{t("No training records found")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
          {documents.length > 0 ? (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{doc.name}</CardTitle>
                        <CardDescription>{t(doc.type)}</CardDescription>
                      </div>
                      {doc.isVerified ? (
                        <Badge className="bg-green-500 flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          {t("Verified")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {t("Pending Verification")}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={() => viewDocument(doc.fileUrl, doc.name)}>
                      <FileText className="mr-2 h-4 w-4" />
                      {t("View Document")}
                    </Button>

                    {doc.isVerified && doc.verificationNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500">{t("Verification Notes")}</p>
                        <p className="text-sm">{doc.verificationNotes}</p>
                      </div>
                    )}
                  </CardContent>
                  {!doc.isVerified && application.status !== "approved" && application.status !== "rejected" && (
                    <CardFooter>
                      <Button onClick={() => openVerifyDialog(doc.id, "document", doc.name)} className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t("Verify")}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p>{t("No documents found")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t("Verification History")}</CardTitle>
              <CardDescription>{t("Record of all verification actions")}</CardDescription>
            </CardHeader>
            <CardContent>
              {verificationHistory.length > 0 ? (
                <div className="space-y-4">
                  {verificationHistory.map((item) => (
                    <div key={item.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {item.userName} {t(`${item.action}ed`)} {t(item.entityType)}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                        {item.action === "verify" && (
                          <Badge className="bg-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {t("Verified")}
                          </Badge>
                        )}
                        {item.action === "reject" && (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            {t("Rejected")}
                          </Badge>
                        )}
                        {item.action === "approve" && (
                          <Badge className="bg-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {t("Approved")}
                          </Badge>
                        )}
                      </div>
                      {item.notes && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>{t("No verification history found")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {application.status !== "approved" && application.status !== "rejected" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("Application Decision")}</CardTitle>
            <CardDescription>{t("Approve or reject this application")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1" onClick={handleApprove}>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t("Approve Application")}
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => setRejectionDialogOpen(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                {t("Reject Application")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Reject Application")}</DialogTitle>
            <DialogDescription>{t("Please provide a reason for rejecting this application.")}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={t("Enter rejection reason")}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
              {t("Reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Verify Item")}</DialogTitle>
            <DialogDescription>{currentItem && t(`Verify ${currentItem.name}`)}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={verificationNote}
            onChange={(e) => setVerificationNote(e.target.value)}
            placeholder={t("Add verification notes (optional)")}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleVerifyItem}>{t("Verify")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={!!documentPreview} onOpenChange={() => setDocumentPreview(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{documentPreview?.name}</DialogTitle>
          </DialogHeader>
          <div className="h-[60vh] overflow-auto">
            {documentPreview && (
              <iframe src={documentPreview.url} className="w-full h-full border-0" title={documentPreview.name} />
            )}
          </div>
          <DialogFooter>
            {documentPreview && (
              <a
                href={documentPreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {t("Download")}
              </a>
            )}
            <Button variant="outline" onClick={() => setDocumentPreview(null)}>
              {t("Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
