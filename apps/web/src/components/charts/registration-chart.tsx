"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RegistrationChartProps {
  data: any[]
  title: string
  description?: string
  defaultMetrics?: string[]
  defaultChartType?: "bar" | "line" | "area"
}

export function RegistrationChart({
  data,
  title,
  description,
  defaultMetrics = ["newRegistrations", "renewals", "upgrades"],
  defaultChartType = "bar",
}: RegistrationChartProps) {
  const { language } = useLanguage()
  const [selectedMetrics, setSelectedMetrics] = useState(defaultMetrics)
  const [chartType, setChartType] = useState<"bar" | "line" | "area">(defaultChartType)
  const [showDataLabels, setShowDataLabels] = useState(true)
  const [showLegend, setShowLegend] = useState(true)

  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric))
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  const t = (key: string) => (language === "en" ? key : translations[key] || key)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(title)}</CardTitle>
        {description && <CardDescription>{t(description)}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, t(name)]} />
              {showLegend && <Legend formatter={(value) => t(value)} />}
              {selectedMetrics.includes("newRegistrations") && (
                <Bar
                  dataKey="newRegistrations"
                  name={t("New Registrations")}
                  fill="#3b82f6"
                  label={showDataLabels ? { position: "top" } : false}
                />
              )}
              {selectedMetrics.includes("renewals") && (
                <Bar
                  dataKey="renewals"
                  name={t("Renewals")}
                  fill="#10b981"
                  label={showDataLabels ? { position: "top" } : false}
                />
              )}
              {selectedMetrics.includes("upgrades") && (
                <Bar
                  dataKey="upgrades"
                  name={t("Upgrades")}
                  fill="#f59e0b"
                  label={showDataLabels ? { position: "top" } : false}
                />
              )}
            </BarChart>
          )}
          {chartType === "line" && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, t(name)]} />
              {showLegend && <Legend formatter={(value) => t(value)} />}
              {selectedMetrics.includes("newRegistrations") && (
                <Line
                  type="monotone"
                  dataKey="newRegistrations"
                  name={t("New Registrations")}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedMetrics.includes("renewals") && (
                <Line
                  type="monotone"
                  dataKey="renewals"
                  name={t("Renewals")}
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedMetrics.includes("upgrades") && (
                <Line
                  type="monotone"
                  dataKey="upgrades"
                  name={t("Upgrades")}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          )}
          {chartType === "area" && (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, t(name)]} />
              {showLegend && <Legend formatter={(value) => t(value)} />}
              {selectedMetrics.includes("newRegistrations") && (
                <Area
                  type="monotone"
                  dataKey="newRegistrations"
                  name={t("New Registrations")}
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                />
              )}
              {selectedMetrics.includes("renewals") && (
                <Area
                  type="monotone"
                  dataKey="renewals"
                  name={t("Renewals")}
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                />
              )}
              {selectedMetrics.includes("upgrades") && (
                <Area
                  type="monotone"
                  dataKey="upgrades"
                  name={t("Upgrades")}
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="new-registrations"
              checked={selectedMetrics.includes("newRegistrations")}
              onCheckedChange={() => toggleMetric("newRegistrations")}
            />
            <Label htmlFor="new-registrations" className="text-sm">
              {t("New Registrations")}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="renewals"
              checked={selectedMetrics.includes("renewals")}
              onCheckedChange={() => toggleMetric("renewals")}
            />
            <Label htmlFor="renewals" className="text-sm">
              {t("Renewals")}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="upgrades"
              checked={selectedMetrics.includes("upgrades")}
              onCheckedChange={() => toggleMetric("upgrades")}
            />
            <Label htmlFor="upgrades" className="text-sm">
              {t("Upgrades")}
            </Label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={chartType} onValueChange={(value: "bar" | "line" | "area") => setChartType(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t("Chart Type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">{t("Bar Chart")}</SelectItem>
              <SelectItem value="line">{t("Line Chart")}</SelectItem>
              <SelectItem value="area">{t("Area Chart")}</SelectItem>
            </SelectContent>
          </Select>
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
  "Registration Activity": "نشاط التسجيل",
  "Registration trends over the past 12 months": "اتجاهات التسجيل خلال الـ 12 شهرًا الماضية",
  "New Registrations": "تسجيلات جديدة",
  Renewals: "تجديدات",
  Upgrades: "ترقيات",
  "Chart Type": "نوع الرسم البياني",
  "Bar Chart": "رسم بياني شريطي",
  "Line Chart": "رسم بياني خطي",
  "Area Chart": "رسم بياني مساحي",
  "Hide Labels": "إخفاء التسميات",
  "Show Labels": "إظهار التسميات",
  "Hide Legend": "إخفاء المفتاح",
  "Show Legend": "إظهار المفتاح",
}
