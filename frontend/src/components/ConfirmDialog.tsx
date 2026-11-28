import { useEffect, useId, useRef } from "react"
import { useTranslation } from "react-i18next"

type ConfirmDialogProps = {
    open: boolean
    title: string
    message: string
    confirmLabel: string
    isPending?: boolean
    error?: string | null
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    open, title, message, confirmLabel,
    isPending = false,
    error = null,
    onConfirm, onCancel
}: ConfirmDialogProps) {

    const { t } = useTranslation()
    const titleId = useId()
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (open && !dialog.open) dialog.showModal()
        if (!open && dialog.open) dialog.close()
    }, [open])

    return (
        <dialog ref={dialogRef}
                aria-labelledby={titleId}
                onCancel={(e) => {
                    e.preventDefault()
                    if (!isPending) onCancel()
                }}
                className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl
                            bg-surface p-6 text-text backdrop:bg-black/60">
            <h2 id={titleId} className="text-lg font-semibold">{ title }</h2>
            <p className="mt-2 text-sm text-soft-text">{ message }</p>

            { error && (
                <p role="alert" className="mt-3 text-sm text-danger">{ error }</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <button type="button"
                        onClick={onCancel}
                        disabled={isPending}
                        className="rounded-md bg-soft-text/20 px-4 py-2 text-sm
                                    font-medium hover:bg-soft-text/30 transition-colors
                                    cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    { t("cancel") }
                </button>
                <button type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="rounded-md bg-danger px-4 py-2 text-sm
                                    font-medium text-white hover:bg-danger/80
                                    transition-colors cursor-pointer disabled:opacity-50
                                    disabled:cursor-not-allowed">
                    { confirmLabel }
                </button>
            </div>
        </dialog>
    )
}