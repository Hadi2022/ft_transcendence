import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { getUserById } from "../../services/users"
import { ApiError } from "../../services/api"
import type { UserProfile } from "../../services/auth"
import ProfileSkeleton from "./components/ProfileSkeleton"

type ProfileResult = {
    id: string
    status: "ready" | "notFound" | "error"
    profile: UserProfile | null
}

export default function ProfilePage() {

    const { id } = useParams()

    const [result, setResult] = useState<ProfileResult|null>(null)
    const lastRequest = useRef(0)

    function loadProfile(profileId: string) {
        lastRequest.current += 1
        const requestId = lastRequest.current

        getUserById(profileId)
            .then((user) => {
                if (requestId !== lastRequest.current) return
                setResult({id: profileId, status: "ready", profile: user})
            })
            .catch((err: unknown) => {
                if (requestId !== lastRequest.current) return
                if (err instanceof ApiError && (err.status === 404 || err.status === 400))
                    setResult({ id: profileId, status: "notFound", profile: null })
                else
                    setResult({ id: profileId, status: "error", profile: null })
            })
    }

    useEffect(() => {
        if (!id) return
        loadProfile(id)

        return () => {
            lastRequest.current += 1
        }
    }, [id])

    if (!result || result.id !== id)
        return <ProfileSkeleton />

    return (
        <div>
            { result.status } {result.profile?.username }
        </div>
    )
}