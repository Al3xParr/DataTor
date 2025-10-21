import { Dialog } from 'radix-ui'
import React from 'react'

export default function ExampleLogDialog() {
    return (
        <Dialog.Root defaultOpen={true}>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="text-lg font-semibold">
                        Welcome to DataTor!
                    </Dialog.Title>
                    <p className="text-txt-muted mt-1 mb-4 text-base whitespace-pre-line">
                        This is a preview of how your climbing stats will be
                        displayed using a demo logbook. Explore the breakdown of
                        what your logbook could look like
                    </p>

                    <div className="flex w-full justify-end">
                        <Dialog.Close asChild>
                            <button className="bg-grey-200 w-max cursor-pointer rounded bg-[#d6f1df] px-4 py-1 font-semibold text-[#218359] focus:outline-none dark:bg-[#113b29] dark:text-[#3dd68c]">
                                Get Started
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
