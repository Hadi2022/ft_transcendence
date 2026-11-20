import { useEffect, useId, useRef, useState, type ChangeEvent, type SubmitEvent } from "react"
import { useTranslation } from "react-i18next"
import InputComponent from "../../components/InputComponent"

export default function CreatePostPage() {
    const { t } = useTranslation()
    const captionId = useId()
    const inputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isImageReady, setIsImageReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (previewUrl) return () => URL.revokeObjectURL(previewUrl)
    }, [previewUrl])

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        setIsImageReady(false)
        setPreviewUrl(null)
        setError(null)
        if (!file) return
        if (!file.type.startsWith("image/")) {
            setError("posts.errors.invalidImage")
            e.target.value = ""
            return
        }
        setPreviewUrl(URL.createObjectURL(file))
    }

    function handleImageError() {
        setIsImageReady(false)
        setPreviewUrl(null)
        setError("posts.errors.invalidImage")
        if (inputRef.current) inputRef.current.value = ""
    }

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!isImageReady) setError("posts.errors.imageRequired")
    }

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <h1 className="text-2xl font-semibold">{ t("posts.title") }</h1>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <InputComponent ref={inputRef} type="file" name="image" label={t("posts.image")}
                                accept="image/*" required onChange={handleFileChange} />
                <p className="text-xs text-soft-text">{ t("posts.imageHint") }</p>
                { previewUrl && (
                    <img key={previewUrl} src={previewUrl} alt={t("posts.preview")}
                         onLoad={() => setIsImageReady(true)} onError={handleImageError}
                         className="max-h-96 w-full rounded-md object-contain bg-surface" />
                )}
                <div className="space-y-1">
                    <label htmlFor={captionId} className="block text-sm font-semibold uppercase tracking-wide">
                        { t("posts.caption") }
                    </label>
                    <textarea id={captionId} name="caption" rows={4}
                              className="w-full resize-y rounded-md bg-white px-3 py-2 text-zinc-800" />
                </div>
                <button type="submit" disabled={!isImageReady}
                        className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-medium text-white
                                   hover:bg-cyan-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    { t("posts.publish") }
                </button>
                { error && <p role="alert" className="text-sm text-danger">{ t(error) }</p> }
            </form>
        </div>
    )
}
