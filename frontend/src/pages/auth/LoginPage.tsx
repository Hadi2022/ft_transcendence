import { Link, useNavigate } from "react-router";
import ButtonComponent from "./components/ButtonComponent";
import InputComponent from "./components/InputComponent";
import { useState, type SubmitEvent } from "react";
import { login } from "../../services/auth";
import { useTranslation } from "react-i18next";
import { ApiError } from "../../services/api";
import { openSessionSchema } from "@transcendence/shared/schemas/session";

function getLoginErrorKey(err: unknown) : string {
    if (err instanceof TypeError)
        return "auth.errors.network"
    if (!(err instanceof ApiError))
        return "auth.errors.unexpected"
    if (err.status === 400)
        return "auth.errors.invalidFields"
    if (err.status === 401)
        return "auth.errors.invalidCredentials"
    if (err.status === 409)
        return "auth.errors.sessionExists"
    return "auth.errors.unexpected"
}

export default function LoginPage() {

    const navigate = useNavigate()
    const { t } = useTranslation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const result = openSessionSchema.safeParse({ email, password })
		if (!result.success) {
            setError("auth.errors.invalidFields")
			return
		}

        setIsLoading(true)
        try {
            await login(result.data)
            navigate("/")
        } catch (err) {
            setError(getLoginErrorKey(err))
        } finally {
            setIsLoading(false)
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
                                minLength={4} maxLength={254}
                                required />
            
                { /* Password input */ }
                <InputComponent label={ t("auth.password") } type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={3} maxLength={128}
                                required />

                { /* Errors */ }
                { error && (
                    <p role="alert" className="text-sm text-danger">
                        { t(error) }
                    </p>
                )}

                { /* Login button */ }
                <ButtonComponent text={ t("auth.loginButton") } isLoading={isLoading} />
            </form>

            <Link to="/register" className="text-sm underline text-blue-400 hover:no-underline">
                { t("auth.dontHaveAccount") }
            </Link>
        </div>
    )
}