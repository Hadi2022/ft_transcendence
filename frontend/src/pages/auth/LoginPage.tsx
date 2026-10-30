import { Link, useNavigate } from "react-router";
import ButtonComponent from "./components/ButtonComponent";
import InputComponent from "./components/InputComponent";
import { useState, type SubmitEvent } from "react";
import { login } from "../../services/auth";
import { useTranslation } from "react-i18next";

export default function LoginPage() {

    const navigate = useNavigate()
    const { t } = useTranslation()

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
                <h1 className="text-2xl font-bold tracking-tight">{ t("auth.loginTitle") }</h1>
                <p className="text-sm text-zinc-500">{ t("auth.loginSubtitle") }</p>
            </div>

            <form onSubmit={handleSubmit}
                className="flex flex-col gap-5 mb-2" >
                
                { /* Email input*/ }
                <InputComponent label={ t("auth.email") } type="email"
                                placeholder={ t("auth.emailPlaceholder") }
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                minLength={6} maxLength={33}
                                required />
            
                { /* Password input */ }
                <InputComponent label={ t("auth.password") } type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={3} maxLength={33}
                                required />

                { /* Login button */ }
                <ButtonComponent text={ t("auth.loginButton") } />
            </form>

            <Link to="/register" className="text-sm underline text-blue-400 hover:no-underline">
                { t("auth.dontHaveAccount") }
            </Link>
        </div>
    )
}