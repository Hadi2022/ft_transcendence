import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useNavigate } from "react-router";
import LanguageSelector from "../components/LanguageSelector";
import { getCurrentUser, logout } from "../services/auth";
import { useEffect, useRef, useState } from "react";
import { ApiError } from "../services/api";

export default function MainLayout() {
    
    const { t } = useTranslation()

    const navigate = useNavigate()

    const [isAuth, setIsAuth] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [logoutError, setLogoutError] = useState<string|null>(null)

    const lastRequest = useRef(0)

    function checkSession() {
        lastRequest.current += 1
        const requestId = lastRequest.current

        getCurrentUser()
            .then(() => {
                if (requestId !== lastRequest.current) return
                setIsAuth(true)
            })
            .catch((err: unknown) => {
                if (requestId !== lastRequest.current) return
                if (err instanceof ApiError && err.status === 401)
                    setIsAuth(false)
            })
    }

    useEffect(() => {
        checkSession()

        window.addEventListener("focus", checkSession)
        return () => window.removeEventListener("focus", checkSession)
    }, [])

    async function handleLogout() {
        if (isLoggingOut) return
        
        setIsLoggingOut(true)
        setLogoutError(null)
        try {
            await logout()
            setIsAuth(false)
            navigate("/login", {replace: true})
        } catch (err: unknown) {
            if (err instanceof ApiError && err.status === 401) {
                setIsAuth(false)
                navigate("/login", {replace: true})
            } else {
                setLogoutError("nav.logoutError")
            }
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <div className="flex flex-col bg-transcendence text-text min-h-screen">
            <header className="flex flex-row justify-between p-5
                    border-t border-soft-text/20
                    bg-surface items-center
                    sticky top-0 z-50">
                <h1>Transcendence</h1>
                <nav className="flex flex-row gap-4 items-center">
                    <NavLink to="#" className="navlink">{ t("nav.feed") }</NavLink>
                    <NavLink to="#" className="navlink">{ t("nav.messages") }</NavLink>
                    <NavLink to="#" className="navlink">{ t("nav.profile") }</NavLink>
                    { isAuth && (
                        <button className="navlink disabled:opacity-50"
                                onClick={handleLogout}
                                disabled={isLoggingOut}>
                            { t("nav.logout") }
                        </button>
                    )}
                    { logoutError && (
                        <p className="text-sm text-red-500">{ t(logoutError) }</p>
                    )}
                    
                    <LanguageSelector />
                </nav>
            </header>

            <main className="mx-auto w-full
                            max-w-5xl flex-1
                            px-4 py-6">
                <Outlet />
            </main>

            <footer className="bg-surface py-10 px-5">
                <p>@ {new Date().getFullYear()} Transcendence</p>
            </footer>

        </div>
    )
}
