import type { Metadata } from "next";
import "./globals.css";
import "tailwindcss";
import "@radix-ui/themes/styles.css";;
import { Mountain } from "lucide-react";
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
            <body
                className={`antialiased flex flex-col items-center h-screen w-[vmin]`}
            >

                <header className="w-full py-2 sticky top-0 flex bg-primary z-50 items-center font-primary font-extrabold text-secondary  align-middle leading-0">
                    <Mountain className="ml-5 mr-1 mb-1" strokeWidth="3" size={30} color="#0d260e " />
                    <h1 className="text-3xl whitespace-pre max-h-min">
                        DataTor&nbsp;&nbsp;
                    </h1>
                    <h2 className="text-lg font-medium h-full content-center">The Climbing Logbook Analyser</h2>

                </header>
                <div className="w-full h-max max-w-[93.75rem] text-secondary font-primary font-normal text-base flex flex-col items-center justify-around">
                    {children}
                </div>
                <div className="grow-1"/>
                <footer className="bg-primary w-full py-2 font-primary text-center justify-self-end text-wrap" >
                    None of your data is saved, when you leave the site all data is forgotten
                </footer>

            </body>
        </html>
    );
}
