"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, FormEvent, useState } from "react";
import { NewCustomer, newCustomerErrors } from "@/interfaces/shipper";
import { useRouter } from "next/navigation";
import { createNewConsignee } from "@/app/httpservices/consignee";
import { toast } from "react-toastify";
import { withRolesAccess } from "@/components/auth/accessRights";
const Page = () => {
  const router = useRouter();
  const [newConsigneepayload, setStaffData] = useState<NewCustomer>({
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setValidationErrors] = useState<newCustomerErrors>({});
  const phoneRegx =
    /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setValidationErrors((prevState: newCustomerErrors) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setStaffData((prevState: NewCustomer) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const consigneeName = form.elements.namedItem("name") as HTMLInputElement;
    const consigneePhone = form.elements.namedItem("phone") as HTMLInputElement;
    const consigneeLocation = form.elements.namedItem(
      "location"
    ) as HTMLInputElement;
    if (consigneeName.value === "") {
      ErrorLogger("name", "Consignee name is required.");
    } else if (
      consigneePhone.value == "" ||
      !phoneRegx.test(consigneePhone.value)
    ) {
      ErrorLogger("phone", "Valid phone number is required.");
    } else if (consigneeLocation.value == "") {
      ErrorLogger("location", "Customer location is required.");
    } else {
      try {
        setLoading(true);
        const response = await createNewConsignee(newConsigneepayload);
        if (response?.status == 201) {
          toast.success(response?.message);
          router.back();
          form.reset();
        } else {
          toast.error(response?.message);
        }
      } catch (error) {
        toast.error("Failed to add a new shipper");
      }
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[88vh] flex justify-center items-center">
      <Card className="mx-auto w-sm md:w-[700px] py-3 border-none">
        <CardHeader>
          <CardTitle className="text-xl text-center">New customer</CardTitle>
          <CardDescription className="text-center">
            Enter a new customer{"'"}s information. Note that all fields with
            <br />
            <span className="text-sm">
              (<span className="text-red-500 text-base">*</span>) are mandatory
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Customer name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="type.."
                    onChange={handleChange}
                    className={
                      errors["name"]
                        ? "text-xs text-red-500 border-red-500"
                        : "placeholder:text-gray-400"
                    }
                  />
                  <span
                    className={errors?.name ? "text-xs text-red-500" : "hidden"}
                  >
                    {errors?.name}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">
                    Customer Location<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Ex:Rwanda,kigali"
                    onChange={handleChange}
                    className={
                      errors["location"]
                        ? "text-xs text-red-500 border-red-500"
                        : "placeholder:text-gray-400"
                    }
                  />
                  <span
                    className={
                      errors?.location ? "text-xs text-red-500" : "hidden"
                    }
                  >
                    {errors?.location}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="text"
                    name="phone"
                    type="text"
                    placeholder="Ex:0788888888"
                    onChange={handleChange}
                    className={
                      errors["phone"]
                        ? "text-xs text-red-500 border-red-500"
                        : "placeholder:text-gray-400"
                    }
                  />
                  <span
                    className={
                      errors?.phone ? "text-xs text-red-500" : "hidden"
                    }
                  >
                    {errors?.phone}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tinnumber">
                    TIN Number<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="text"
                    name="tinnumber"
                    type="text"
                    placeholder="Ex:123456777"
                    onChange={handleChange}
                    className={
                      errors["tinnumber"]
                        ? "text-xs text-red-500 border-red-500"
                        : "placeholder:text-gray-400"
                    }
                  />
                  <span
                    className={
                      errors?.tinnumber ? "text-xs text-red-500" : "hidden"
                    }
                  >
                    {errors?.tinnumber}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="mail@example.com"
                    onChange={handleChange}
                    className={"placeholder:text-gray-400"}
                  />
                </div>
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
                <Button type="submit" className="w-fit" disabled={loading}>
                  Register
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
