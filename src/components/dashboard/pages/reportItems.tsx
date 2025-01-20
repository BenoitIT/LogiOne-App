"use client";
import {
  getStuffingReport,
  getStuffingReportsItems,
  stuffingReportEndpoint,
} from "@/app/httpservices/stuffingReport";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { StuffingReport } from "@/interfaces/stuffingreport";
import { updateStuffingReport } from "@/app/httpservices/stuffingReport";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import Back from "@/components/ui/back";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { NewDelivery } from "@/interfaces/deliveries";
import {
  deliveryEndpoint,
  getAllDeliveriesUnpaginated,
} from "@/app/httpservices/deliveries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
const StaffingReportsItems = () => {
  const params = useParams();
  const [payload, setPayload] = useState<StuffingReport>({});
  const [validationErrors, setValidationErrors] = useState<StuffingReport>({});
  const [date, setDate] = useState<Date>();
  const staffReportId = params?.id;
  const cacheKey = `/stuffingreports/${Number(staffReportId)}`;
  const { data } = useSWR(cacheKey, () =>
    getStuffingReportsItems(Number(staffReportId))
  );
  const { data: stuffingreport } = useSWR(stuffingReportEndpoint, () =>
    getStuffingReport(Number(staffReportId))
  );
  const { data: deliveries } = useSWR(
    deliveryEndpoint,
    getAllDeliveriesUnpaginated,
    {
      onSuccess: (data: NewDelivery[]) =>
        data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    }
  );
  useEffect(() => {
    setPayload(stuffingreport);
  }, [stuffingreport]);
  useEffect(() => {
    setPayload({ ...payload, blCode: data?.stuffingRpt?.blCode });
  }, [data]);
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setValidationErrors((prevState: StuffingReport) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPayload((prevState: StuffingReport) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, "");
  };
  const handlePkGingTypeChange = (value: string) => {
    setPayload({ ...payload, packagingType: value });
  };
  const handleSelectChange = (value: string) => {
    setPayload({ ...payload, destination: Number(value) });
    delete validationErrors.destination;
  };
  const handleSelectStatusChange = (value: string) => {
    setPayload({ ...payload, status: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const origin = form.elements.namedItem("origin") as HTMLInputElement;
    if (origin.value === "") {
      ErrorLogger("origin", "Delivery origin must be specified.");
    } else {
      try {
        delete payload.id;
        delete payload.destination;
        payload.createdAt=date;
        const { message, status } = await updateStuffingReport(
          Number(staffReportId),
          payload
        );
        if (status == 200) {
          toast.success(message);
          mutate(cacheKey);
          setDate(new Date())
        } else {
          toast.error(message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update stuffing report");
      }
    }
  };
  return (
    <div>
      <div className="w-full flex justify-between mb-4 flex-col gap-2 md:flex-row">
        <div className=" w-full md:w-[400px] flex flex-col text-[14px] bg-white px-4 h-fit py-4 rounded shadow gap-1">
          <p className=" text-gray-600">
            Container number:{" "}
            <span className="font-medium"> {data?.stuffingRpt?.code}</span>
          </p>
          <p className=" text-gray-600">
            BL Number:
            <span className="font-medium"> {data?.stuffingRpt?.blCode}</span>
          </p>
          <p className=" text-gray-600">
            Container type:
            <span className="font-medium">
              {" "}
              {data?.stuffingRpt?.packagingType}
            </span>
          </p>
          <p className=" text-gray-600">
            Container status:
            <span
              className={
                data?.stuffingRpt?.status?.toLowerCase() != "available"
                  ? "text-red-500 capitalize"
                  : "text-[#189bcc] capitalize"
              }
            >
              {" "}
              {data?.stuffingRpt?.status}
            </span>
          </p>
          <p className=" text-gray-600">
            Stuffing report status:
            <span className={"text-[#189bcc] capitalize"}>
              {" "}
              {data?.stuffingRpt?.stuffingstatus?.toLowerCase()}
            </span>
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <span className="mt-1 ml-2 md:ml-0 font-bold text-blue-950 cursor-pointer">
                Update container Info
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4 shadow-md md:w-fit">
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Update {data?.stuffingRpt?.code}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Edit delivery information for the stuffs
                    </p>
                  </div>
                  <div className="grid gap-3 grid-cols-2">
                    <div className="grid gap-2 text-sm text-gray-700">
                      <Label>
                        Container Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Ex: TFTZ3574483"
                        name="code"
                        onChange={handleChange}
                        value={payload?.code || data?.stuffingRpt?.code}
                        className={
                          validationErrors.code
                            ? "text-xs text-red-500 border-red-500"
                            : "placeholder:text-gray-400"
                        }
                      />
                      <span
                        className={
                          validationErrors.code
                            ? "text-xs text-red-500"
                            : "hidden"
                        }
                      >
                        {validationErrors.code}
                      </span>
                    </div>
                    <div className="grid gap-2 text-sm text-gray-700">
                      <Label>BL Number</Label>
                      <Input
                        type="text"
                        placeholder="write..."
                        name="blCode"
                        onChange={handleChange}
                        value={payload?.blCode}
                        className={
                          validationErrors.blCode
                            ? "text-xs text-red-500 border-red-500"
                            : "placeholder:text-gray-400"
                        }
                      />
                    </div>
                    <div className="grid gap-2 text-sm text-gray-700">
                      <Label>Origin</Label>
                      <Input
                        type="text"
                        placeholder={data?.stuffingRpt?.origin}
                        name="origin"
                        value={payload?.origin || data?.stuffingRpt?.origin}
                        onChange={handleChange}
                        className={
                          validationErrors.origin
                            ? "text-xs text-red-500 border-red-500"
                            : "placeholder:text-black"
                        }
                      />
                      <span
                        className={
                          validationErrors.origin
                            ? "text-xs text-red-500"
                            : "hidden"
                        }
                      >
                        {validationErrors.origin}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-2 mr-4 w-full">
                      <Label>Container status</Label>
                      <Select onValueChange={handleSelectStatusChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={data?.stuffingRpt?.status}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="full">Full</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-2 mr-4 w-full">
                      <Label>Delivery</Label>
                      <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveries &&
                            deliveries?.map((location: NewDelivery) => (
                              <SelectItem
                                key={location.id!}
                                value={location.id!.toString()}
                              >
                                {location.country + "," + location.deliveryName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <Label>Packaging type</Label>
                      <RadioGroup
                        defaultValue={data?.stuffingRpt?.packagingType}
                        name="LCL"
                        onValueChange={handlePkGingTypeChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LCL" id="r1" />
                          <Label htmlFor="r1">Groupage (LCL)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="FCL" id="r2" />
                          <Label htmlFor="r2">Full Container (FCL)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm font-normal">
                            For the past containers
                          </AccordionTrigger>
                          <AccordionContent>
                            <Label className="text-sm font-normal">Select created date</Label>
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
                                  {date ? (
                                    format(date, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
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
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                  </div>
                  <div className="w-full flex justify-between">
                    <Button>save</Button>
                  </div>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-2 h-fit">
          <Back />
        </div>
      </div>
    </div>
  );
};
export default TabularSection(StaffingReportsItems);
