import useSWR from "swr";
import {
  dependanceEndpoint,
  getDependancies,
} from "@/app/httpservices/dependacies";
import ErrorSection from "@/appComponents/pageBlocks/errorDisplay";
import Loader from "@/appComponents/pageBlocks/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewStuffingItem, StepFormProps } from "@/interfaces/stuffingItem";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const StepTwoForm = ({
  setItemsData,
  ErrorLogger,
  newItemPayload,
  setActiveForm,
  errors,
}: StepFormProps) => {
  const searchParams = useSearchParams();
  const shipingMethod = searchParams?.get("category");
  const [date, setDate] = useState<Date>();
  const { data, isLoading, error } = useSWR(
    dependanceEndpoint,
    getDependancies
  );
  const handleSelectGenderChange = (value: string) => {
    setItemsData({ ...newItemPayload, type: value });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let sanitizedValue = e.target.value;
    if (e.target.type == "number") {
      if (sanitizedValue.startsWith("0") && sanitizedValue.length > 1) {
        sanitizedValue = sanitizedValue.replace(/^0+/, "");
      }
      if (Number(sanitizedValue) <= 0) {
        sanitizedValue = "0";
      }
      const numericValue = sanitizedValue;
      setItemsData((prevState: NewStuffingItem) => ({
        ...prevState,
        [e.target.name]: numericValue,
      }));
      if (e.target.name == "freight") {
        setItemsData((prevState: NewStuffingItem) => ({
          ...prevState,
          freight: Number(numericValue),
        }));
      }
      if (e.target.name == "line") {
        const freightValue =
          shipingMethod !== "FCL"
            ? Number(e.target.value) * Number(data?.freightRate ?? 1)
            : 1 * 0;
        setItemsData((prevState: NewStuffingItem) => ({
          ...prevState,
          freight: freightValue,
          cbm: Number(e.target.value) * Number(1.5),
        }));
      }
    } else {
      setItemsData((prevState: NewStuffingItem) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
    ErrorLogger(e.target.name, null);
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setItemsData((prevState: NewStuffingItem) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const description = form.elements.namedItem(
      "description"
    ) as HTMLTextAreaElement;
    const Jb = form.elements.namedItem("jb") as HTMLInputElement;
    const Line = form.elements.namedItem("line") as HTMLInputElement;
    const blFee = form.elements.namedItem("blFee") as HTMLInputElement;
    if (description.value === "") {
      ErrorLogger("description", "Description  is required.");
    } else if (Jb.value === "") {
      ErrorLogger("jb", "Job advance is required.");
    } else if (Line.value == "") {
      ErrorLogger("line", "Numerical value for line is required.");
    } else if (blFee.value == "") {
      ErrorLogger("blFee", "Numerical value for blFee is required.");
    } else {
      newItemPayload.createdAt=date;
      setActiveForm(3);
    }
  };
  if (data) {
    return (
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="description">
              Description<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              cols={10}
              placeholder="type.."
              onChange={handleDescriptionChange}
              value={newItemPayload?.description ?? ""}
              className={
                errors?.description
                  ? "text-xs text-red-500 border-red-500"
                  : "placeholder:text-gray-400"
              }
            />
            <span
              className={
                errors?.description ? "text-xs text-red-500" : "hidden"
              }
            >
              {errors?.description}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="line">
                Lines<span className="text-red-500">*</span>
              </Label>
              <Input
                id="line"
                name="line"
                type="number"
                placeholder="type.."
                value={newItemPayload?.line}
                onChange={handleChange}
                className={
                  errors?.line
                    ? "text-xs text-red-500 border-red-500"
                    : "placeholder:text-gray-400"
                }
              />
              <span
                className={errors?.line ? "text-xs text-red-500" : "hidden"}
              >
                {errors?.line}
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="freight">
                Freight<span className="text-red-500">*</span>
              </Label>
              <Input
                id="freight"
                name="freight"
                type="number"
                placeholder="type.."
                disabled={shipingMethod !== "FCL"}
                value={Number(newItemPayload.freight)}
                onChange={handleChange}
                className={
                  errors["freight"]
                    ? "text-xs text-red-500 border-red-500"
                    : "placeholder:text-gray-400"
                }
              />
              <span
                className={errors?.freight ? "text-xs text-red-500" : "hidden"}
              >
                {errors?.freight}
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cbm">CBM</Label>
              <Input
                id="cbm"
                name="cbm"
                type="number"
                placeholder="type.."
                value={Number(newItemPayload.line! * 1.5) || ""}
                onChange={handleChange}
                className={"placeholder:text-gray-400"}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="blFee">
                BL Fee<span className="text-red-500">*</span>
              </Label>
              <Input
                id="blFee"
                name="blFee"
                type="number"
                min={0}
                placeholder="type.."
                onChange={handleChange}
                value={newItemPayload?.blFee}
                className={
                  errors?.blFee
                    ? "text-xs text-red-500 border-red-500"
                    : "placeholder:text-gray-400"
                }
              />
              <span
                className={errors?.blFee ? "text-xs text-red-500" : "hidden"}
              >
                {errors?.blFee}
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jb">
                Job Advance<span className="text-red-500">*</span>
              </Label>
              <Input
                id="jb"
                name="jb"
                placeholder="type.."
                type="number"
                onChange={handleChange}
                value={newItemPayload?.jb}
                className={
                  errors?.jb
                    ? "text-xs text-red-500 border-red-500"
                    : "placeholder:text-gray-400"
                }
              />
              <span className={errors?.jb ? "text-xs text-red-500" : "hidden"}>
                {errors?.jb}
              </span>
            </div>
            <div className="grid gap-2">
              <Select onValueChange={handleSelectGenderChange}>
                <Label htmlFor="role">
                  Type <span className="text-red-500">*</span>
                </Label>
                <SelectTrigger className="w-full placeholder:text-gray-300">
                  {newItemPayload?.type ? (
                    <SelectValue placeholder={newItemPayload?.type} />
                  ) : (
                    <SelectValue placeholder="Select..." />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lines">lines</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="handling">Handling</Label>
              <Input
                id="handling"
                name="handling"
                type="number"
                placeholder="type.."
                onChange={handleChange}
                value={newItemPayload?.handling}
                className={
                  errors?.handling
                    ? "text-xs text-red-500 border-red-500"
                    : "placeholder:text-gray-400"
                }
              />
              <span
                className={errors?.handling ? "text-xs text-red-500" : "hidden"}
              >
                {errors?.handling}
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inspection">Inspection</Label>
              <Input
                id="inspection"
                name="inspection"
                type="number"
                placeholder="type.."
                value={newItemPayload?.inspection}
                onChange={handleChange}
                className={"placeholder:text-gray-400"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="carHanging">Car hanging</Label>
              <Input
                id="carHanging"
                name="carHanging"
                type="number"
                placeholder="type.."
                value={newItemPayload?.carHanging}
                onChange={handleChange}
                className={"placeholder:text-gray-400"}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recovery">Recovery</Label>
              <Input
                id="recovery"
                name="recovery"
                type="number"
                placeholder="type.."
                onChange={handleChange}
                value={newItemPayload?.recovery}
                className={
                  errors?.handling
                    ? "text-xs text-red-500 border-red-500"
                    : "placeholder:text-gray-400"
                }
              />
              <span
                className={errors?.handling ? "text-xs text-red-500" : "hidden"}
              >
                {errors?.handling}
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="insurance">Insurance</Label>
              <Input
                id="insurance"
                name="insurance"
                type="number"
                placeholder="type.."
                value={newItemPayload?.insurance}
                onChange={handleChange}
                className={"placeholder:text-gray-400"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="localCharges">Local charges</Label>
              <Input
                id="localCharges"
                name="localCharges"
                type="number"
                placeholder="type.."
                value={newItemPayload?.localCharges}
                onChange={handleChange}
                className={"placeholder:text-gray-400"}
              />
            </div>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-normal">
                For the past shipping instructions
              </AccordionTrigger>
              <AccordionContent>
                <Label className="text-sm font-normal mr-2">Select created date</Label>
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

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              className="w-fit"
              variant="secondary"
              onClick={() => setActiveForm(1)}
            >
              Back
            </Button>
            <Button type="submit" className="w-fit">
              Review
            </Button>
          </div>
        </div>
      </form>
    );
  }
  if (isLoading) {
    <Loader />;
  }
  if (error) {
    <ErrorSection />;
  }
};
export default StepTwoForm;
