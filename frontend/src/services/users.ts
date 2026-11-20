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
    name?: string | null
    biography?: string | null
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

export async function uploadAvatar(file: File, signal?: AbortSignal): Promise<string> {
    const formData = new FormData()
    formData.append("avatar", file)

    const res = await fetch("/api/users/me/avatar", {
        method: "PUT",
        credentials: "include",
        body: formData,
        signal
    })

    if (!res.ok) await throwApiError(res)

    const body = await res.json()

    return (body.data.avatarUrl)
}

export async function removeAvatar(signal?: AbortSignal): Promise<void> {
    const res = await fetch("/api/users/me/avatar", {
        method: "DELETE",
        credentials: "include",
        signal
    })

    if (!res.ok) await throwApiError(res)
}