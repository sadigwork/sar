"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { ar } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/components/language-provider"

interface DateRangePickerProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({ date, setDate, className }: DateRangePickerProps) {
  const { t, language } = useLanguage()

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: language === "ar" ? ar : undefined })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: language === "ar" ? ar : undefined })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: language === "ar" ? ar : undefined })
              )
            ) : (
              <span>{t("language") === "en" ? "Pick a date range" : "اختر نطاق تاريخ"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={language === "ar" ? ar : undefined}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// For backward compatibility, also export as DatePickerWithRange
export { DateRangePicker as DatePickerWithRange }