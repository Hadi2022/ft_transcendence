import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { deletePost } from "../../services/posts"
import ConfirmDialog from "../ConfirmDialog"

type PostMenuProps = {
    postId: string
    onDeleted: () => void
}

export default function PostMenu({ postId, onDeleted }: PostMenuProps) {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string|null>(null)
    const abortRef = useRef<AbortController|null>(null)

    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    function openConfirm() {
        setIsOpen(false)
        setError(null)
        setIsConfirmOpen(true)
    }

    async function handleDelete() {
        const controller = new AbortController()
        abortRef.current = controller

        setIsDeleting(true)
        setError(null)
        try {
            await deletePost(postId, controller.signal)
            setIsConfirmOpen(false)
            onDeleted()
        } catch (err) {
            if (controller.signal.aborted) return
            setError(err instanceof TypeError ? "posts.delete.network": "posts.delete.error")
            setIsDeleting(false)
        }
    }

    return (
        <div className="relative ml-auto">
            <button type="button"
                    onClick={() => setIsOpen(open => !open)}
                    disabled={isDeleting}
                    aria-label={t("posts.menu.options")}
                    aria-expanded={isOpen}
                    className="flex size-8 items-center justify-center rounded-full
                                text-soft-text hover:text-text transition-colors cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed
                                focus-visible:outline-2 focus-visible:outline-blue-400">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                </svg>
            </button>

            { isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

                    <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border
                                    border-soft-text/20 bg-surface py-1 shadow-lg">
                        <button type="button" onClick={openConfirm}
                                className="block w-full px-4 py-2 text-left text-sm
                                            text-danger hover:bg-danger/10 cursor-pointer">
                            { t("posts.delete.button") }
                        </button>
                    </div>
                </>
            )}

            <ConfirmDialog open={isConfirmOpen}
                            title={t("posts.delete.title")}
                            message={t("posts.delete.confirm")}
                            confirmLabel={isDeleting ? t("posts.delete.deleting") : t("posts.delete.button")}
                            isPending={isDeleting}
                            error={error ? t(error) : null}
                            onConfirm={handleDelete}
                            onCancel={() => setIsConfirmOpen(false)} />

        </div>
    )
}