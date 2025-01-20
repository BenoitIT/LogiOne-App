"use client";
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
import { NewStaff, newStaffErrors } from "@/interfaces/staff";
import { useDispatch } from "react-redux";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { useRouter } from "next/navigation";
import { addNewUser } from "@/app/httpservices/users";
import { toast } from "react-toastify";
import { withRolesAccess } from "@/components/auth/accessRights";
import { RegistreSalesAgent } from "@/app/httpservices/users";
const Page = () => {
  const router = useRouter();
  const [newStaffPyaload, setStaffData] = useState<NewStaff>({});
  const [errors, setValidationErrors] = useState<newStaffErrors>({});
  const phoneRegx =
    /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("New staff"));
  }, [dispatch]);
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setValidationErrors((prevState: newStaffErrors) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleSelectRoleChange = (value: string) => {
    setStaffData({ ...newStaffPyaload, role: value });
    setValidationErrors((prevState: newStaffErrors) => ({
      ...prevState,
      role: "",
    }));
  };
  const handleSelectCountryChange = (value: string) => {
    setStaffData({ ...newStaffPyaload, workCountry: value });
    setValidationErrors((prevState: newStaffErrors) => ({
      ...prevState,
      workCountry: "",
    }));
  };
  const handleSelectGenderChange = (value: string) => {
    setStaffData({ ...newStaffPyaload, gender: value });
    setValidationErrors((prevState: newStaffErrors) => ({
      ...prevState,
      gender: "",
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setStaffData((prevState: NewStaff) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const firstName = form.elements.namedItem("firstName") as HTMLInputElement;
    const phoneNumber = form.elements.namedItem("phone") as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    if (firstName.value === "") {
      ErrorLogger("firstName", "First name is required.");
    } else if (newStaffPyaload.role !== "sales agent" && email.value === "") {
      ErrorLogger("email", "Email is required.");
    } else if (
      newStaffPyaload.role !== "sales agent" &&
      newStaffPyaload.workCountry === ""
    ) {
      ErrorLogger("workCountry", "Work country is required.");
    } else if (phoneNumber.value === "" || !phoneRegx.test(phoneNumber.value)) {
      ErrorLogger("phone", "Valid phone number is required.");
    } else if (!newStaffPyaload.role) {
      ErrorLogger("role", "Role must be chosen.");
    } else if (!newStaffPyaload.gender) {
      ErrorLogger("gender", "Gender must be chosen.");
    } else {
      try {
        delete newStaffPyaload.id;
        if (newStaffPyaload.email) {
          const response = await addNewUser(newStaffPyaload);
          if (response?.status == 201) {
            form.reset();
            toast.success(response?.message);
            router.back();
          } else {
            toast.error(response?.message);
          }
        } else {
          const response = await RegistreSalesAgent(newStaffPyaload);
          if (response?.status == 201) {
            form.reset();
            toast.success(response?.message);
            router.back();
          } else {
            toast.error(response?.message);
          }
        }
      } catch (err) {
        toast.error("Failed to add new staff");
      }
    }
  };
  return (
    <div className="w-full min-h-[88vh] flex justify-center items-center">
      <Card className="mx-auto w-sm md:w-[700px] py-3 border-none">
        <CardHeader>
          <CardTitle className="text-xl text-center">New staff</CardTitle>
          <CardDescription className="text-center">
            Enter a new staff{"'"}s information. Note that all fields with
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
                  <Label htmlFor="firstName">
                    First name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    onChange={handleChange}
                    className={
                      errors["firstName"]
                        ? "text-xs text-red-500 border-red-500"
                        : "placeholder:text-gray-400"
                    }
                  />
                  <span
                    className={
                      errors?.firstName ? "text-xs text-red-500" : "hidden"
                    }
                  >
                    {errors?.firstName}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="doe"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Select onValueChange={handleSelectRoleChange}>
                    <Label htmlFor="role" className="mb-2">
                      Role <span className="text-red-500">*</span>
                    </Label>
                    <SelectTrigger className="w-full placeholder:text-gray-300">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="operation manager">
                        Operation Manager
                      </SelectItem>
                      <SelectItem value="senior operation manager">Senior operation manager</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="head of finance">
                        Head of finance
                      </SelectItem>
                      <SelectItem value="sales agent">Sales agent</SelectItem>
                      <SelectItem value="sales manager">Sales manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <span
                    className={errors?.role ? "text-xs text-red-500" : "hidden"}
                  >
                    {errors?.role}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Select onValueChange={handleSelectGenderChange}>
                    <Label htmlFor="role" className="mb-2">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <SelectTrigger className="w-full placeholder:text-gray-300">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <span
                    className={
                      errors?.gender ? "text-xs text-red-500" : "hidden"
                    }
                  >
                    {errors?.gender}
                  </span>
                </div>
              </div>
              <div
                className={
                  newStaffPyaload?.role == "sales agent"
                    ? "hidden"
                    : "grid gap-2"
                }
              >
                <Label htmlFor="email">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="mail@example.com"
                  onChange={handleChange}
                  className={
                    errors["email"]
                      ? "text-xs text-red-500 border-red-500"
                      : "placeholder:text-gray-400"
                  }
                />
                <span
                  className={errors?.email ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.email}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">
                  Phone Number<span className="text-red-500">*</span>
                </Label>
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
                  className={errors?.phone ? "text-xs text-red-500" : "hidden"}
                >
                  {errors?.phone}
                </span>
              </div>
              <div
                className={
                  newStaffPyaload?.role == "sales agent"
                    ? "hidden"
                    : "grid gap-2"
                }
              >
                <Select onValueChange={handleSelectCountryChange}>
                  <Label htmlFor="workCountry" className="mb-2">
                  Workplace country <span className="text-red-500">*</span>
                  </Label>
                  <SelectTrigger className="w-full placeholder:text-gray-300">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rwanda">Rwanda</SelectItem>
                    <SelectItem value="Burundi">Burundi</SelectItem>
                    <SelectItem value="United Arab Emirates(Dubai)">
                      United Arab Emirates(Dubai)
                    </SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="DRC">DRC</SelectItem>
                  </SelectContent>
                </Select>
                <span
                  className={
                    errors?.workCountry ? "text-xs text-red-500" : "hidden"
                  }
                >
                  {errors?.workCountry}
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
export default withRolesAccess(Page, ["admin","senior operation manager"]) as React.FC;
