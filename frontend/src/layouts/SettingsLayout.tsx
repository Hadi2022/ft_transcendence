import { useTranslation } from "react-i18next"
import { NavLink, Outlet } from "react-router"

const settingsLinks = [
    { to: "profile", label: "settings.nav.profile" }
]

export default function SettingsLayout() {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col gap-6 md:flex-row md:gap-10">

            <aside className="md:w-56 md:shrink-0">
                <h2 className="mb-4 text-xl font-semibold">{ t("settings.title") }</h2>

                <nav className="flex gap-2 overflow-x-auto md:flex-col">
                    { settingsLinks.map((link) => (
                        <NavLink key={link.to} to={link.to}
                                className={({ isActive }) =>
                                    `whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors 
                                        ${ isActive
                                            ? "bg-soft-text/20 font-medium text-white"
                                            : "text-soft-text hover:bg-soft-text/10 hover:text-white"
                                        }`
                                }>
                            { t(link.label) }
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <section className="min-w-0 flex-1">
                <Outlet />
            </section>
        </div>

    )
}