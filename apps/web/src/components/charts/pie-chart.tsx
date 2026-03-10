"use client"

import { useState } from "react"
import { PieChart as RechartsePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PieChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  title: string
  description?: string
}

export function PieChartComponent({ data, title, description }: PieChartProps) {
  const { language } = useLanguage()
  const [showLabels, setShowLabels] = useState(true)
  const [showLegend, setShowLegend] = useState(true)

  const t = (key: string) => (language === "en" ? key : translations[key] || key)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(title)}</CardTitle>
        {description && <CardDescription>{t(description)}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsePieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={showLabels}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={showLabels ? ({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%` : false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, t(name)]} />
            {showLegend && <Legend formatter={(value) => t(value)} />}
          </RechartsePieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowLabels(!showLabels)}>
            {showLabels ? t("Hide Labels") : t("Show Labels")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowLegend(!showLegend)}>
            {showLegend ? t("Hide Legend") : t("Show Legend")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Arabic translations
const translations = {
  "Registration Status": "حالة التسجيل",
  "Current distribution of registration statuses": "التوزيع الحالي لحالات التسجيل",
  Active: "نشط",
  Expired: "منتهي",
  Suspended: "معلق",
  "Pending Renewal": "قيد التجديد",
  Inactive: "غير نشط",
  "Specialization Distribution": "توزيع التخصصات",
  "Distribution of engineers by specialization": "توزيع المهندسين حسب التخصص",
  "Agricultural Engineering": "الهندسة الزراعية",
  "Irrigation Engineering": "هندسة الري",
  "Food Engineering": "هندسة الأغذية",
  "Environmental Engineering": "الهندسة البيئية",
  Biotechnology: "التقنية الحيوية",
  Other: "أخرى",
  "Gender Distribution": "توزيع الجنس",
  "Distribution of engineers by gender": "توزيع المهندسين حسب الجنس",
  Male: "ذكر",
  Female: "أنثى",
  "Education Level": "المستوى التعليمي",
  "Distribution of engineers by education level": "توزيع المهندسين حسب المستوى التعليمي",
  Bachelor: "بكالوريوس",
  Master: "ماجستير",
  PhD: "دكتوراه",
  "Certification Levels": "مستويات الشهادات",
  "Distribution of engineers by certification level": "توزيع المهندسين حسب مستوى الشهادة",
  "Entry Level": "مستوى المبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
  Expert: "خبير",
  "Hide Labels": "إخفاء التسميات",
  "Show Labels": "إظهار التسميات",
  "Hide Legend": "إخفاء المفتاح",
  "Show Legend": "إظهار المفتاح",
}
