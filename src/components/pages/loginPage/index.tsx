"use client"

import * as React from 'react';
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DASHBOARD_URL, FORGOT_PASSWORD_URL, REGISTER_URL } from "@/constants/pageUrls";
import {toast} from "sonner";


const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { status } = useSession();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Get return URL from query parameters or use default
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    // Redirect if already authenticated
    if (status === "authenticated") {
        router.push(callbackUrl)
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast('Error', {
                description: "Please enter both email and password",
                action: {
                    label: "Ok"
                }
            });
            return null
        }

        setIsSubmitting(true)

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            })

            if (result?.error) {
                throw new Error("Invalid email or password")
            }

            toast("Login successful", {
                description: "Welcome back!",
                action: {
                    label: "Ok"
                }
            })

            // Navigate to callback URL or dashboard
            router.push(callbackUrl);
            router.refresh();

        } catch (error) {
            console.error("Login error:", error)
            toast("Login failed", {
                description: error instanceof Error ? error.message : "Please check your credentials",
                action: {
                    label: "Ok"
                },
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Log in</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href={FORGOT_PASSWORD_URL} className="text-sm text-primary">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full px-[15px] text-base rounded-sm cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Log in"}
                        </Button>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href={REGISTER_URL} className="text-primary underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default LoginPage;
