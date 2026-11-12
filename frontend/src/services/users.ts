import { throwApiError } from "./api"
import type { UserProfile } from "./auth"

export async function getUserById(id: string) : Promise<UserProfile> {
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`, {
        credentials: "include"
    })

    if (!res.ok) await throwApiError(res)

    const body = await res.json()

    return (body.data)
}