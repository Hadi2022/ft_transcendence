import { useTranslation } from "react-i18next"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { removeAvatar, uploadAvatar } from "../../../services/users"

const DEFAULT_AVATAR="/img/default-avatar.svg"
const AVATAR_MAX_SIZE = 2 * 1024 * 1024
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"]

async function canDecodeImage(file: File): Promise<boolean>{
    try {
        const bitmap = await createImageBitmap(file)
        bitmap.close()
        return (true)
    } catch {
        return (false)
    }
}

type AvatarSectionProps = {
    avatarUrl: string | null
    onAvatarChange: (url: string | null) => void
    disabled: boolean
    onPendingChange: (pending: boolean) => void
}

type AvatarStatus = "idle" | "uploading" | "removing"

export default function AvatarSection({ avatarUrl, onAvatarChange, disabled, onPendingChange } : AvatarSectionProps) {

    const { t } = useTranslation()

    const [status, setStatus] = useState<AvatarStatus>("idle")
    const [error, setError] = useState<string | null>(null)

    const inputRef = useRef<HTMLInputElement>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    const isBusy = status !== "idle" || disabled

    useEffect(() => {
        return () => {
            if (avatarUrl?.startsWith("blob:"))
                URL.revokeObjectURL(avatarUrl)
        }
    }, [avatarUrl])

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return

        if (!AVATAR_TYPES.includes(file.type)) {
            setError("settings.avatar.invalidType")
            return
        }
        if (file.size > AVATAR_MAX_SIZE) {
            setError("settings.avatar.tooLarge")
            return
        }

        if (!(await canDecodeImage(file))) {
            setError("settings.avatar.invalidImage")
            return
        }

        const controller = new AbortController()
        abortRef.current = controller
        
        setError(null)
        setStatus("uploading")
        onPendingChange(true)
        try {
            const url = await uploadAvatar(file, controller.signal)
            onAvatarChange(url)
        } catch {
            if (controller.signal.aborted) return
            setError("settings.avatar.uploadError")
        } finally {
            if (!controller.signal.aborted) {
                setStatus("idle")
                onPendingChange(false)
            }
        }
    }

    async function handleRemove() {

        const controller = new AbortController()
        abortRef.current = controller

        setError(null)
        setStatus("removing")
        onPendingChange(true)
        try {
            await removeAvatar(controller.signal)
            onAvatarChange(null)
        } catch {
            if (controller.signal.aborted) return
            setError("settings.avatar.removeError")
        } finally {
            if (!controller.signal.aborted) {
                setStatus("idle")
                onPendingChange(false)
            }
        }
    }

    return (
        <section className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <img src={avatarUrl ?? DEFAULT_AVATAR}
                   alt={ t("settings.avatar.alt") }
                   onError={(e) => {
                       if (!e.currentTarget.src.endsWith(DEFAULT_AVATAR))
                           e.currentTarget.src = DEFAULT_AVATAR
                   }}
                   className={`size-24 shrink-0 rounded-full object-cover bg-surface
                               transition-opacity ${ isBusy ? "opacity-50" : "" }`} />

              <div className="flex flex-col items-center gap-2 sm:items-start">
                  <div className="flex flex-wrap justify-center gap-3">
                      <button type="button"
                              onClick={() => inputRef.current?.click()}
                              disabled={isBusy}
                              className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-medium text-white
                                         hover:bg-cyan-300 transition-colors cursor-pointer
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         disabled:hover:bg-cyan-400">
                          { status === "uploading" ? t("settings.avatar.uploading") :
                                t("settings.avatar.change") }
                      </button>

                      { avatarUrl && (
                          <button type="button"
                                  onClick={handleRemove}
                                  disabled={isBusy}
                                  className="rounded-md px-4 py-2 text-sm font-medium text-danger
                                             hover:bg-danger/10 transition-colors cursor-pointer
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             disabled:hover:bg-transparent">
                              { status === "removing" ? t("settings.avatar.removing") :
                                    t("settings.avatar.remove") }
                          </button>
                      )}
                  </div>
                  <p className="text-xs text-soft-text">{ t("settings.avatar.hint") }</p>

                  { error && (
                      <p role="alert" className="text-sm text-danger">{ t(error) }</p>
                  )}

                  <input ref={inputRef}
                         type="file"
                         accept="image/jpeg,image/png,image/webp"
                         onChange={handleFileChange}
                         className="hidden" />
              </div>
          </section>
    )

}