import { PropsWithChildren } from "react";
import { Card } from "./card";

interface stepProps {
    number: number
}

export default function Step({ number, children }: PropsWithChildren<stepProps>) {

    return (
        <Card className="flex bg-bg flex-col items-center gap-5 text-center rounded-4xl w-80 p-8">
                <div className="justify-self-start w-16 h-16 rounded-full bg-tertiary flex items-center justify-center text-bg">{number}</div>
            {children}

        </Card>
    )

}