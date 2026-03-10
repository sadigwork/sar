"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function FellowshipConfirmationPage() {
  const { t, language } = useLanguage()
  const router = useRouter()

  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">{language === "en" ? "Application Submitted" : "تم تقديم الطلب"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {language === "en"
                ? "Thank you for applying for the fellowship. Your application has been submitted successfully and is now under review."
                : "شكرًا لتقديم طلب الزمالة. تم تقديم طلبك بنجاح وهو الآن قيد المراجعة."}
            </p>
            <div className="bg-muted p-4 rounded-md text-left mb-4">
              <p className="text-sm font-medium mb-2">
                {language === "en" ? "What happens next?" : "ماذا يحدث بعد ذلك؟"}
              </p>
              <ol className="list-decimal list-inside text-sm space-y-2">
                <li>
                  {language === "en"
                    ? "Our committee will review your application within 2-4 weeks."
                    : "ستقوم لجنتنا بمراجعة طلبك خلال 2-4 أسابيع."}
                </li>
                <li>
                  {language === "en"
                    ? "You will be notified about the examination date (if applicable)."
                    : "سيتم إخطارك بموعد الامتحان (إن وجد)."}
                </li>
                <li>
                  {language === "en"
                    ? "Upon successful completion of all requirements, you will receive your fellowship certificate."
                    : "عند الانتهاء بنجاح من جميع المتطلبات، ستحصل على شهادة الزمالة الخاصة بك."}
                </li>
              </ol>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? "Reference Number: FLW-" + Math.floor(100000 + Math.random() * 900000)
                : "رقم المرجع: FLW-" + Math.floor(100000 + Math.random() * 900000)}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/dashboard")} className="bg-gradient-green hover:opacity-90">
              {language === "en" ? "Return to Dashboard" : "العودة إلى لوحة التحكم"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
