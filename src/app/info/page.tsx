import ContactForm from '@/components/contactForm'
import React from 'react'

export default function Info() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-cover bg-top-left bg-no-repeat pt-30 md:bg-[url(../../resources/bgSVG.svg)]">
            <ContactForm />
        </div>
    )
}
