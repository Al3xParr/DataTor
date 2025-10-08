'use client'

import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/textArea"
import { Mail, MessageSquare, Phone, Send, User } from "lucide-react"
import { ChangeEvent, useState } from "react"

import emailjs from '@emailjs/react-native';


export default function ContactForm() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [telephone, setTelephone] = useState("")
    const [message, setMessage] = useState("")

    function handleSubmit() {


        const emailParams = {
            name: name,
            email: email,
            message: message + " - " + telephone,
            title: "DataTor Feedback"
        }

        emailjs
            .send('service_qgcydgp', 'template_0hkpgla', emailParams, {
                publicKey: 'oZSZOIdj9ZPietyQL',

            })
            .then(
                (response) => {
                    console.log('SUCCESS!', response.status, response.text);
                    setName("")
                    setEmail("")
                    setTelephone("")
                    setMessage("")
                },
                (err) => {
                    console.log('FAILED...', err);
                },
            );
    }

    return (
   
            <div className="flex flex-col shadow-md/20 rounded-2xl overflow-clip h-max w-[40rem]">
                <div className="bg-tertiary w-full px-6 py-4 text-bg ">
                    <h3 className="font-extrabold text-xl">
                        Send Me a Message
                    </h3>
                    <div className="text-bg-dark ">Fill out the form to get into contact with me for any reason</div>
                </div>

                <form className="grid grid-cols-2 p-4 pt-8 bg-bg gap-4">


                    <label className="col-span-2">

                        <Input
                            type={"text"}
                            name={"name"}
                            placeholder="Name"
                            value={name}
                            icon={<User />}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                        />
                    </label>

                    <label>

                        <Input
                            type={"email"}
                            name="email"
                            placeholder="Email"
                            value={email}
                            icon={<Mail />}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
                        />
                    </label>

                    <label>

                        <Input
                            type={"tel"}
                            name="telephone"
                            placeholder="Phone"
                            value={telephone}
                            icon={<Phone />}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTelephone(e.currentTarget.value)}
                        />
                    </label>

                    <label className="col-span-2">
                        <TextArea
                            name="message"
                            placeholder="Message..."
                            value={message}
                            icon={<MessageSquare />}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.currentTarget.value)}
                        />
                    </label>

                    <div
                        className=" flex w-full cursor-pointer bg-tertiary text-center justify-center rounded-lg col-span-2 shadow p-2 text-bg font-bold mt-4"
                        onClick={handleSubmit}
                    >Send Message
                    <Send className="ml-1" />
                    </div>

                </form>

            </div>
   
    )
}