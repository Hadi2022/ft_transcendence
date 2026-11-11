import { useEffect, useRef, useState } from "react"
import { getCurrentUser } from "../services/auth"
import { Navigate, Outlet } from "react-router"
import { ApiError } from "../services/api";
import { useTranslation } from "react-i18next";

export default function GuestRoute() {

    const { t } = useTranslation()
    
    const [status, setStatus] = useState<"loading"|"guest"|"auth"|"error">("loading")
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
            ) : status === "error" ? (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-red-500">{ t("auth.errors.sessionCheck") }</p>
                    <button onClick={handleRetry} className="rounded bg-soft-text/20 py-2
                                                                hover:bg-soft-text/30">
                        { t("retry") }
                    </button>
                </div>
            ) : (
                <Outlet />
            ))
}