"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Mail } from "lucide-react"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"

interface ScheduledReport {
  id: string
  name: string
  frequency: string
  description: string
  recipients: string[]
  nextSchedule: Date
}

interface ReportSchedulerProps {
  scheduledReports?: ScheduledReport[]
}

export function ReportScheduler({ scheduledReports = [] }: ReportSchedulerProps) {
  const { language } = useLanguage()
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date())
  const [scheduleEmail, setScheduleEmail] = useState("")
  const [reportName, setReportName] = useState("")
  const [reportFrequency, setReportFrequency] = useState("monthly")

  const handleScheduleReport = () => {
    // Implement schedule report functionality
    alert(
      language === "en"
        ? `Report "${reportName}" scheduled for ${format(scheduleDate!, "PPP")} and will be sent to ${scheduleEmail}`
        : `تم جدولة التقرير "${reportName}" ليوم ${format(scheduleDate!, "PPP", { locale: ar })} وسيتم إرساله إلى ${scheduleEmail}`,
    )
    setIsScheduling(false)
  }

  const handleSendNow = (reportId: string) => {
    // Implement send now functionality
    alert(language === "en" ? "Sending report now..." : "جاري إرسال التقرير الآن...")
  }

  const t = (key: string) => (language === "en" ? key : translations[key] || key)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Scheduled Reports")}</CardTitle>
        <CardDescription>{t("Manage your scheduled reports and notifications")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduledReports.length > 0 ? (
            <div className="rounded-md border">
              {scheduledReports.map((report, index) => (
                <div key={report.id}>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{t(report.description)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleSendNow(report.id)}>
                          <Mail className="mr-2 h-4 w-4" />
                          {t("Send Now")}
                        </Button>
                        <Button variant="outline" size="sm">
                          {t("Edit")}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < scheduledReports.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("No scheduled reports yet")}</p>
              <p className="text-sm">{t("Schedule a report to receive regular updates")}</p>
            </div>
          )}

          {isScheduling && (
            <div className="mt-6 space-y-4 p-4 border rounded-md">
              <h3 className="text-lg font-medium">{t("Schedule New Report")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-name">{t("Report Name")}</Label>
                  <Input
                    id="report-name"
                    placeholder={t("Enter report name")}
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-frequency">{t("Frequency")}</Label>
                  <Select value={reportFrequency} onValueChange={setReportFrequency}>
                    <SelectTrigger id="report-frequency">
                      <SelectValue placeholder={t("Select frequency")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t("Daily")}</SelectItem>
                      <SelectItem value="weekly">{t("Weekly")}</SelectItem>
                      <SelectItem value="monthly">{t("Monthly")}</SelectItem>
                      <SelectItem value="quarterly">{t("Quarterly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-date">{t("Start Date")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="schedule-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? (
                          format(scheduleDate, "PPP", { locale: language === "en" ? enUS : ar })
                        ) : (
                          <span>{t("Pick a date")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-email">{t("Recipients")}</Label>
                  <Input
                    id="schedule-email"
                    placeholder={t("Enter email addresses (comma separated)")}
                    value={scheduleEmail}
                    onChange={(e) => setScheduleEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsScheduling(false)}>
                  {t("Cancel")}
                </Button>
                <Button onClick={handleScheduleReport}>{t("Schedule Report")}</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!isScheduling && (
          <Button onClick={() => setIsScheduling(true)}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {t("Schedule New Report")}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// Arabic translations
const translations = {
  "Scheduled Reports": "التقارير المجدولة",
  "Manage your scheduled reports and notifications": "إدارة التقارير والإشعارات المجدولة",
  "Monthly Registration Summary": "ملخص التسجيل الشهري",
  "Sent on the 1st of every month": "يرسل في الأول من كل شهر",
  "Send Now": "إرسال الآن",
  Edit: "تعديل",
  "Quarterly Performance Report": "تقرير الأداء الربع سنوي",
  "Sent on the 1st day of each quarter": "يرسل في اليوم الأول من كل ربع سنة",
  "Weekly Registration Activity": "نشاط التسجيل الأسبوعي",
  "Sent every Monday at 9:00 AM": "يرسل كل يوم اثنين الساعة 9:00 صباحًا",
  "Schedule New Report": "جدولة تقرير جديد",
  "No scheduled reports yet": "لا توجد تقارير مجدولة حتى الآن",
  "Schedule a report to receive regular updates": "قم بجدولة تقرير لتلقي تحديثات منتظمة",
  "Report Name": "اسم التقرير",
  "Enter report name": "أدخل اسم التقرير",
  Frequency: "التكرار",
  "Select frequency": "اختر التكرار",
  Daily: "يومي",
  Weekly: "أسبوعي",
  Monthly: "شهري",
  Quarterly: "ربع سنوي",
  "Start Date": "تاريخ البدء",
  "Pick a date": "اختر تاريخًا",
  Recipients: "المستلمون",
  "Enter email addresses (comma separated)": "أدخل عناوين البريد الإلكتروني (مفصولة بفواصل)",
  Cancel: "إلغاء",
  "Schedule Report": "جدولة التقرير",
}
