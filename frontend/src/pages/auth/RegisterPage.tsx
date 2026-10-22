import { Link } from "react-router";
import ButtonComponent from "./components/ButtonComponent";
import InputComponent from "./components/InputComponent";

export default function RegisterPage() {
    
    return (
        <div className="text-texto">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                <p className="text-sm text-zinc-500">It will only take a minute</p>
            </div>

            <form className="flex flex-col gap-5 mb-2">
                
                { /* Username input*/ }
                <InputComponent label="Username" type="text"
                                placeholder="joaquin42"
                                minLength={3} maxLength={33}
                                required />

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

                { /* Confirm password input */ }
                <InputComponent label="Confirm password" type="password"
                                placeholder="••••••••"
                                minLength={3} maxLength={33}
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