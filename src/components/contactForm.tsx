'use client'

import { Input } from '@/components/ui/input'
import { TextArea } from '@/components/ui/textArea'
import { Mail, MessageSquare, Phone, Send, User } from 'lucide-react'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import emailjs from '@emailjs/react-native'

type FormInputs = {
    name: string
    email: string
    phone: number
    message: string
}

export default function ContactForm() {
    const [processing, setProcessing] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>()

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        setProcessing(true)
        const emailParams = {
            name: data.name,
            email: data.email,
            message: data.message + ' - ' + data.phone,
            title: 'DataTor Feedback',
        }

        emailjs
            .send('service_qgcydgp', 'template_0hkpgla', emailParams, {
                publicKey: 'oZSZOIdj9ZPietyQL',
            })
            .then(
                (response) => {
                    console.log('SUCCESS!', response.status, response.text)
                },
                (err) => {
                    console.log('FAILED...', err)
                }
            )

        setProcessing(false)
    }

    return (
        <div className="flex h-max w-[40rem] flex-col overflow-clip rounded-2xl shadow-md/20">
            <div className="bg-tertiary text-bg w-full px-6 py-4">
                <h3 className="text-xl font-extrabold">Send Me a Message</h3>
                <div className="text-bg-dark">
                    Fill out the form to get into contact with me for any reason
                </div>
            </div>

            <form
                className="bg-bg grid grid-cols-2 gap-4 p-4 pt-8"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    className="col-span-2"
                    error={errors.name ? true : false}
                    placeholder="Name *"
                    {...register('name', { required: true })}
                    icon={<User />}
                />

                <Input
                    placeholder="Email *"
                    type="email"
                    error={errors.email ? true : false}
                    {...register('email', { required: true })}
                    icon={<Mail />}
                />

                <Input
                    {...register('phone', { valueAsNumber: true })}
                    type="tel"
                    placeholder="Phone"
                    icon={<Phone />}
                />

                <TextArea
                    className="col-span-2"
                    error={errors.message ? true : false}
                    placeholder="Message *"
                    {...register('message', { required: true })}
                    icon={<MessageSquare />}
                />

                <div className="bg-tertiary text-bg col-span-2 mt-4 flex w-full items-center justify-center rounded-lg text-center font-bold shadow">
                    {processing ? (
                        <>
                            <svg
                                className="text-bg mr-2 size-5 animate-spin fill-none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <p className="my-2">Sending...</p>
                        </>
                    ) : (
                        <>
                            {/* <Send className="mr-1" /> */}
                            <input
                                type="submit"
                                className="my-2 h-full w-full cursor-pointer"
                                value="Send Message"
                            />
                        </>
                    )}
                </div>
            </form>
        </div>
    )
}
