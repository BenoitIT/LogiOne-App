import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/app/httpservices/users";
import { ChangeEvent, FormEvent, useState } from "react";
import { passwordUpdate } from "@/interfaces/staff";
import { toast } from "react-toastify";

export const EditPasswordForm = ({ userId }: { userId: number }) => {
  const [payload, setPayload] = useState<passwordUpdate>({ userId: userId });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPayload((prevState: passwordUpdate) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleDataSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    try {
      const response = await updatePassword(payload);
      if (response?.status == 200) {
        toast.warn(response?.message);
        form.reset();
      } else {
        toast.warn(response?.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update password");
    }
  };
  return (
    <div className="w-full flex justify-center text-gray-700 mt-3 ml-2">
      <form onSubmit={handleDataSubmit}>
        <div className="grid gap-2 w-[280px] md:w-[300px]">
          <Label htmlFor="oldpassword">
            Current password<span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Enter the current one"
            name="oldpassword"
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="grid gap-2 w-[280px] md:w-[300px]">
            <Label htmlFor="newPassword">
              New password<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter the current one"
              name="newPassword"
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2 w-[280px] md:w-[300px]">
            <Label htmlFor="newPasswordConfirmation">
              Confirm password<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter the current one"
              name="newPasswordConfirmation"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button type="submit">Update password</Button>
        </div>
      </form>
    </div>
  );
};
