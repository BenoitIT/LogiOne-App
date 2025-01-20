"use client";
import { createNewMessage } from "@/app/httpservices/messages";
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
import { Textarea } from "@/components/ui/textarea";
import { ContactInfo } from "@/interfaces/contactForm";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

const ContactUsForm = () => {
  const [errors, setErrors] = useState<ContactInfo>({});
  const [payload, setPayload] = useState<ContactInfo>({});
  const [loading, setLoading] = useState<boolean>(false);
  const phoneRegx =
    /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setErrors((prevState: ContactInfo) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPayload((prevState: ContactInfo) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const firstName = form.elements.namedItem("firstName") as HTMLInputElement;
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    const message = form.elements.namedItem("message") as HTMLInputElement;
    if (firstName.value == "") {
      ErrorLogger("firstName", "First name is required.");
    } else if (firstName.value.length < 2) {
      ErrorLogger("firstName", "First name should not be single character");
    } else if (phone.value == "") {
      ErrorLogger("phone", "Phone number is required.");
    } else if (!phoneRegx.test(phone.value)) {
      ErrorLogger("phone", "A valid phone number is required.");
    } else if (message.value == "") {
      ErrorLogger("message", "Message is required.");
    } else if (message.value.length < 3) {
      ErrorLogger("message", "Only descriptive message is required.");
    } else {
      setLoading(true);
      const response = await createNewMessage(payload);
      if (response?.status == 201) {
        toast.success(response?.message);
        form.reset();
      } else {
        toast.error(response?.message);
      }
      setLoading(false);
    }
  };
  return (
    <Card className="mx-auto max-w-sm lg:min-w-[600px]">
      <CardHeader>
        <CardTitle className="text-xl text-gray-700">Talk To Us</CardTitle>
        <CardDescription>
          Fill the information below and send us a message directly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">
                First name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Your first name"
                className={
                  errors["firstName"]
                    ? "text-xs text-red-500 border-red-500"
                    : "placeholder:text-gray-400"
                }
                onChange={handleChange}
              />
              <span
                className={
                  errors["firstName"] ? "text-xs text-red-500" : "hidden"
                }
              >
                {errors["firstName"]}
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Your last name"
                className={
                  errors["lastName"]
                    ? "text-xs text-red-500 border-red-500"
                    : "placeholder:text-gray-400"
                }
                onChange={handleChange}
              />
              <span
                className={
                  errors["lastName"] ? "text-xs text-red-500" : "hidden"
                }
              >
                {errors["lastName"]}
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your email address"
              className={
                errors["email"]
                  ? "text-xs text-red-500 border-red-500"
                  : "placeholder:text-gray-400"
              }
              onChange={handleChange}
            />
            <span
              className={errors["email"] ? "text-xs text-red-500" : "hidden"}
            >
              {errors["email"]}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">
              Phone Number<span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              className={
                errors["phone"]
                  ? "text-xs text-red-500 border-red-500"
                  : "placeholder:text-gray-400"
              }
              placeholder="Your phone number"
              onChange={handleChange}
            />
            <span
              className={errors["phone"] ? "text-xs text-red-500" : "hidden"}
            >
              {errors["phone"]}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">
              Message<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              className={
                errors["message"]
                  ? "text-xs text-red-500 border-red-500"
                  : "placeholder:text-gray-400 h-[100px]"
              }
              placeholder="Type your request or suggestion"
              onChange={(e) => {
                setPayload((prevState: ContactInfo) => ({
                  ...prevState,
                  [e.target.name]: e.target.value,
                }));
                ErrorLogger("message", null);
              }}
            />
            <span
              className={errors["message"] ? "text-xs text-red-500" : "hidden"}
            >
              {errors["message"]}
            </span>
          </div>
          <Button type="submit" className="w-full">
            {loading?"Loading...":"Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default ContactUsForm;
