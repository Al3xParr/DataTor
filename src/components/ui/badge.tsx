import React from "react";

interface BadgeProps {
    text: string,
    colour: string
}


export function Badge({ text, colour }: BadgeProps) {

    const colourVariants : Record<string, string> = {
        "primary": "bg-primary text-new-white",
        "secondary": "bg-secondary text-new-white",
        "tertiary": "bg-tertiary text-new-white",
        "tertiary-gray": "bg-tertiary text-gray-200",
        "accent": "bg-accent text-primary",
        "disabled": "",
    }

    return (
        <div className={`${colourVariants[colour]} e rounded-full w-min px-3 flex justify-center font-bold `}>
            {text}
        </div>
    )
}