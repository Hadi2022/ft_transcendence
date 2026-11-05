import { Link, useNavigate } from "react-router";
import ButtonComponent from "./components/ButtonComponent";
import InputComponent from "./components/InputComponent";
import { register } from "../../services/auth";
import { useState, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "../../services/api";

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/

function getRegisterErrorKey(err: unknown): string {
    if (err instanceof TypeError)
        return "auth.errors.network"
    if (!(err instanceof ApiError))
        return "auth.errors.unexpected"
    if (err.status === 400 && err.details.username)
      return "auth.errors.username"
    if (err.status === 400 && err.details.email)
        return "auth.errors.email"
    if (err.status === 400 && err.details.password)
        return "auth.errors.password"
    if (err.status === 400)
        return "auth.errors.invalidFields"

    if (err.status === 409 && err.details.email)
        return "auth.errors.emailInUse"
    if (err.status === 409 && err.details.username)
        return "auth.errors.usernameInUse"
    return "auth.errors.unexpected"
}

export default function RegisterPage() {

    const navigate = useNavigate()
    const { t } = useTranslation()

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})


    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setFieldErrors({})
        
        if (password !== confirmPassword) {
            setFieldErrors({ confirmPassword: "auth.errors.passwordMismatch" })
            return 
        }

        if (!SPECIAL_CHAR_REGEX.test(password)) {
            setFieldErrors({ password: "auth.errors.passwordSpecialChar" })
            return
        }

        setIsLoading(true)

        try {
            await register({ username, email, password })
            navigate("/login")
        } catch (err) {
            const key = getRegisterErrorKey(err)

            if (err instanceof ApiError && err.details.username)
                setFieldErrors({ username: key })
            else if (err instanceof ApiError && err.details.email)
                setFieldErrors({ email: key })
            else if (err instanceof ApiError && err.details.password)
                setFieldErrors({ password: key })
            else
                setError(key)

        } finally {
            setIsLoading(false)
        }
        
    }
    
    return (
        <div className="text-text">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">{ t("auth.registerTitle") }</h1>
                <p className="text-sm text-zinc-500">{ t("auth.registerSubtitle") }</p>
            </div>

            <form onSubmit={handleSubmit}
                className="flex flex-col gap-5 mb-2">
                
                { /* Username input*/ }
                <InputComponent label={ t("auth.username") } type="text"
                                placeholder="joaquin42"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={fieldErrors.username ? t(fieldErrors.username) : undefined}
                                pattern="[a-zA-Z0-9_]+"
                                title={ t("auth.usernameHint") }
                                minLength={3} maxLength={30}
                                required />

                { /* Email input*/ }
                <InputComponent label={ t("auth.email") } type="email"
                                placeholder={ t("auth.emailPlaceholder") }
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={fieldErrors.email ? t(fieldErrors.email) : undefined}
                                minLength={6} maxLength={254}
                                required />
            
                { /* Password input */ }
                <InputComponent label={ t("auth.password") } type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={fieldErrors.password ? t(fieldErrors.password) : undefined}
                                minLength={6} maxLength={128}
                                required />

                { /* Confirm password input */ }
                <InputComponent label={ t("auth.registerConfirmPassword") } type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={fieldErrors.confirmPassword ? t(fieldErrors.confirmPassword) : undefined}
                                minLength={6} maxLength={128}
                                required />
                
                { /* Errors? */ }
                { error && (
                    <p role="alert" className="text-sm text-danger">
                        { t(error) }
                    </p>
                )}

                { /* Register button */ }
                <ButtonComponent text={ t("auth.registerButton") } isLoading={isLoading}/>
            </form>
            <Link to="/login" className="text-sm underline text-blue-400 hover:no-underline">
                { t("auth.haveAccount") }
            </Link>
        </div>
    )
}