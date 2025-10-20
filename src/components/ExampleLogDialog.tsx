import { Dialog } from 'radix-ui'

export default function ExampleLogDialog() {
    return (
        <Dialog.Root defaultOpen={true}>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="text-lg font-semibold">
                        Hello!
                    </Dialog.Title>
                    <p className="text-txt-muted mb-4 text-base">
                        Use this to explore an example logbook to see the
                        benefits
                    </p>
                    <div className="flex w-full justify-end">
                        <Dialog.Close asChild>
                            <button className="bg-grey-200 w-min cursor-pointer rounded bg-[#d6f1df] px-4 py-1 font-semibold text-[#218359] focus:outline-none dark:bg-[#113b29] dark:text-[#3dd68c]">
                                Close
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
