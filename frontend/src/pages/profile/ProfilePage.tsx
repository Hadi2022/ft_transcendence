import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router"
import { getUserByUsername } from "../../services/users"
import { ApiError } from "../../services/api"
import type { UserProfile } from "../../services/auth"
import ProfileSkeleton from "./components/ProfileSkeleton"
import { useTranslation } from "react-i18next"

type ProfileResult = {
    username: string
    status: "ready" | "notFound" | "error"
    profile: UserProfile | null
}

export default function ProfilePage() {

    const { t } = useTranslation()

    const { username } = useParams()

    const [result, setResult] = useState<ProfileResult|null>(null)
    const lastRequest = useRef(0)

    function loadProfile(profileUsername: string) {
        lastRequest.current += 1
        const requestId = lastRequest.current

        getUserByUsername(profileUsername)
            .then((user) => {
                if (requestId !== lastRequest.current) return
                setResult({username: profileUsername, status: "ready", profile: user})
            })
            .catch((err: unknown) => {
                if (requestId !== lastRequest.current) return
                if (err instanceof ApiError && (err.status === 404 || err.status === 400))
                    setResult({ username: profileUsername, status: "notFound", profile: null })
                else
                    setResult({ username: profileUsername, status: "error", profile: null })
            })
    }

    useEffect(() => {
        if (!username) return
        loadProfile(username)

        return () => {
            lastRequest.current += 1
        }
    }, [username])

    function handleRetry() {
        if (!username) return
        setResult(null)
        loadProfile(username)
    }

    if (!result || result.username !== username)
        return <ProfileSkeleton />

    if (result.status === "notFound")
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <h2 className="text-xl font-semibold">{ t("profile.notFoundTitle") }</h2>
                <p className="text-soft-text">{ t("profile.notFoundText") }</p>
                <Link to="/" className="text-primary hover:underline">{ t("profile.backHome") }</Link>
            </div>
        )

    if (result.status === "error")
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-sm text-red-500">{ t("profile.loadError") }</p>
                <button onClick={handleRetry}
                        className="rounded bg-soft-text/20 px-4 py-2 hover:bg-soft-text/30 cursor-pointer">
                    { t("retry") }
                </button>
            </div>
        )

    return (
        <div>
            { result.status } {result.profile?.username }
        </div>
    )
}