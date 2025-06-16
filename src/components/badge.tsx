import React from "react";

interface BadgeProps {
    text: string,
    colour: string
}


export function Badge({ text, colour }: BadgeProps) {

    const colourVariants : Record<string, string> = {
        "primary": "bg-primary text-secondary",
        "secondary": "bg-secondary text-primary",
        "tertiary": "bg-tertiary text-primary",
        "accent": "bg-accent text-primary",
        "disabled": "",
    }

    return (
        <div className={`${colourVariants[colour]} rounded-full w-min px-3 flex justify-center font-bold text-primary`}>
            {text}
        </div>
    )
}