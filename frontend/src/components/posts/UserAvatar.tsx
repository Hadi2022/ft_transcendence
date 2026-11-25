import { useState } from "react"

const DEFAULT_AVATAR = "/img/default-avatar.svg"

type UserAvatarProps = {
    src: string | null
    alt?: string
    className?: string
}

export default function UserAvatar({ src, alt = "", className = ""}: UserAvatarProps) {

    const [failed, setFailed] = useState(false)
    const [prevSrc, setPrevSrc] = useState(src)

    if (src !== prevSrc) {
        setPrevSrc(src)
        setFailed(false)
    }

    const shownSrc = src === null || failed ? DEFAULT_AVATAR : src

    return (
        <img src={shownSrc}
                alt={alt}
                onError={() => {
                    if (shownSrc !== DEFAULT_AVATAR)
                        setFailed(true)
                }}
                className={`shrink-0 rounded-full object-cover bg-transcendence ${className}`} />
    )
}