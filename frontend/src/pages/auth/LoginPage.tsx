import { Link, useNavigate } from "react-router";
import ButtonComponent from "./components/ButtonComponent";
import InputComponent from "./components/InputComponent";
import { useState, type SubmitEvent } from "react";
import { login } from "../../services/auth";

export default function LoginPage() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            await login({ email, password })
            navigate("/")
        } catch {
            // TODO
        }
    }
    
    return (
        <div className="text-text">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">Log In</h1>
                <p className="text-sm text-zinc-500">Discover a new world</p>
            </div>

            <form onSubmit={handleSubmit}
                className="flex flex-col gap-5 mb-2" >
                
                { /* Email input*/ }
                <InputComponent label="Email" type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                minLength={6} maxLength={33}
                                required />
            
                { /* Password input */ }
                <InputComponent label="Password" type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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