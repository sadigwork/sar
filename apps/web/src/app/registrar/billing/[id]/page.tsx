"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Download, Send, CreditCard, User, Calendar, FileText } from "lucide-react"
import Link from "next/link"

export default function InvoiceDetailsPage() {
  const params = useParams()
  const invoiceId = params.id as string

  // Mock invoice data
  const invoice = {
    id: invoiceId,
    number: "INV-2024-001",
    status: "paid",
    amount: 1500,
    tax: 225,
    total: 1725,
    currency: "SAR",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    paidDate: "2024-01-20",
    paymentMethod: "bank_transfer",
    customer: {
      id: "1",
      name: "أحمد محمد علي",
      email: "ahmed.ali@example.com",
      phone: "+966501234567",
      address: "الرياض، المملكة العربية السعودية",
    },
    items: [
      {
        id: "1",
        description: "رسوم التسجيل الأولي",
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
      {
        id: "2",
        description: "رسوم التصنيف المهني",
        quantity: 1,
        unitPrice: 800,
        total: 800,
      },
      {
        id: "3",
        description: "رسوم إصدار الترخيص",
        quantity: 1,
        unitPrice: 200,
        total: 200,
      },
    ],
    notes: "شكراً لك على التسجيل في نقابة المهندسين الزراعيين",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع"
      case "pending":
        return "في انتظار الدفع"
      case "overdue":
        return "متأخر"
      case "cancelled":
        return "ملغي"
      default:
        return "غير محدد"
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "تحويل بنكي"
      case "credit_card":
        return "بطاقة ائتمان"
      case "cash":
        return "نقداً"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">فاتورة رقم {invoice.number}</h1>
          <div className="flex items-center space-x-2 space-x-reverse mt-2">
            <Badge variant={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">تاريخ الإصدار: {invoice.issueDate}</span>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تحميل PDF
          </Button>
          {invoice.status === "pending" && (
            <Button variant="outline">
              <Send className="h-4 w-4 ml-2" />
              إرسال تذكير
            </Button>
          )}
          <Link href={`/registrar/billing/${invoiceId}/edit`}>
            <Button>
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <User className="h-5 w-5" />
                <span>معلومات العميل</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{invoice.customer.name}</p>
                <p className="text-sm text-gray-600">{invoice.customer.email}</p>
                <p className="text-sm text-gray-600">{invoice.customer.phone}</p>
                <p className="text-sm text-gray-600">{invoice.customer.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <FileText className="h-5 w-5" />
                <span>تفاصيل الفاتورة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-500">
                        الكمية: {item.quantity} × {item.unitPrice} {invoice.currency}
                      </p>
                    </div>
                    <p className="font-medium">
                      {item.total} {invoice.currency}
                    </p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>
                      {invoice.amount} {invoice.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span>
                      {invoice.tax} {invoice.currency}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span>
                      {invoice.total} {invoice.currency}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>ملاحظات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Payment Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <CreditCard className="h-5 w-5" />
                <span>معلومات الدفع</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">الحالة</label>
                <p className="font-medium">{getStatusText(invoice.status)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">تاريخ الاستحقاق</label>
                <p>{invoice.dueDate}</p>
              </div>

              {invoice.paidDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">تاريخ الدفع</label>
                  <p>{invoice.paidDate}</p>
                </div>
              )}

              {invoice.paymentMethod && (
                <div>
                  <label className="text-sm font-medium text-gray-500">طريقة الدفع</label>
                  <p>{getPaymentMethodText(invoice.paymentMethod)}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {invoice.total} {invoice.currency}
                  </p>
                  <p className="text-sm text-gray-500">المبلغ الإجمالي</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Calendar className="h-5 w-5" />
                <span>التواريخ المهمة</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">تاريخ الإصدار:</span>
                <span className="text-sm">{invoice.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">تاريخ الاستحقاق:</span>
                <span className="text-sm">{invoice.dueDate}</span>
              </div>
              {invoice.paidDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">تاريخ الدفع:</span>
                  <span className="text-sm text-green-600">{invoice.paidDate}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
