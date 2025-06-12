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
        className={`antialiased`}
      >

          <span className="w-screen py-2 bg-primary flex font-primary font-extrabold text-3xl font-bolder text-dark">
            <Mountain className="ml-5 mr-1" strokeWidth="3" size={30} color="#2a1f2d"/>
            <div className="flex items-center whitespace-pre">DataTor&nbsp;<p className="text-xl items-end ">- The Climbing Logbook Analyser</p></div>
            
          </span>
          <div className="w-screen text-dark font-primary font-medium text-lg flex justify-around">
            {children}
            </div>

      </body>
    </html>
  );
}
