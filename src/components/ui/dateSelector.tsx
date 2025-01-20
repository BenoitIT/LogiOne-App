"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getDefaultDateRange = (): DateRange => ({
  from: new Date(new Date().setDate(new Date().getDate() - 30)),
  to: new Date(),
});

const DatePickerWithRange = ({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (value: DateRange | undefined) => void;
}) => {
  const handleSelectFrom = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate({ from: selectedDate, to: date?.to || new Date() });
    }
  };

  const handleSelectTo = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate({ from: date?.from || new Date(), to: selectedDate });
    }
  };

  return (
    <div className={"grid gap-2 bg-white text-gray-600"}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Calendar
              initialFocus
              mode="single"
              defaultMonth={date?.from || getDefaultDateRange().from}
              selected={date?.from}
              onSelect={handleSelectFrom}
              numberOfMonths={1}
            />
            <Calendar
              initialFocus
              mode="single"
              defaultMonth={date?.to || getDefaultDateRange().to}
              selected={date?.to}
              onSelect={handleSelectTo}
              numberOfMonths={1}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
