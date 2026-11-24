import { useState } from "react"

const DEFAULT_AVATAR = "/img/default-avatar.svg"

type UserAvatarProps = {
    src: string | null
    alt?: string
    className?: string
}

export default function UserAvatar({ src, alt = "", className = ""}: UserAvatarProps) {

    const [failedSrc, setFailedSrc] = useState<string|null>(null)

    const shownSrc = src === null || src === failedSrc ? DEFAULT_AVATAR : src

    return (
        <img src={shownSrc}
                alt={alt}
                onError={() => {
                    if (shownSrc !== DEFAULT_AVATAR)
                        setFailedSrc(shownSrc)
                }}
                className={`shrink-0 rounded-full object-cover bg-transcendence ${className}`} />
    )
}