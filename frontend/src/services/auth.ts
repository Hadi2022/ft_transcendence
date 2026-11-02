import { throwApiError } from "./api";

export type User = {
    id: string;
    username: string;
    email: string;
}

export type LoginData = {
    email: string;
    password: string;
}

export async function login({email, password}: LoginData): Promise<void>  {
    const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) await throwApiError(res)
}

export type RegisterData = {
    username: string;
    email: string;
    password: string;
}

export async function register({username, email, password}: RegisterData): Promise<User> {
    const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    })

    if (!res.ok) await throwApiError(res)

    const body = await res.json()

    return (body.data)
}

export async function logout(): Promise<void> {
    const res = await fetch("/api/sessions/current", {
        method: "DELETE",
        credentials: "include"
    })

    if (!res.ok) await throwApiError(res)
}