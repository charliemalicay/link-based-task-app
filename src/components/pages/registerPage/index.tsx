'use client'

import * as React from 'react';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useToast } from "@/hooks/use-toast";
import {DASHBOARD_URL, LOGIN_URL} from "@/constants/pageUrls";
import {API_AUTH_REGISTER} from "@/constants/apiUrls";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

import { toast } from "sonner";
import {registerUser} from "@/services/apiUsers";



const RegisterPage = () => {
    const router = useRouter()
    const { status } = useSession()

    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    // Redirect if already authenticated
    if (status === "authenticated") {
        router.push(DASHBOARD_URL);
        return null;
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!name.trim()) newErrors.name = "Name is required"
        if (!email.trim()) newErrors.email = "Email is required"
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
        if (!password) newErrors.password = "Password is required"
        if (password.length < 8) newErrors.password = "Password must be at least 8 characters"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true)

        try {
            const response = await registerUser({ name, email, password })

            if (!response) {
                throw new Error("Registration failed")
            }

            toast("Registration successful", {
                description: "You can now log in with your credentials.",
                action: {
                    label: "Done"
                },
            });

            router.push(LOGIN_URL)
        } catch (error) {
            console.error("Registration error:", error);

            toast("Registration failed", {
                description: error instanceof Error ? error.message : "Please try again later",
                action: {
                    label: "OK"
                },
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md space-y-4">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
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
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
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
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full px-[15px] text-base rounded-sm cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href={LOGIN_URL} className="text-primary underline">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default RegisterPage;

