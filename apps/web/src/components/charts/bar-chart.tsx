"use client"

import { useState } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BarChartProps {
  data: any[]
  title: string
  description?: string
  dataKey: string
  nameKey?: string
  valueFormatter?: (value: number) => string
  layout?: "horizontal" | "vertical"
  colors?: boolean
}

export function BarChartComponent({
  data,
  title,
  description,
  dataKey,
  nameKey = "name",
  valueFormatter,
  layout = "horizontal",
  colors = false,
}: BarChartProps) {
  const { language } = useLanguage()
  const [showDataLabels, setShowDataLabels] = useState(true)
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
          <RechartsBarChart data={data} layout={layout}>
            <CartesianGrid strokeDasharray="3 3" />
            {layout === "horizontal" ? (
              <>
                <XAxis dataKey={nameKey} />
                <YAxis />
              </>
            ) : (
              <>
                <XAxis type="number" />
                <YAxis dataKey={nameKey} type="category" width={150} />
              </>
            )}
            <Tooltip formatter={(value, name) => [valueFormatter ? valueFormatter(value as number) : value, t(name)]} />
            {showLegend && <Legend formatter={(value) => t(value)} />}
            <Bar
              dataKey={dataKey}
              name={t(dataKey)}
              fill="#3b82f6"
              label={
                showDataLabels
                  ? {
                      position: layout === "horizontal" ? "top" : "right",
                      formatter: valueFormatter
                        ? (value: number) => valueFormatter(value)
                        : (value: number) => value.toString(),
                    }
                  : false
              }
            >
              {colors && data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />)}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowDataLabels(!showDataLabels)}>
            {showDataLabels ? t("Hide Labels") : t("Show Labels")}
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
  "Geographic Distribution": "التوزيع الجغرافي",
  "Distribution of engineers by location": "توزيع المهندسين حسب الموقع",
  Engineers: "المهندسين",
  "Processing Time Trends": "اتجاهات وقت المعالجة",
  "Average processing time by application type": "متوسط وقت المعالجة حسب نوع الطلب",
  "Processing Time (days)": "وقت المعالجة (أيام)",
  "Age Distribution": "توزيع الأعمار",
  "Distribution of engineers by age group": "توزيع المهندسين حسب الفئة العمرية",
  value: "القيمة",
  "Hide Labels": "إخفاء التسميات",
  "Show Labels": "إظهار التسميات",
  "Hide Legend": "إخفاء المفتاح",
  "Show Legend": "إظهار المفتاح",
  days: "أيام",
}
