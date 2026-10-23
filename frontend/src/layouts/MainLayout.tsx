import { NavLink, Outlet } from "react-router";

export default function MainLayout() {
    return (
        <div className="flex flex-col bg-transcendence text-texto min-h-screen">
            <header className="flex flex-row justify-between p-5">
                <h1>Transcendence</h1>
                <nav className="flex flex-row justify-between">
                    <NavLink to="#">Perfil</NavLink>
                </nav>
            </header>

            <main className="mx-auto w-full
                            max-w-5xl flex-1
                            px-4 py-6">
                <Outlet />
            </main>

            <footer className="py-10 px-5">
                <p>@ {new Date().getFullYear()} Transcendence</p>
            </footer>

        </div>
    )
}