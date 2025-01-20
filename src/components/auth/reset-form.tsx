"use client";

import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useState } from "react";
import { ErrorProps, LoginProps } from "@/interfaces/authForm";
import { Label } from "../ui/label";
import { InputError } from "../input-error";
import { sendPasswordResetLink } from "@/app/httpservices/users";
import { toast } from "react-toastify";
import Email from "next-auth/providers/email";
export const ResetForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorProps>({});
  const ErrorLogger = (errorKey: string, errorMessage: string | null) => {
    setErrors((prevState: LoginProps) => ({
      ...prevState,
      [errorKey]: errorMessage,
    }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    ErrorLogger(e.target.name, null);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    if (email.value == "") {
      ErrorLogger("email", "Email address is required.");
    } else {
      try {
        setLoading(true)
        const message = await sendPasswordResetLink({ email: email.value });
        toast.success(message);
        form.reset();
        setLoading(false)
      } catch (err) {
        toast.error("Could not send password link");
      }
    }
  };

  return (
    <CardWrapper
      headerLabel="Forgot Password?"
      backButtonLabel="Back to Login"
      backButtonHref="/"
      showSocial={false}
      showFooter={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="name@example.com"
              id="email"
              className={
                errors["email"]
                  ? "text-xs text-red-500 border-red-500"
                  : "placeholder:text-gray-400"
              }
              onChange={handleChange}
            />
            <InputError errors={errors} fieldName="email" />
          </div>
        </div>
        <FormError message="" />
        <FormSuccess message="" />
        <Button type="submit" className="w-full" disabled={loading}>
          Send reset email
        </Button>
      </form>
    </CardWrapper>
  );
};
