import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function DatePicker({dateHeader}) {
  const [date, setDate] = useState()

  return (
    <div className="space-y-4">
      {/* Single Date Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-600">{dateHeader}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full h-10 text-blue-800 justify-start text-left mt-1 bg-white border-blue-200 shadow-sm hover:border-blue-300 focus:ring-blue-300 font-medium", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
