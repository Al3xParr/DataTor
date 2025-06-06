

interface BadgeProps {
    text: string,
    colour: string
}


export function Badge({ text, colour }: BadgeProps) {

    const colourVariants : Record<string, string> = {
        "primary": "bg-primary text-darksecondary",
        "disabled": "bg-darksecondary text-gray-200",
    }

    return (
        <div className={`${colourVariants[colour]} rounded-full w-min px-3 flex justify-center font-bold `}>
            {text}
        </div>
    )
}