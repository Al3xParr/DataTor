import type { Metadata } from 'next'
import './globals.css'
import 'tailwindcss'
import '@radix-ui/themes/styles.css'
import { Info, Mountain } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'DataTor - The Climbing Logbook Analyser',
    description:
        'Gain deeper insight into your climbing logbook, looking at stats and graphs',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <body
                className={`bg-bg-dark flex h-screen w-[vmin] flex-col items-center antialiased`}
            >
                <header className="bg-primary text-txt-header fill-txt-header font-primary sticky top-0 z-50 flex w-full items-center py-2 align-middle leading-0 font-extrabold select-none">
                    <a className="flex cursor-pointer" href="/">
                        <Mountain
                            className="mr-1 mb-1 ml-2 md:ml-5"
                            strokeWidth="3"
                            size={30}
                        />
                        <h1 className="max-h-min text-3xl whitespace-pre">
                            DataTor&nbsp;&nbsp;
                        </h1>
                    </a>
                    <h2 className="h-full content-center text-lg font-medium">
                        Climbing Logbook Analytics
                    </h2>
                    <div className="grow-1"></div>
                    <Link href="/info">
                        <Info className="mr-5" />
                    </Link>
                </header>
                <div className="text-txt font-primary flex h-max w-full flex-col items-center justify-around text-base font-normal">
                    {children}
                </div>
                <div className="grow-1" />
                <footer className="bg-primary text-txt-header font-primary w-full justify-self-end py-2 text-center text-wrap">
                    None of your data is saved, when you leave the site all data
                    is forgotten
                </footer>
            </body>
        </html>
    )
}
