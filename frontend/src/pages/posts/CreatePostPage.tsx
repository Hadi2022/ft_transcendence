import { useEffect, useId, useRef, useState, type ChangeEvent, type SubmitEvent } from "react"
import { useTranslation } from "react-i18next"
import { getImageSize } from "../../utils/image"
import { useLocation, useNavigate } from "react-router"
import { ApiError } from "../../services/api"
import { ErrorDetails } from "@transcendence/shared/errors/error-details"
import { createPost } from "../../services/posts"

const POST_IMAGE_MAX_SIZE = 6 * 1024 * 1024
const POST_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const CAPTION_MAX_LENGTH = 400
const POST_IMAGE_MAX_PIXELS = 25_000_000 // same as backend MAX_IMAGE_PIXELS

function getCreatePostErrorKey(err: unknown): string {
    if (err instanceof TypeError)
        return "posts.create.network"
    if (!(err instanceof ApiError))
        return "posts.create.publishError"
    if (err.status === 401)
        return "posts.create.sessionExpired"
    if (err.status === 413 || err.details.image === ErrorDetails.IMAGE_TOO_LARGE)
        return "posts.create.tooLarge"
    if (err.details.image === ErrorDetails.IMAGE_INVALID_FORMAT)
        return "posts.create.invalidType"
    if (err.details.image === ErrorDetails.IMAGE_INVALID_CONTENT)
        return "posts.create.invalidImage"
    if (err.details.caption)
        return "posts.create.invalidCaption"
    return "posts.create.publishError"
}

