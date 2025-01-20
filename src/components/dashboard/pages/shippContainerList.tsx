"use client";
import useSWR, { mutate } from "swr";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchBox } from "@/components/ui/searchBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StuffingReport } from "@/interfaces/stuffingreport";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { NewShipper } from "@/interfaces/shipper";
import { getAllshippers, shippersEndpoint } from "@/app/httpservices/shipper";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  createStuffingReports,
  stuffingReportEndpoint,
} from "@/app/httpservices/stuffingReport";
import {
  deliverySitesEndpoint,
  getAllsitesUnpaginated,
} from "@/app/httpservices/deliverySites";
import { NewSite } from "@/interfaces/sites";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
const ContainerListShipp = () => {
  const session: any = useSession();
  const role = session?.data?.role;
  const workPlace = session?.data?.workCountry;
  const pathname = usePathname();
  const router = useRouter();
  const [payload, setPayload] = useState<StuffingReport>({
    packagingType: "LCL",
  });
  const [date, setDate] = useState<Date>();
  const [validationErrors, setValidationErrors] = useState<StuffingReport>({});
  const { data: shippingCompanies } = useSWR(
    shippersEndpoint,
    () => getAllshippers(""),
    {
      onSuccess: (data: NewShipper[]) =>
        data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    }
  );
  const { data: destinations } = useSWR(
    deliverySitesEndpoint,
    getAllsitesUnpaginated,
    {
      onSuccess: (data: NewSite[]) =>
        data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    }
  );
  const handleSelectChange = (value: string) => {
    setPayload({ ...payload, finaldeliverId: Number(value) });
    delete validationErrors.finaldeliverId;
  };
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setValidationErrors((prevState: StuffingReport) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleSelectShipperChange = (value: string | number) => {
    setPayload((prevState: StuffingReport) => ({
      ...prevState,
      shipperId: Number(value),
    }));
    setValidationErrors((prevState: StuffingReport) => ({
      ...prevState,
      shipperId: null,
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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const origin = form.elements.namedItem("origin") as HTMLInputElement;
    if (origin.value === "") {
      ErrorLogger("origin", "Delivery origin must be specified.");
    } else if (!payload.shipperId) {
      ErrorLogger("shipperId", "Shipper must be chosen.");
    } else {
      try {
        delete payload.id;
        delete payload.status;
        payload.createdAt=date;
        const { message, status } = await createStuffingReports(payload);
        if (status == 201) {
          form.reset();
          toast.success(message);
          router.refresh();
          setDate(new Date())
          mutate(stuffingReportEndpoint);
          return router.push(`${pathname + `?added=true`}`);
        } else {
          toast.error(message);
        }
      } catch (err) {
        toast.error("Failed to create new stuffing report");
      }
    }
  };
  const handlePkGingTypeChange = (value: string) => {
    setPayload({ ...payload, packagingType: value });
  };
  return (
    <>
      <div className="w-full flex flex-col-reverse md:flex-row justify-between mb-4 gap-2 h-fit overflow-auto">
        <SearchBox />
        <div className="flex flex-wrap gap-2 text-sm">
          <div
            className={
              role == "senior operation manager" ||
              (role == "admin" && workPlace?.toLowerCase().includes("dubai"))
                ? "flex gap-2 justify-end w-full"
                : "hidden"
            }
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button>Add new</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 mr-4 shadow-md  h-fit overflow-auto">
                <form
                  className="w-full h-fit overflow-auto"
                  onSubmit={handleSubmit}
                >
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        New container
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Fill the information for the container
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <div className="grid gap-2 text-sm text-gray-700">
                        <Label>
                          Container Number{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Ex: TFTZ3574483"
                          name="code"
                          onChange={handleChange}
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
                          className={
                            validationErrors.blCode
                              ? "text-xs text-red-500 border-red-500"
                              : "placeholder:text-gray-400"
                          }
                        />
                      </div>
                      <div className="grid gap-2 text-sm text-gray-700">
                        <Label>
                          Origin <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Ex: Dubai"
                          name="origin"
                          onChange={handleChange}
                          className={
                            validationErrors.origin
                              ? "text-xs text-red-500 border-red-500"
                              : "placeholder:text-gray-400"
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
                      <div className="grid gap-2">
                        <Select onValueChange={handleSelectShipperChange}>
                          <Label htmlFor="shipper">
                            Shipper <span className="text-red-500">*</span>
                          </Label>
                          <SelectTrigger className="w-full placeholder:text-gray-300">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {shippingCompanies?.map((shipper: NewShipper) => (
                              <SelectItem
                                key={shipper.id}
                                value={shipper.id!.toString()}
                              >
                                {shipper.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span
                          className={
                            validationErrors["shipperId"]
                              ? "text-xs text-red-500"
                              : "hidden"
                          }
                        >
                          {validationErrors?.shipperId}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 items-center gap-2 mr-4 w-full">
                        <Label>Delivery</Label>
                        <Select onValueChange={handleSelectChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder="Select..."
                              className="placeholder:text-gray-300"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {destinations &&
                              destinations?.map((location: NewSite) => (
                                <SelectItem
                                  key={location.id!}
                                  value={location.id!.toString()}
                                >
                                  {location.country +
                                    "-" +
                                    location.locationName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2 text-sm">
                        <Label>Packaging type</Label>
                        <RadioGroup
                          defaultValue="LCL"
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
        </div>
      </div>
    </>
  );
};
export default TabularSection(ContainerListShipp);
