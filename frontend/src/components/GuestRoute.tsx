import { useEffect, useState } from "react"
import { getCurrentUser } from "../services/auth"
import { Navigate, Outlet } from "react-router"

export default function GuestRoute() {
    
    const [status, setStatus] = useState<"loading"|"guest"|"auth">("loading")

    useEffect(() => {
        getCurrentUser()
            .then(() => setStatus("auth"))
            .catch(() => setStatus("guest"))
    }, [])

    return (status === "loading" ? (
            <div className="animate-pulse flex flex-col gap-4">
                <div className="h-8 w-2/3 rounded bg-soft-text/20" />   {/* título */}
                <div className="h-4 w-1/2 rounded bg-soft-text/20" />   {/* subtítulo */}
                <div className="h-10 rounded bg-soft-text/20" />        {/* input */}
                <div className="h-10 rounded bg-soft-text/20" />        {/* input */}
                <div className="h-10 rounded bg-soft-text/30" />        {/* botón */}
            </div>

            ) : status === "auth" ? (
                <Navigate replace to="/" />
            ) : (
                <Outlet />
            ))
}