export default function CreatePostPage() {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    
    const from = (location.state as {from?: string} | null)?.from ?? "/"

    const [image, setImage] = useState<File|null>(null)
    const [previewUrl, setPreviewUrl] = useState<string|null>(null)
    const [imageError, setImageError] = useState<string|null>(null)
    const [caption, setCaption] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string|null>(null)

    const inputRef = useRef<HTMLInputElement>(null)
    const validationIdRef = useRef(0)
    const abortRef = useRef<AbortController|null>(null)

    const hintId = useId()
    const captionId = useId()
    const counterId = useId()

    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    useEffect(() => {
        if (!previewUrl) return
        return () => URL.revokeObjectURL(previewUrl)
    }, [previewUrl])

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return

        const validationId = ++validationIdRef.current
        setImageError(null)
        setSubmitError(null)

        if (!POST_IMAGE_TYPES.includes(file.type)) {
            setImageError("posts.create.invalidType")
            return
        }

        if (file.size > POST_IMAGE_MAX_SIZE) {
            setImageError("posts.create.tooLarge")
            return
        }

        const size = await getImageSize(file)
        if (validationId !== validationIdRef.current) return

        if (!size) {
            setImageError("posts.create.invalidImage")
            return
        }

        if (size.width * size.height > POST_IMAGE_MAX_PIXELS) {
            setImageError("posts.create.tooManyPixels")
            return
        }

        setImage(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    function openFilePicker() {
        inputRef.current?.click()
    }

    function handleRemoveImage() {
        validationIdRef.current++
        setImage(null)
        setPreviewUrl(null)
        setImageError(null)
    }

    function handleCancel() {
        navigate(from, {replace: true})
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!image || isSubmitting) return

        setSubmitError(null)
        setImageError(null)
        setIsSubmitting(true)

        const controller = new AbortController()
        abortRef.current = controller

        try {
            await createPost(image, caption, controller.signal)
            // TODO: navigate to /posts/:id
        } catch (err) {
            if (controller.signal.aborted) return
            const key = getCreatePostErrorKey(err)
            if (err instanceof ApiError && err.details.image)
                setImageError(key)
            else
                setSubmitError(key)
        } finally {
            if (!controller.signal.aborted)
                setIsSubmitting(false)
        }
    }
    
    return (
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
            <header>
                <h3 className="text-lg font-semibold">{ t("posts.create.title") }</h3>
                <p className="text-sm text-soft-text">{ t("posts.create.subtitle") }</p>
            </header>

            <form onSubmit={handleSubmit} noValidate
                    className="flex flex-col gap-5 rounded-xl bg-surface p-4 sm:p-6">
                <input ref={inputRef} type="file" hidden
                        accept={POST_IMAGE_TYPES.join(",")}
                        onChange={handleFileChange} />

                <div className="space-y-2">
                    <span className="block text-sm font-semibold uppercase tracking-wide">
                        { t("posts.create.imageLabel") }
                    </span>

                    { previewUrl ? (
                        <div className="relative aspect-square w-full overflow-hidden
                                        rounded-lg bg-transcendence">
                            <img src={previewUrl} alt={ t("posts.create.previewAlt") }
                                    className="size-full object-contain"/>

                            <div className="absolute right-2 top-2 flex gap-2">
                                <button type="button" onClick={openFilePicker}
                                        disabled={isSubmitting}
                                        className="rounded-md bg-black/60 px-3 py-1.5 text-xs
                                                    font-medium text-white
                                                    hover:bg-black/80 transition-colors
                                                    cursor-pointer 
                                                    disabled:opacity-50 
                                                    disabled:cursor-not-allowed">
                                    { t("posts.create.changeImage") }
                                </button>

                                <button type="button" onClick={handleRemoveImage}
                                        disabled={isSubmitting}
                                        className="rounded-md bg-black/60 px-3 py-1.5 text-xs
                                                    font-medium text-white
                                                    hover:bg-danger transition-colors
                                                    cursor-pointer
                                                    disabled:opacity-50 
                                                    disabled:cursor-not-allowed">
                                    { t("posts.create.removeImage") }
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button type="button" onClick={openFilePicker}
                                aria-describedby={hintId}
                                className="flex aspect-square w-full flex-col items-center
                                            justify-center gap-3 rounded-lg border-2 border-dashed
                                            border-soft-text/30 text-soft-text hover:border-primary
                                            hover:text-text transition-colors cursor-pointer">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                            className="size-10" aria-hidden="true">
                                        <rect x="3" y="4" width="18" height="16" rx="2" />
                                        <circle cx="9" cy="10" r="2" />
                                        <path d="m21 16-5-5-9 9" />
                                    </svg>
                                    <span className="font-medium">{ t("posts.create.selectImage") }</span>
                        </button>
                    )}
                    <p id={hintId} className="text-xs text-soft-text">
                        { t("posts.create.imageHint") }
                    </p>
                    { imageError && (
                        <p role="alert" className="text-sm text-danger">{ t(imageError) }</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label htmlFor={captionId}
                            className="block text-sm font-semibold
                                        uppercase tracking-wide">
                        { t("posts.create.caption") }
                    </label>

                    <textarea id={captionId}
                                value={caption}
                                disabled={isSubmitting}
                                onChange={(e) => setCaption(e.target.value)}
                                maxLength={CAPTION_MAX_LENGTH}
                                rows={3} 
                                placeholder={ t("posts.create.captionPlaceholder") }
                                aria-describedby={counterId}
                                className="w-full resize-y rounded-md bg-white px-3
                                            py-2 text-zinc-800 focus:outline-none" />

                    <p id={counterId}
                        className={`text-right text-xs
                                    ${caption.length >= CAPTION_MAX_LENGTH
                                        ? "text-danger"
                                        : "text-soft-text"}
                                    `}>
                        { caption.length } / { CAPTION_MAX_LENGTH }
                    </p>
                </div>

                { submitError && (
                    <p role="alert" className="text-sm text-danger">{ t(submitError) }</p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button type="button" onClick={handleCancel} disabled={isSubmitting}
                                className="rounded-md bg-soft-text/20 px-4 py-2
                                            text-sm font-medium hover:bg-soft-text/30
                                            transition-colors cursor-pointer
                                            disabled:opacity-50 disabled:cursor-not-allowed">
                        { t("posts.create.cancel") }
                    </button>

                    <button type="submit" disabled={!image || isSubmitting}
                                className="rounded-md bg-cyan-400 px-4 py-2 text-sm
                                            font-medium text-white hover:bg-cyan-300
                                            transition-colors cursor-pointer
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            disabled:hover:bg-cyan-400">
                        { isSubmitting ? t("posts.create.publishing") : t("posts.create.publish") }
                    </button>
                </div>

            </form>
        </div>
    )
}