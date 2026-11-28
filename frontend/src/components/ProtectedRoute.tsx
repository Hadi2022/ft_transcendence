import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentUser } from "../services/auth";
import { ApiError } from "../services/api";
import { Navigate, Outlet, useOutletContext } from "react-router";

export default function ProtectedRoute() {

    const outletContext = useOutletContext()
    const { t } = useTranslation()

    const [status, setStatus] = useState<"loading"|"auth"|"guest"|"error">("loading")
    const lastRequest = useRef(0)

    function checkSession() {
        lastRequest.current += 1
        const requestId = lastRequest.current

        getCurrentUser()
            .then(() => {
                if (requestId !== lastRequest.current) return
                setStatus("auth")
            })
            .catch((err: unknown) => {
                if (requestId !== lastRequest.current) return
                if (err instanceof ApiError && err.status === 401)
                    setStatus("guest")
                else
                    setStatus("error")
            })
    }

    useEffect(() => {
        checkSession()

        return () => {
            lastRequest.current += 1
        }
    }, [])

    function handleRetry() {
        setStatus("loading")
        checkSession()
    }

    if (status === "loading")
        return (
            <div className="animate-pulse flex flex-col gap-4">
                <div className="h-8 w-1/3 rounded bg-soft-text/20" />
                <div className="h-40 rounded bg-soft-text/20" />
            </div>
        )

    if (status === "guest")
        return <Navigate replace to="/login" />

    if (status === "error")
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-sm text-red-500">{ t("auth.errors.sessionCheck") }</p>
                <button onClick={handleRetry}
                        className="rounded bg-soft-text/20 px-4 py-2 hover:bg-soft-text/30  cursor-pointer">
                    { t("retry") }
                </button>
            </div>

        )

    return <Outlet context={outletContext}/>
}