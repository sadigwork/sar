"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  CreditCard,
  Download,
  Plus,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Send,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegistrarBillingPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Sample billing data
  const invoices = [
    {
      id: "INV-2023-001",
      userName: language === "en" ? "Ahmed Mohamed" : "أحمد محمد",
      userType: "engineer",
      amount: 150.0,
      currency: "USD",
      type: "registration",
      status: "paid",
      issueDate: "2023-11-01",
      dueDate: "2023-11-15",
      paidDate: "2023-11-10",
    },
    {
      id: "INV-2023-002",
      userName: language === "en" ? "Green Valley Co." : "شركة الوادي الأخضر",
      userType: "institution",
      amount: 500.0,
      currency: "USD",
      type: "registration",
      status: "pending",
      issueDate: "2023-11-15",
      dueDate: "2023-11-30",
      paidDate: null,
    },
    {
      id: "INV-2023-003",
      userName: language === "en" ? "Sara Ali" : "سارة علي",
      userType: "engineer",
      amount: 75.0,
      currency: "USD",
      type: "renewal",
      status: "overdue",
      issueDate: "2023-10-01",
      dueDate: "2023-10-15",
      paidDate: null,
    },
    {
      id: "INV-2023-004",
      userName: language === "en" ? "Khaled Ibrahim" : "خالد إبراهيم",
      userType: "engineer",
      amount: 75.0,
      currency: "USD",
      type: "renewal",
      status: "paid",
      issueDate: "2023-11-10",
      dueDate: "2023-11-25",
      paidDate: "2023-11-12",
    },
  ]

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "registrar") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">{language === "en" ? "Paid" : "مدفوع"}</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">{language === "en" ? "Pending" : "معلق"}</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">{language === "en" ? "Overdue" : "متأخر"}</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">{language === "en" ? "Cancelled" : "ملغي"}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "registration":
        return language === "en" ? "Registration" : "تسجيل"
      case "renewal":
        return language === "en" ? "Renewal" : "تجديد"
      case "penalty":
        return language === "en" ? "Penalty" : "غرامة"
      default:
        return type
    }
  }

  const handleSendReminder = (invoiceId: string) => {
    toast({
      title: language === "en" ? "Reminder Sent" : "تم إرسال التذكير",
      description: language === "en" ? "Payment reminder has been sent" : "تم إرسال تذكير الدفع",
    })
  }

  const handleMarkAsPaid = (invoiceId: string) => {
    toast({
      title: language === "en" ? "Invoice Updated" : "تم تحديث الفاتورة",
      description: language === "en" ? "Invoice has been marked as paid" : "تم تعيين الفاتورة كمدفوعة",
    })
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.userName.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices.filter((inv) => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0)

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{language === "en" ? "Billing Management" : "إدارة الفواتير"}</h1>
          <p className="text-muted-foreground">
            {language === "en" ? "Manage invoices and payments" : "إدارة الفواتير والمدفوعات"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {language === "en" ? "Export Report" : "تصدير تقرير"}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {language === "en" ? "Create Invoice" : "إنشاء فاتورة"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${totalRevenue.toFixed(2)}</CardTitle>
            <CardDescription>{language === "en" ? "Total Revenue" : "إجمالي الإيرادات"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-green-600">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {invoices.filter((inv) => inv.status === "paid").length} {language === "en" ? "paid" : "مدفوع"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${pendingAmount.toFixed(2)}</CardTitle>
            <CardDescription>{language === "en" ? "Pending Payments" : "المدفوعات المعلقة"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-yellow-600">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {invoices.filter((inv) => inv.status === "pending").length} {language === "en" ? "pending" : "معلق"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${overdueAmount.toFixed(2)}</CardTitle>
            <CardDescription>{language === "en" ? "Overdue Amount" : "المبلغ المتأخر"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-red-600">
              <XCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {invoices.filter((inv) => inv.status === "overdue").length} {language === "en" ? "overdue" : "متأخر"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{invoices.length}</CardTitle>
            <CardDescription>{language === "en" ? "Total Invoices" : "إجمالي الفواتير"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-blue-600">
              <CreditCard className="h-4 w-4 mr-1" />
              <span className="text-sm">{language === "en" ? "this month" : "هذا الشهر"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === "en" ? "Search invoices..." : "البحث في الفواتير..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={language === "en" ? "Status" : "الحالة"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "en" ? "All Status" : "جميع الحالات"}</SelectItem>
            <SelectItem value="paid">{language === "en" ? "Paid" : "مدفوع"}</SelectItem>
            <SelectItem value="pending">{language === "en" ? "Pending" : "معلق"}</SelectItem>
            <SelectItem value="overdue">{language === "en" ? "Overdue" : "متأخر"}</SelectItem>
            <SelectItem value="cancelled">{language === "en" ? "Cancelled" : "ملغي"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="p-4 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{invoice.id}</h3>
                        {getStatusBadge(invoice.status)}
                        <Badge variant="outline">{getTypeText(invoice.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{invoice.userName}</p>
                      <p className="text-lg font-semibold mb-2">
                        ${invoice.amount.toFixed(2)} {invoice.currency}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {language === "en" ? "Issued:" : "تاريخ الإصدار:"} {invoice.issueDate}
                        </span>
                        <span>
                          {language === "en" ? "Due:" : "تاريخ الاستحقاق:"} {invoice.dueDate}
                        </span>
                        {invoice.paidDate && (
                          <span>
                            {language === "en" ? "Paid:" : "تاريخ الدفع:"} {invoice.paidDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      {language === "en" ? "Download" : "تحميل"}
                    </Button>
                    {invoice.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => handleSendReminder(invoice.id)}>
                        <Send className="h-4 w-4 mr-1" />
                        {language === "en" ? "Send Reminder" : "إرسال تذكير"}
                      </Button>
                    )}
                    {(invoice.status === "pending" || invoice.status === "overdue") && (
                      <Button size="sm" onClick={() => handleMarkAsPaid(invoice.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {language === "en" ? "Mark Paid" : "تعيين كمدفوع"}
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{language === "en" ? "Actions" : "الإجراءات"}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{language === "en" ? "View Details" : "عرض التفاصيل"}</DropdownMenuItem>
                        <DropdownMenuItem>{language === "en" ? "Edit Invoice" : "تعديل الفاتورة"}</DropdownMenuItem>
                        <DropdownMenuItem>{language === "en" ? "Send Email" : "إرسال بريد إلكتروني"}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          {language === "en" ? "Cancel Invoice" : "إلغاء الفاتورة"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
