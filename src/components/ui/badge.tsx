import React from "react";

interface BadgeProps {
    text: string,
    colour?: string
}


export function Badge({ text, colour="default" }: BadgeProps) {

    const colourVariants : Record<string, string> = {
        "default": "bg-tertiary text-bg",
        "light-text": "bg-tertiary text-bg-light",
    }

    return (
        <div className={`${colourVariants[colour]} rounded-full w-min px-3 flex justify-center font-bold `}>
            {text}
        </div>
    )
}