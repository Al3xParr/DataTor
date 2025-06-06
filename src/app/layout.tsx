import type { Metadata } from "next";
import "./globals.css";
import "tailwindcss";
import "@radix-ui/themes/styles.css";;
import { Mountain } from "lucide-react";

export const metadata: Metadata = {
  title: "Climbing Stat Machine",
  description: "Explore your climbing logbook",
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
            <p>Climbing Stat Machine</p>
          </span>
          <div className="w-screen text-dark font-primary font-medium text-lg flex justify-around">
            {children}
            </div>

      </body>
    </html>
  );
}
