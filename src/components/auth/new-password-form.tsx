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
import { setNewPassword } from "@/app/httpservices/users";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

export const NewPasswordForm = () => {
  const param = useParams();
  const [errors, setErrors] = useState<ErrorProps>({});
  const token = param?.resetToken;
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
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const confirmPassword = form.elements.namedItem(
      "confirmPassword"
    ) as HTMLInputElement;
    if (password.value == "") ErrorLogger("password", "Password is required.");
    else if (password.value.length < 6)
      ErrorLogger("password", "Password should be at least 6 characters.");
    else if (!/[!@#$%^&*]/.test(password.value))
      ErrorLogger(
        "password",
        "Password should contain at least one special character."
      );
    else if (confirmPassword.value == "")
      ErrorLogger("confirmPassword", "Confirm password is required.");
    else if (password.value !== confirmPassword.value)
      ErrorLogger("confirmPassword", "Passwords do not match.");
    else {
      try {
        const response = await setNewPassword({
          token: token as string,
          password: password.value,
        });
        if(response?.status!=400){
        toast.success(response?.message);
        form.reset();
        }else{
          toast.error(response?.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not update your password");
      }
    }
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
      showSocial={false}
      showFooter={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              className={
                errors["password"]
                  ? "text-xs text-red-500 border-red-500"
                  : "placeholder:text-gray-400"
              }
              onChange={handleChange}
            />
            <InputError errors={errors} fieldName="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className={
                errors["confirmPassword"]
                  ? "text-xs text-red-500 border-red-500"
                  : "placeholder:text-gray-400"
              }
              onChange={handleChange}
            />
            <InputError errors={errors} fieldName="confirmPassword" />
          </div>
        </div>
        <FormError message="" />
        <FormSuccess message="" />
        <Button type="submit" className="w-full">
          Reset password
        </Button>
      </form>
    </CardWrapper>
  );
};
