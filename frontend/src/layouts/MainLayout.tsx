import { NavLink, Outlet } from "react-router";

export default function MainLayout() {
    return (
        <div>
            <header className="flex flex-row justify-between">
                <h1>Transcendence</h1>
                <nav className="flex flex-row justify-between">
                    <NavLink to="#">Perfil</NavLink>
                </nav>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
                <Outlet />
            </main>

            <footer>
                <p>@ {new Date().getFullYear()} Transcendence</p>
            </footer>

        </div>
    )
}