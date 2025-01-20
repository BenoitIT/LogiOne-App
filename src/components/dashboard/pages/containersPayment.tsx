"use client";
import TabularSection from "@/appComponents/pageBlocks/tabularSection";
import { Label } from "@/components/ui/label";
import { SearchBox } from "@/components/ui/searchBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  deliverySitesEndpoint,
  getAllsitesUnpaginated,
} from "@/app/httpservices/deliverySites";
import useSWR from "swr";
import { NewSite } from "@/interfaces/sites";
const ContainerPayments = () => {
  const searchParams: any = useSearchParams();
  const router = useRouter();
  const { data: destinations } = useSWR(
    deliverySitesEndpoint,
    getAllsitesUnpaginated,
    {
      onSuccess: (data: NewSite[]) =>
        data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
    }
  );
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const handleValueChange = (value: string) => {
    router.push(`?${createQueryString("location", value)}`);
  };
  useEffect(() => {
    router.push(
      `?${createQueryString(
        "location",
        destinations && destinations[0]?.siteCode
      )}`
    );
  }, []);
  return (
    <>
      <div className="w-full flex flex-col-reverse md:flex-row justify-between mb-4 gap-2">
        <SearchBox />
        <div className="flex flex-wrap gap-2 text-sm">
          <RadioGroup
            defaultValue={destinations && destinations[0]?.siteCode}
            className="flex flex-wrap"
            onValueChange={handleValueChange}
          >
            {destinations &&
              destinations?.map((location: NewSite) => (
                <div
                  className="flex items-center space-x-2 text-black capitalize"
                  key={location?.id}
                >
                  <RadioGroupItem
                    value={location.siteCode as unknown as string}
                    id={location.siteCode as unknown as string}
                  />
                  <Label htmlFor={location.siteCode}>
                    {location.locationName}
                  </Label>
                </div>
              ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );
};
export default TabularSection(ContainerPayments);
