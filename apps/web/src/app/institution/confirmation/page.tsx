"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function InstitutionConfirmationPage() {
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
            <CardTitle className="text-2xl">
              {language === "en" ? "Registration Submitted" : "تم تقديم التسجيل"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {language === "en"
                ? "Thank you for registering your institution. Your application has been submitted successfully and is now under review."
                : "شكرًا لتسجيل مؤسستك. تم تقديم طلبك بنجاح وهو الآن قيد المراجعة."}
            </p>
            <div className="bg-muted p-4 rounded-md text-left mb-4">
              <p className="text-sm font-medium mb-2">
                {language === "en" ? "What happens next?" : "ماذا يحدث بعد ذلك؟"}
              </p>
              <ol className="list-decimal list-inside text-sm space-y-2">
                <li>
                  {language === "en"
                    ? "Our team will review your application within 5-7 business days."
                    : "سيقوم فريقنا بمراجعة طلبك خلال 5-7 أيام عمل."}
                </li>
                <li>
                  {language === "en"
                    ? "You may be contacted for additional information or documentation if needed."
                    : "قد يتم الاتصال بك للحصول على معلومات أو وثائق إضافية إذا لزم الأمر."}
                </li>
                <li>
                  {language === "en"
                    ? "Once approved, you will receive login credentials for your institution's dashboard."
                    : "بمجرد الموافقة، ستتلقى بيانات تسجيل الدخول للوحة تحكم مؤسستك."}
                </li>
              </ol>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? "Reference Number: INS-" + Math.floor(100000 + Math.random() * 900000)
                : "رقم المرجع: INS-" + Math.floor(100000 + Math.random() * 900000)}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")} className="bg-gradient-green hover:opacity-90">
              {language === "en" ? "Return to Home" : "العودة إلى الصفحة الرئيسية"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
