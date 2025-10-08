import type { Metadata } from "next";
import "./globals.css";
import "tailwindcss";
import "@radix-ui/themes/styles.css";
import { Info, Mountain } from "lucide-react";
import React from "react";

export const metadata: Metadata = {
    title: "DataTor - The Climbing Logbook Analyser",
    description: "Gain deeper insight into your climbing logbook, looking at stats and graphs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <body
                className={`antialiased flex flex-col items-center h-screen w-[vmin] bg-bg-dark`}
            >

                <header className="select-none w-full py-2 sticky top-0 flex bg-primary z-50 text-txt-header fill-txt-header items-center font-primary font-extrabold align-middle leading-0">
                    <a className="flex cursor-pointer" href="/">
                        <Mountain className="ml-5 mr-1 mb-1" strokeWidth="3" size={30} />
                        <h1 className="text-3xl whitespace-pre max-h-min">
                            DataTor&nbsp;&nbsp;
                        </h1>
                    </a>
                    <h2 className="text-lg font-medium h-full content-center">Climbing Logbook Analytics</h2>
                    <div className="grow-1"></div>
                    <a href="/info"><Info className="mr-5" /></a>
                </header>
                <div className="w-full h-max text-txt font-primary font-normal text-base flex flex-col items-center justify-around">
                    {children}
                </div>
                <div className="grow-1" />
                <footer className="bg-primary text-txt-header w-full py-2 font-primary text-center justify-self-end text-wrap" >
                    None of your data is saved, when you leave the site all data is forgotten
                </footer>

            </body>
        </html>
    );
}
