

interface BadgeProps {
    text: string,
    colour: string
}


export function Badge({ text, colour }: BadgeProps) {

    const colourVariants : Record<string, string> = {
        "red": "bg-red-500",
        "blue": "bg-blue-500",
        "green": "bg-green-500",
        "grey": "bg-gray-500",
    }

    return (
        <div className={`${colourVariants[colour]} rounded-full w-min px-3 flex justify-center `}>
            {text}
        </div>
    )
}