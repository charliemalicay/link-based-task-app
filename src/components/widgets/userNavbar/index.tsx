"use client";

import * as React from 'react';
import Link from "next/link";

import {signOut, useSession} from "next-auth/react";

import {LogOut, Settings, User} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {BASE_URL, DASHBOARD_SETTINGS_URL, PROFILE_URL} from "@/constants/pageUrls";


const UserNavbar = () => {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-10 border-b bg-background">
            <div className="container flex h-16 items-center justify-between py-4 px-[20px]">
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-bold">
                        Task Approval
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {session?.user?.name || "Account"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={PROFILE_URL}>
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={DASHBOARD_SETTINGS_URL}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut({ callbackUrl: BASE_URL })}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

export default UserNavbar;
