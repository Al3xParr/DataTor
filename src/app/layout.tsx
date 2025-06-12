import type { Metadata } from "next";
import "./globals.css";
import "tailwindcss";
import "@radix-ui/themes/styles.css";;
import { Mountain } from "lucide-react";
import React from "react";

export const metadata: Metadata = {
    title: "DataTor - The UKC Climbing Logbook Analyser",
    description: "Gain deeper insight into your climbing logbook, looking at stats and graphs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`antialiased flex flex-col items-center`}
            >

                <header className="w-screen py-2 bg-primary flex items-center font-primary font-extrabold font-bolder text-dark  align-middle leading-0">
                    <Mountain className="ml-5 mr-1 mb-1" strokeWidth="3" size={30} color="#2a1f2d" />
                    <h1 className="text-3xl whitespace-pre max-h-min">
                        DataTor&nbsp;&nbsp;
                    </h1>
                    <h2 className="text-xl h-full">The Climbing Logbook Analyser</h2>

                </header>
                <div className="w-screen max-w-[93.75rem] text-dark font-primary font-medium text-lg flex flex-col items-center justify-around">
                    {children}
                </div>

            </body>
        </html>
    );
}
