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

export type UpdateProfileData = {
    name: string | null
    biography: string | null
}

export async function updateCurrentUser(data: UpdateProfileData): Promise<UserProfile> {
    const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
    })

    if (!res.ok) await throwApiError(res)

    const body = await res.json()

    return (body.data)
}

// MOCK: no avatar endpoint yet
// Replace these two functions with real requests when the backend is ready
function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function uploadAvatar(file: File): Promise<string> {
    await wait(800)
    return (URL.createObjectURL(file))
}

export async function removeAvatar(): Promise<void> {
    await wait(500)
}