"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string | number
    type: "increase" | "decrease"
  }
  icon?: React.ReactNode
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const { language } = useLanguage()

  const t = (key: string) => (language === "en" ? key : translations[key] || key)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{t(title)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {icon && <div className="mr-2">{icon}</div>}
          <div>
            <div className="text-3xl font-bold">{value}</div>
            {change && (
              <div
                className={`flex items-center text-sm ${
                  change.type === "increase" ? "text-green-600" : "text-red-600"
                } mt-1`}
              >
                <span>{change.value}</span>
                <span className="text-muted-foreground ml-1">{t("vs last year")}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Arabic translations
const translations = {
  "Total Engineers": "إجمالي المهندسين",
  "Active Registrations": "التسجيلات النشطة",
  "Renewal Rate": "معدل التجديد",
  "Avg. Processing Time": "متوسط وقت المعالجة",
  "vs last year": "مقارنة بالعام الماضي",
  days: "أيام",
}
