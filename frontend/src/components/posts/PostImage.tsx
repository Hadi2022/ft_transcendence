import { useState } from "react"
import { useTranslation } from "react-i18next"

type PostImageProps = {
    src: string
    alt: string
    className?: string
}

export default function PostImage({ src, alt, className = "" }: PostImageProps) {

    const { t } = useTranslation()
    const [failedSrc, setFailedSrc] = useState<string|null>(null)

    if (failedSrc === src)
        return (
            <div role="img" aria-label={t("posts.view.imageError")}
                    className={`flex flex-col items-center justify-center gap-2
                                bg-surface text-soft-text ${className}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className="size-10" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="m21 16-5-5-9 9" />
                </svg>
                <p className="text-sm">{ t("posts.view.imageError") }</p>
            </div>
        )

    return (
        <img src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onError={() => setFailedSrc(src)}
                className={`block ${className}`} />
    )

}