"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ManageClassifications() {
  const [classifications, setClassifications] = useState([
    { level: "مبتدئ", yearsFrom: 0, yearsTo: 2 },
    { level: "متوسط", yearsFrom: 2, yearsTo: 5 },
    { level: "متقدم", yearsFrom: 5, yearsTo: 8 },
    { level: "خبير", yearsFrom: 8, yearsTo: 12 },
    { level: "خبير متقدم", yearsFrom: 12, yearsTo: 16 },
    { level: "خبير استشاري", yearsFrom: 16, yearsTo: 20 },
    { level: "استشاري", yearsFrom: 20, yearsTo: 100 },
  ])

  const [newLevel, setNewLevel] = useState("")
  const [newYearsFrom, setNewYearsFrom] = useState("")
  const [newYearsTo, setNewYearsTo] = useState("")

  const addClassification = () => {
    if (newLevel && newYearsFrom && newYearsTo) {
      setClassifications([...classifications, {
        level: newLevel,
        yearsFrom: parseInt(newYearsFrom),
        yearsTo: parseInt(newYearsTo)
      }])
      setNewLevel("")
      setNewYearsFrom("")
      setNewYearsTo("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">إدارة التصنيفات</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المستوى</TableHead>
            <TableHead>من (سنوات)</TableHead>
            <TableHead>إلى (سنوات)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classifications.map((classification, index) => (
            <TableRow key={index}>
              <TableCell>{classification.level}</TableCell>
              <TableCell>{classification.yearsFrom}</TableCell>
              <TableCell>{classification.yearsTo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">إضافة تصنيف جديد</h2>
        <div className="flex space-x-4 rtl:space-x-reverse">
          <Input placeholder="المستوى" value={newLevel} onChange={(e) => setNewLevel(e.target.value)} />
          <Input placeholder="من (سنوات)" value={newYearsFrom} onChange={(e) => setNewYearsFrom(e.target.value)} />
          <Input placeholder="إلى (سنوات)" value={newYearsTo} onChange={(e) => setNewYearsTo(e.target.value)} />
        </div>
        <Button onClick={addClassification}>إضافة تصنيف</Button>
      </div>
    </div>
  )
}
