"use client";
import useSWR from "swr";
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
import { ChangeEvent, FormEvent, useState,useEffect } from "react";
import { NewShipper, newShipperErrors } from "@/interfaces/shipper";
import { useRouter,useParams } from "next/navigation";
import { updateShipper,getShipper,shippersEndpoint } from "@/app/httpservices/shipper";
import { setPageTitle } from "@/redux/reducers/pageTitleSwitching";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { withRolesAccess } from "@/components/auth/accessRights";
const Page = () => {
  const router = useRouter();
  const dispatch=useDispatch();
  const params: any = useParams();
  const shipperId = params?.id;
  const { data: shipper } = useSWR(shippersEndpoint, () => getShipper(Number(shipperId)))
  const [newShipperpayload, setStaffData] = useState<NewShipper>({email:""});
  const [loading,setLoading]=useState<boolean>(false)
  const [errors, setValidationErrors] = useState<newShipperErrors>({});
  const phoneRegx =
    /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    useEffect(() => {
        dispatch(setPageTitle("Update shipper"));
    }, [dispatch]);
    useEffect(() => {
        if (shipper) {
            setStaffData(shipper);
        }
    }, [shipper]);
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setValidationErrors((prevState: newShipperErrors) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setStaffData((prevState: NewShipper) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const shipperName = form.elements.namedItem("name") as HTMLInputElement;
    const shipperPhone = form.elements.namedItem("phone") as HTMLInputElement;
    if (shipperName.value === "") {
      ErrorLogger("name", "Shipper name is required.");
    } else if (
      shipperPhone.value=="" ||
      !phoneRegx.test(shipperPhone.value)
    ) {
      ErrorLogger("phone", "Valid phone number is required.");
    } else {
      try {
        setLoading(true)
        const message = await updateShipper(Number(shipperId),newShipperpayload);
        toast.success(message);
        setLoading(false)
        router.back()
      } catch (error) {
        toast.success("Failed to add a new shipper");
      }
    }
  };
  return (
    <div className="w-full min-h-[88vh] flex justify-center items-center">
      <Card className="mx-auto w-sm md:w-[700px] py-3 border-none">
        <CardHeader>
          <CardTitle className="text-xl text-center">{newShipperpayload?.name}</CardTitle>
          <CardDescription className="text-center">
            Update shipper{"'"}s information. Note that all fields with
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
                    Shipper name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="type.."
                    onChange={handleChange}
                    value={newShipperpayload?.name}
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
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="type.."
                    value={newShipperpayload?.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="mail@example.com"
                  value={newShipperpayload?.email}
                  onChange={handleChange}
                  className={"placeholder:text-gray-400"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="text"
                  name="phone"
                  type="text"
                  placeholder="Ex:0788888888"
                  onChange={handleChange}
                  value={newShipperpayload?.phone}
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
