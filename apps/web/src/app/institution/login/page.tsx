"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, GraduationCap, ArrowRight } from "lucide-react"

export default function InstitutionLoginPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [institutionType, setInstitutionType] = useState<"university" | "company">("university")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/institution/dashboard")
    }, 1500)
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {language === "en" ? "Institution Login" : "تسجيل دخول المؤسسة"}
          </CardTitle>
          <CardDescription className="text-center">
            {language === "en"
              ? "Enter your credentials to access your institution dashboard"
              : "أدخل بيانات الاعتماد للوصول إلى لوحة تحكم المؤسسة"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            defaultValue="university"
            value={institutionType}
            onValueChange={(value) => setInstitutionType(value as "university" | "company")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="university" className="flex items-center justify-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                {language === "en" ? "University" : "جامعة"}
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center justify-center">
                <Building2 className="mr-2 h-4 w-4" />
                {language === "en" ? "Company" : "شركة"}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{language === "en" ? "Email" : "البريد الإلكتروني"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={
                  language === "en"
                    ? institutionType === "university"
                      ? "university@example.com"
                      : "company@example.com"
                    : institutionType === "university"
                      ? "university@example.com"
                      : "company@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{language === "en" ? "Password" : "كلمة المرور"}</Label>
                <Link href="/institution/forgot-password" className="text-sm text-primary hover:underline">
                  {language === "en" ? "Forgot password?" : "نسيت كلمة المرور؟"}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-green hover:opacity-90" disabled={isLoading}>
              {isLoading ? (
                language === "en" ? (
                  "Logging in..."
                ) : (
                  "جاري تسجيل الدخول..."
                )
              ) : (
                <>
                  {language === "en" ? "Login" : "تسجيل الدخول"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            {language === "en" ? "Don't have an institution account?" : "ليس لديك حساب مؤسسة؟"}
          </div>
          <Button variant="outline" className="w-full" onClick={() => router.push("/institution/register")}>
            {language === "en" ? "Register Your Institution" : "سجل مؤسستك"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
