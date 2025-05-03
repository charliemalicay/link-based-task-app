'use client'

import * as React from 'react';
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ABOUT_URL, DASHBOARD_URL} from "@/constants/pageUrls";


const HomePage = () => {
    return (
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                        <div className="flex flex-col justify-center space-y-12">
                            <div className="space-y-6">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Streamline Task Approvals
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Create tasks, assign them via email, and collect approvals through secure tokenized links.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link href={DASHBOARD_URL}>
                                    <Button className="p-[20px] text-sm rounded-sm cursor-pointer gap-1">
                                        Get Started
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={ABOUT_URL}>
                                    <Button variant="outline" className="p-[20px] text-sm rounded-sm cursor-pointer">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Create Tasks</CardTitle>
                                        <CardDescription>Assign tasks to team members or clients</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <p className="text-sm text-muted-foreground">
                                            Create detailed tasks with deadlines, instructions, and attachments.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Email Assignments</CardTitle>
                                        <CardDescription>Automatic email notifications</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <p className="text-sm text-muted-foreground">
                                            Recipients get secure email links for quick approval or rejection.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Track Status</CardTitle>
                                        <CardDescription>Real-time monitoring</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <p className="text-sm text-muted-foreground">
                                            Track approval status with an intuitive dashboard interface.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Secure Access</CardTitle>
                                        <CardDescription>Tokenized links for security</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <p className="text-sm text-muted-foreground">
                                            One-time secure links ensure only intended recipients can respond.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default HomePage;
