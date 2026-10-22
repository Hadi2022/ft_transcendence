import { Link } from "react-router";
import ButtonComponent from "./components/ButtonComponent";
import InputComponent from "./components/InputComponent";

export default function LoginPage() {
    
    return (
        <div className="text-texto">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">Log In</h1>
                <p className="text-sm text-zinc-500">Discover a new world</p>
            </div>

        <form className="flex flex-col gap-5 mb-2">
                
                { /* Email input*/ }
                <InputComponent label="Email" type="email"
                                placeholder="your@email.com"
                                minLength={6} maxLength={33}
                                required />
            
                { /* Password input */ }
                <InputComponent label="Password" type="password"
                                placeholder="••••••••"
                                minLength={3} maxLength={33}
                                required />

                { /* Login button */ }
                <ButtonComponent text="Login" />
            </form>

            <Link to="/register" className="text-sm underline text-blue-400 hover:no-underline">
                ¿No tienes cuenta?
            </Link>
        </div>
    )
}