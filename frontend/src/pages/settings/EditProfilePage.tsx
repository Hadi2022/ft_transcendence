import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { getCurrentUser, type UserProfile } from "../../services/auth"
import InputComponent from "../../components/InputComponent"
import ProfileTextForm from "./components/ProfileTextForm"
import AvatarSection from "./components/AvatarSection"

type LoadState = 
    | { status: "loading" }
    | { status: "ready", user: UserProfile }
    | { status: "error" }

export default function EditProfilePage() {

    const { t } = useTranslation()

    const [state, setState] = useState<LoadState>({status: "loading"})
    const lastRequest = useRef(0)

    function loadUser() {
        lastRequest.current += 1
        const requestId = lastRequest.current

        getCurrentUser()
            .then((user) => {
                if (requestId !== lastRequest.current) return
                setState({ status: "ready", user })
            })
            .catch(() => {
                if (requestId !== lastRequest.current) return
                setState({ status: "error" })
            })
    }

    useEffect(() => {
        loadUser()

        return () => {
            lastRequest.current += 1
        }
    }, [])

    function updateUser(changes: Partial<UserProfile>) {
        setState((prev) => 
            prev.status === "ready"
            ? { status: "ready", user: { ...prev.user, ...changes} }
            : prev
        )
    }

    function handleRetry() {
        setState({ status: "loading" })
        loadUser()
    }

    if (state.status === "loading")
        return (
            <div className="animate-pulse flex flex-col gap-4">
                <div className="h-6 w-40 rounded bg-soft-text/20" />
                <div className="h-4 w-24 rounded bg-soft-text/20" />
                <div className="h-10 rounded bg-soft-text/20" />
            </div>
        )
    
    if (state.status === "error")
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-sm text-red-500">{ t("settings.profile.loadError") }</p>
                <button type="button" onClick={handleRetry}
                        className="rounded bg-soft-text/20 px-4 py-2 hover:bg-soft-text/30 cursor-pointer">
                    { t("retry") }
                </button>
            </div>
        )

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold">{ t("settings.profile.title") }</h3>

            <AvatarSection avatarUrl={state.user.avatarUrl}
                            onAvatarChange={(avatarUrl) => updateUser({avatarUrl})} />

            <div className="flex flex-col gap-1">
                <InputComponent label={ t("auth.username") }
                                value={state.user.username}
                                readOnly
                                className="text-zinc-500 cursor-default" />
                <p className="text-xs text-soft-text">{ t("settings.profile.usernameHint") }</p>
            </div>

            <ProfileTextForm user={state.user}
                                onSaved={(updated) => updateUser(updated)} />
        </div>
    )
}