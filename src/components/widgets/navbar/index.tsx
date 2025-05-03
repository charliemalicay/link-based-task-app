'use client'

import * as React from 'react';
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {BASE_URL, LOGIN_URL, REGISTER_URL} from "@/constants/pageUrls";


const Navbar = () => {
    return (
        <header className="bg-background border-b px-[20px]">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href={BASE_URL} className="flex items-center space-x-2">
                        <span className="font-bold inline-block">Task Approval</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <Link href={LOGIN_URL}>
                            <Button variant="ghost" className="p-[10px] text-sm rounded-sm cursor-pointer">
                                Login
                            </Button>
                        </Link>
                        <Link href={REGISTER_URL}>
                            <Button variant="default" className="p-[10px] text-sm rounded-sm cursor-pointer">
                                Sign up
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
