import { throwApiError } from "./api"
import type { UserProfile } from "./auth"

export async function getUserByUsername(username: string) : Promise<UserProfile> {
    const res = await fetch(`/api/users/by-username/${encodeURIComponent(username)}`, {
        credentials: "include"
    })

    if (!res.ok) await throwApiError(res)

    const body = await res.json()

    return (body.data)
}