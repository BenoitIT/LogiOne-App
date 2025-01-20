"use client";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { NewSite, newSitesErrors } from "@/interfaces/sites";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useRouter, useParams } from "next/navigation";
import { getAllAgents } from "@/app/httpservices/users";
import { usersBaseEndpoint } from "@/app/httpservices/axios";
import { NewStaff } from "@/interfaces/staff";
import {
  updateSite,
  getSite,
  deliverySitesEndpoint,
} from "@/app/httpservices/deliverySites";
import { toast } from "react-toastify";
import { withRolesAccess } from "@/components/auth/accessRights";
const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params: any = useParams();
  const siteId = params?.id;
  const { data: site } = useSWR(usersBaseEndpoint, () =>
    getSite(Number(siteId))
  );
  const [newSitePayload, setStaffData] = useState<NewSite>({});
  const [errors, setValidationErrors] = useState<newSitesErrors>({});
  const { data: agents } = useSWR(deliverySitesEndpoint, getAllAgents);
  useEffect(() => {
    dispatch(setPageTitle("Update delivery site"));
  }, [dispatch]);
  useEffect(() => {
    if (site) {
      setStaffData(site);
    }
  }, [site]);
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setValidationErrors((prevState: newSitesErrors) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleSelectRoleChange = (value: string) => {
    setStaffData({ ...newSitePayload, agent: Number(value) });
    setValidationErrors((prevState: newSitesErrors) => ({
      ...prevState,
      agent: "",
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setStaffData((prevState: NewSite) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const selectedAgent = agents?.find(
    (agent: NewStaff) => agent.id === newSitePayload?.agent
  );
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const country = form.elements.namedItem("country") as HTMLInputElement;
    const siteName = form.elements.namedItem(
      "locationName"
    ) as HTMLInputElement;
    if (country.value === "") {
      ErrorLogger("country", "Country is required.");
    } else if (siteName.value === "") {
      ErrorLogger("locationName", "Site location name is required.");
    } else if (!newSitePayload.agent) {
      ErrorLogger("agent", "Agent must be chosen.");
    } else {
      try {
        const response = await updateSite(Number(siteId), newSitePayload);
        if (response?.status == 200) {
          toast.success(response?.message);
          router.back();
          form.reset();
        } else {
          toast.error(response?.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to add new delivery site");
      }
    }
  };
  return (
    <div className="w-full min-h-[88vh] flex justify-center items-center">
      <Card className="mx-auto w-sm md:w-[700px] py-3 border-none">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {newSitePayload?.country}-{newSitePayload?.locationName}
          </CardTitle>
          <CardDescription className="text-center">
            Update site{"'"}s information with its monitoring agent. <br /> Note
            that all fields with
            <span className="text-sm">
              (<span className="text-red-500 text-base">*</span>) are mandatory
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country">
                  Country<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="Rwanda"
                  onChange={handleChange}
                  value={newSitePayload?.country}
                  className={
                    errors["country"]
                      ? "text-xs text-red-500 border-red-500"
                      : "placeholder:text-gray-400"
                  }
                />
                <span
                  className={
                    errors?.country ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.country}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteCode">Location code</Label>
                <Input
                  id="siteCode"
                  name="siteCode"
                  placeholder="Ex:KGl"
                  value={newSitePayload?.siteCode}
                  onChange={handleChange}
                />
                <span
                  className={
                    errors?.siteCode ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.siteCode}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="locationName">Site name</Label>
                <Input
                  id="locationName"
                  name="locationName"
                  placeholder="kamembe"
                  value={newSitePayload?.locationName}
                  onChange={handleChange}
                />
                <span
                  className={
                    errors?.locationName ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.locationName}
                </span>
              </div>
              <div className="grid gap-2">
                <Select onValueChange={handleSelectRoleChange}>
                  <Label htmlFor="role" className="mb-2">
                    Operation manager <span className="text-red-500">*</span>
                  </Label>
                  <SelectTrigger className="w-full placeholder:text-gray-300">
                    {selectedAgent ? (
                      <SelectValue
                        placeholder={`${selectedAgent.firstName} ${selectedAgent.lastName}`}
                      />
                    ) : (
                      <SelectValue placeholder="Select..." />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {agents?.map((agent: NewStaff) => (
                      <SelectItem key={agent.id} value={agent.id!.toString()}>
                        {agent.firstName + " " + agent.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span
                  className={errors?.agent ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.agent}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  className="w-fit"
                  variant="destructive"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-fit">
                  Update
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default withRolesAccess(Page, ["senior operation manager", "admin"]) as React.FC;
