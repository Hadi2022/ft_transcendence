import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { getUserByUsername } from "../../services/users"
import { ApiError } from "../../services/api"
import type { UserProfile } from "../../services/auth"
import ProfileSkeleton from "./components/ProfileSkeleton"

type ProfileResult = {
    username: string
    status: "ready" | "notFound" | "error"
    profile: UserProfile | null
}

export default function ProfilePage() {

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

    if (!result || result.username !== username)
        return <ProfileSkeleton />

    return (
        <div>
            { result.status } {result.profile?.username }
        </div>
    )
}