import { Translation, useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router";
import LanguageSelector from "../components/LanguageSelector";

export default function MainLayout() {
    
    const { t } = useTranslation()

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