import { Outlet } from "react-router";
import LanguageSelector from "../components/LanguageSelector";

export default function AuthLayout() {
    
    return (
        <div className="relative py-5 min-h-screen grid place-items-center bg-transcendence">
            <div className="absolute top-5 right-5">
                <LanguageSelector />
            </div>
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    )
}