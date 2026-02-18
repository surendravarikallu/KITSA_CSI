import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoggingIn, user } = useAuth();
  const [, setLocation] = useLocation();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: () => setLocation("/"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-display font-bold text-center">Member Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input 
                id="username" 
                placeholder="john@example.com" 
                {...form.register("username")}
                className="bg-slate-50"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...form.register("password")}
                className="bg-slate-50"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-500">
          <div>
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Join CSI
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
