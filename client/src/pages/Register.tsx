import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import type { InsertUser } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const { register, isRegistering, user } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      role: 'student',
      membershipStatus: 'pending'
    }
  });

  if (user) {
    setLocation("/");
    return null;
  }

  const onSubmit = (data: InsertUser) => {
    register(data, {
      onSuccess: () => setLocation("/login"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="absolute top-8 left-8 hidden md:block">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-lg shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-display font-bold text-center">Become a Member</CardTitle>
          <CardDescription className="text-center">
            Join the community to unlock exclusive events and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...form.register("name")} placeholder="John Doe" />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="rollNumber">Roll Number (Optional)</Label>
                <Input id="rollNumber" {...form.register("rollNumber")} placeholder="123456" />
                {form.formState.errors.rollNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.rollNumber.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder="john@university.edu" />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-4" disabled={isRegistering}>
              {isRegistering ? "Creating Account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-500">
          <div>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
