"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ManageSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: "محمد أحمد", email: "mohammed@example.com", status: "نشط" },
    { id: 2, name: "فاطمة علي", email: "fatima@example.com", status: "منتهي" },
    { id: 3, name: "أحمد محمود", email: "ahmed@example.com", status: "نشط" },
  ])

  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")

  const addSubscription = () => {
    if (newName && newEmail) {
      setSubscriptions([...subscriptions, {
        id: subscriptions.length + 1,
        name: newName,
        email: newEmail,
        status: "نشط"
      }])
      setNewName("")
      setNewEmail("")
    }
  }

  const toggleStatus = (id: number) => {
    setSubscriptions(subscriptions.map(sub =>
      sub.id === id ? { ...sub, status: sub.status === "نشط" ? "منتهي" : "نشط" } : sub
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">إدارة الاشتراكات</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.name}</TableCell>
              <TableCell>{subscription.email}</TableCell>
              <TableCell>{subscription.status}</TableCell>
              <TableCell>
                <Button onClick={() => toggleStatus(subscription.id)}>
                  {subscription.status === "نشط" ? "إنهاء الاشتراك" : "تفعيل الاشتراك"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">إضافة اشتراك جديد</h2>
        <div className="flex space-x-4 rtl:space-x-reverse">
          <Input placeholder="الاسم" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input placeholder="البريد الإلكتروني" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        </div>
        <Button onClick={addSubscription}>إضافة اشتراك</Button>
      </div>
    </div>
  )
}
