"use client";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
import { Label } from "@/components/ui/label";
import { SearchBox } from "@/components/ui/searchBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useCallback,
  useEffect,
} from "react";
import {  useRouter, useSearchParams } from "next/navigation";
const StaffingReports = () => {
  const searchParams: any = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleValueChange = (value: string) => {
    router.push(`?${createQueryString("filter", value)}`);
  };
  useEffect(() => {
    router.push(`?${createQueryString("filter", "preview")}`);
  }, []);
  return (
    <>
      <div className="w-full flex flex-col-reverse md:flex-row justify-between mb-4 gap-2">
        <SearchBox />
        <div className="flex flex-wrap gap-2 text-sm">
          <RadioGroup
            defaultValue="preview"
            className="flex flex-wrap"
            onValueChange={handleValueChange}
          >
            <div className="flex items-center space-x-2 text-black">
              <RadioGroupItem value="preview" id="preview" />
              <Label htmlFor="preview">In progress</Label>
            </div>
            <div className="flex items-center space-x-2 text-black">
              <RadioGroupItem value="generated" id="generated" />
              <Label htmlFor="generated">Completed</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );
};
export default TabularSection(StaffingReports);
