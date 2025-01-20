"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!response) {
        toast.error("Authentication failed");
        setLoading(false);
        return;
      }
      if (response.error) {
        switch (response.status) {
          case 400:
            toast.error("Email and password are required");
            break;
          case 401:
            toast.error("Invalid email or password");
            break;
          case 404:
            toast.error("User not found");
            break;
          case 500:
            toast.error("Server error occurred");
            break;
          default:
            toast.error("Authentication failed");
        }
      } else if (response.ok) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-3">
                <Image
                  src="/images/loginOne.png"
                  alt="logo"
                  width={100}
                  height={100}
                />
                <div>
                <h1 className="text-2xl font-bold text-[#2d77de]">
                  Welcome back
                </h1>
                <p className="text-balance text-muted-foreground">
                  Login into logione
                </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center w-full">
                <div className="flex items-center justify-between w-full">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/reset"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="*******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#2d77de]"
                disabled={loading || !email || !password}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/images/logimage.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
