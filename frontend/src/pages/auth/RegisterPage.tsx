import { Link, useNavigate } from "react-router";
import ButtonComponent from "./components/ButtonComponent";
import InputComponent from "./components/InputComponent";
import { register } from "../../services/auth";
import { useState, type SubmitEvent } from "react";

export default function RegisterPage() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        
        if (password !== confirmPassword) return 

        try {
            await register({ username, email, password })
            navigate("/")
        } catch {
            // TODO
        }
        
    }
    
    return (
        <div className="text-text">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                <p className="text-sm text-zinc-500">It will only take a minute</p>
            </div>

            <form onSubmit={handleSubmit}
                className="flex flex-col gap-5 mb-2">
                
                { /* Username input*/ }
                <InputComponent label="Username" type="text"
                                placeholder="joaquin42"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                minLength={3} maxLength={30}
                                required />

                { /* Email input*/ }
                <InputComponent label="Email" type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                minLength={6} maxLength={254}
                                required />
            
                { /* Password input */ }
                <InputComponent label="Password" type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6} maxLength={128}
                                required />

                { /* Confirm password input */ }
                <InputComponent label="Confirm password" type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6} maxLength={128}
                                required />
                
                { /* Register button */ }
                <ButtonComponent text="Register" />
            </form>
            <Link to="/login" className="text-sm underline text-blue-400 hover:no-underline">
                ¿Tienes cuenta?
            </Link>
        </div>
    )
}