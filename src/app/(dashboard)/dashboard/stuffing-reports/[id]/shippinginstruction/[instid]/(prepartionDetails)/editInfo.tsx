import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { mutate } from "swr";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { instruction } from "@/interfaces/instruction";
import { updateShippinginstruction } from "@/app/httpservices/shippinginstruction";
import { toast } from "react-toastify";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
export const ShippingReportEditDetails = ({
  cacheKey,
  totalInwords,
  data,
  itemsId,
}: {
  totalInwords: string;
  cacheKey: string;
  itemsId: any;
  data: instruction;
  setTotalInwords: (val: string) => void;
}) => {
  const [payload, setPayload] = useState<instruction>(data);
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    if (data) {
      setPayload(data);
      setDate(data.updatedAt as unknown as Date);
    }
  }, [data]);
  const handleSubmit = async () => {
    delete payload.id;
    delete payload?.createdAt;
    delete payload?.finaldeliverId;
    delete payload?.itemId;
    delete payload?.stuffingReportItems;
    delete payload?.finaldelivery;
    payload.updatedAt = date?.toString();
    if (totalInwords !== "") {
      payload.totalamountinword = totalInwords;
    }
    try {
      const { message, status }: any = await updateShippinginstruction(
        Number(itemsId),
        payload
      );
      if (status == 200) {
        toast.success(message);
        mutate(cacheKey);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
      toast.error("something went wrong.");
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[24rem] mr-4 shadow-lg border border-gray-300 border-t-0">
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-800">
              .....................................................
            </p>
          </div>
          <div className="grid gap-2 text-sm text-gray-600 uppercase">
            <Label>Received date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-full flex justify-between">
            <span className="text-sm text-blue-400">Click for preview</span>
            <Button onClick={handleSubmit}>Update</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
