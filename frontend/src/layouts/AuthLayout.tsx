import { Outlet } from "react-router";

export default function AuthLayout() {
    
    return (
        <div className="py-5 min-h-screen grid place-items-center bg-transcendence">
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    )
}