'use client'

import * as React from 'react';
import Link from "next/link";

import { TERM_URL, PRIVACY_URL } from "@/constants/pageUrls";


const Footer = () => {
    return (
        <footer className="border-t py-6 md:py-0 px-[20px]">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} TaskApproval. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <Link href={TERM_URL} className="hover:underline">
                        Terms
                    </Link>
                    <Link href={PRIVACY_URL} className="hover:underline">
                        Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
