import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Registration form schema
const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loginMutation, registerMutation } = useAuth();

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      terms: false,
    },
    mode: "onSubmit", // Only validate on submit
  });
  
  // Reset form errors when switching between login and register
  useEffect(() => {
    if (!isLogin) {
      registerForm.clearErrors();
    } else {
      loginForm.clearErrors();
    }
  }, [isLogin, registerForm, loginForm]);

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    console.log("Registration form values:", values);
    const { terms, ...userData } = values;
    console.log("Data being sent to server:", userData);
    
    // Add extra validation to ensure name is present
    if (!userData.name || userData.name.trim() === '') {
      console.error("Name is required but was empty");
      return;
    }
    
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white p-8 flex items-center justify-center md:w-1/2">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">CRM System</h1>
          <p className="text-xl mb-6">
            Manage your customers effectively with our comprehensive Customer
            Relationship Management solution.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-500 p-2 mr-3">
                <i className="fas fa-check"></i>
              </div>
              <p className="text-white text-left">Track customer information</p>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-blue-500 p-2 mr-3">
                <i className="fas fa-check"></i>
              </div>
              <p className="text-white text-left">Monitor customer status</p>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-blue-500 p-2 mr-3">
                <i className="fas fa-check"></i>
              </div>
              <p className="text-white text-left">Analyze customer data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Forms */}
      <div className="bg-gray-100 p-8 flex items-center justify-center md:w-1/2">
        <div className="w-full max-w-md">
          {/* Login Form */}
          {isLogin ? (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Login</h2>
                <p className="text-gray-600 mt-2">
                  Sign in to access your account
                </p>
              </div>

              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Remember me</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sign In
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Register now
                  </button>
                </p>
              </div>
            </div>
          ) : (
            // Register Form
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Register</h2>
                <p className="text-gray-600 mt-2">
                  Create an account to use the CRM
                </p>
              </div>

              <Form {...registerForm}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    
                    const name = registerForm.getValues("name");
                    const username = registerForm.getValues("username");
                    const password = registerForm.getValues("password");
                    const terms = registerForm.getValues("terms");
                    
                    let hasErrors = false;
                    
                    // Manual validation
                    if (!name || name.trim() === '') {
                      registerForm.setError("name", { message: "Full name is required" });
                      hasErrors = true;
                    }
                    
                    if (!username || username.trim() === '') {
                      registerForm.setError("username", { message: "Username is required" });
                      hasErrors = true;
                    }
                    
                    if (!password || password.length < 6) {
                      registerForm.setError("password", { message: "Password must be at least 6 characters" });
                      hasErrors = true;
                    }
                    
                    if (!terms) {
                      registerForm.setError("terms", { message: "You must accept terms" });
                      hasErrors = true;
                    }
                    
                    if (!hasErrors) {
                      onRegisterSubmit({
                        name,
                        username,
                        password,
                        terms
                      });
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={registerForm.watch("name") || ""}
                      onChange={(e) => registerForm.setValue("name", e.target.value)}
                      type="text"
                      autoComplete="name"
                      className="w-full"
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-500">Full name is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <Input
                      id="username"
                      placeholder="Choose a username"
                      value={registerForm.watch("username") || ""}
                      onChange={(e) => registerForm.setValue("username", e.target.value)}
                      type="text"
                      autoComplete="username"
                      className="w-full"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-500">Username is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerForm.watch("password") || ""}
                        onChange={(e) => registerForm.setValue("password", e.target.value)}
                        autoComplete="new-password"
                        className="w-full"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">Password must be at least 6 characters</p>
                    )}
                  </div>



                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="terms"
                      checked={registerForm.watch("terms") || false}
                      onCheckedChange={(checked) => registerForm.setValue("terms", checked === true)}
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="terms" className="text-sm font-medium">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                  {registerForm.formState.errors.terms && (
                    <p className="text-sm text-red-500 mt-1">You must accept the terms and conditions</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Account
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
