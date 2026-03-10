"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CertificationPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  // Sample data
  const [certificationLevel, setCertificationLevel] = useState("Intermediate")
  const [applicationStatus, setApplicationStatus] = useState("pending")
  const [eligibilityScore, setEligibilityScore] = useState(75)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleApply = () => {
    setApplicationStatus("pending")
    toast({
      title: t("language") === "en" ? "Application submitted" : "تم تقديم الطلب",
      description:
        t("language") === "en"
          ? "Your certification application has been submitted"
          : "تم تقديم طلب الشهادة المهنية الخاص بك",
    })
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{t("certification")}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("language") === "en" ? "Certification Eligibility" : "أهلية الشهادة المهنية"}</CardTitle>
            <CardDescription>
              {t("language") === "en"
                ? "Your eligibility for professional certification"
                : "أهليتك للحصول على الشهادة المهنية"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  {t("language") === "en" ? "Eligibility Score" : "درجة الأهلية"}
                </span>
                <span className="text-sm font-medium">{eligibilityScore}%</span>
              </div>
              <Progress value={eligibilityScore} className="h-2" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {t("language") === "en" ? "Eligibility Criteria" : "معايير الأهلية"}
              </h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  {t("language") === "en" ? "Academic Degrees: Qualified" : "الدرجات العلمية: مؤهل"}
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  {t("language") === "en" ? "Training Courses: Qualified" : "الدورات التدريبية: مؤهل"}
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  {t("language") === "en" ? "Work Experience: Qualified" : "الخبرة العملية: مؤهل"}
                </li>
                <li className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  {t("language") === "en" ? "Academic Papers: Not sufficient" : "الأوراق العلمية: غير كافية"}
                </li>
              </ul>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("language") === "en" ? "Recommendation" : "توصية"}</AlertTitle>
              <AlertDescription>
                {t("language") === "en"
                  ? "Add at least one academic paper to improve your eligibility score"
                  : "أضف ورقة علمية واحدة على الأقل لتحسين درجة أهليتك"}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("language") === "en" ? "Certification Application" : "طلب الشهادة المهنية"}</CardTitle>
            <CardDescription>
              {t("language") === "en"
                ? "Apply for professional certification"
                : "التقدم بطلب للحصول على الشهادة المهنية"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("certificationLevel")}</h3>
              <div className="flex items-center">
                <Badge variant="outline" className="text-base">
                  {t("language") === "en" ? certificationLevel : "متوسط"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("applicationStatus")}</h3>
              <div className="flex items-center">
                {applicationStatus === "pending" && (
                  <Badge variant="secondary" className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {t("pending")}
                  </Badge>
                )}
                {applicationStatus === "approved" && (
                  <Badge variant="success" className="flex items-center bg-green-100 text-green-800">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {t("approved")}
                  </Badge>
                )}
                {applicationStatus === "rejected" && (
                  <Badge variant="destructive" className="flex items-center">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {t("rejected")}
                  </Badge>
                )}
              </div>
            </div>

            {applicationStatus === "pending" && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en"
                    ? "Your application is currently under review. This process may take up to 7 business days."
                    : "طلبك قيد المراجعة حاليًا. قد تستغرق هذه العملية ما يصل إلى 7 أيام عمل."}
                </p>
              </div>
            )}

            {applicationStatus === "approved" && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en"
                    ? "Congratulations! Your certification has been approved. You can download your certificate below."
                    : "تهانينا! تمت الموافقة على شهادتك. يمكنك تنزيل شهادتك أدناه."}
                </p>
              </div>
            )}

            {applicationStatus === "rejected" && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en"
                    ? "Your application has been rejected. Please review the feedback and reapply."
                    : "تم رفض طلبك. يرجى مراجعة الملاحظات وإعادة التقديم."}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {applicationStatus === "pending" ? (
              <Button variant="outline" disabled>
                {t("language") === "en" ? "Application in Progress" : "الطلب قيد التقدم"}
              </Button>
            ) : applicationStatus === "approved" ? (
              <Button>{t("language") === "en" ? "Download Certificate" : "تنزيل الشهادة"}</Button>
            ) : (
              <Button onClick={handleApply}>{t("applyCertification")}</Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("language") === "en" ? "Certification Levels" : "مستويات الشهادة المهنية"}</CardTitle>
            <CardDescription>
              {t("language") === "en"
                ? "Available certification levels for agricultural engineers"
                : "مستويات الشهادة المهنية المتاحة للمهندسين الزراعيين"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-medium">{t("language") === "en" ? "Entry Level" : "مستوى المبتدئ"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en" ? "0-2 years of experience" : "0-2 سنوات من الخبرة"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">{t("language") === "en" ? "Intermediate" : "متوسط"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en" ? "3-5 years of experience" : "3-5 سنوات من الخبرة"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">{t("language") === "en" ? "Advanced" : "متقدم"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en" ? "6-8 years of experience" : "6-8 سنوات من الخبرة"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">{t("language") === "en" ? "Expert" : "خبير"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en" ? "9-12 years of experience" : "9-12 سنة من الخبرة"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">{t("language") === "en" ? "Senior Expert" : "خبير متقدم"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en" ? "13-16 years of experience" : "13-16 سنة من الخبرة"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">{t("language") === "en" ? "Consultant" : "استشاري"}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en" ? "17+ years of experience" : "17+ سنة من الخبرة"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
