import { useTranslation } from "react-i18next"
import type { UserProfile } from "../../../services/auth"
import { useId, useState, type SubmitEvent } from "react"
import InputComponent from "../../../components/InputComponent"
import { updateCurrentUser, type UpdateProfileData } from "../../../services/users"
import { updateUserSchema } from "@transcendence/shared/schemas/user"
import { ApiError } from "../../../services/api"
import { Link } from "react-router"

const NAME_MAX_LENGTH = 100
const BIO_MAX_LENGTH = 1000

type ProfileTextFormProps = {
    user: UserProfile
    onSaved: (user: UserProfile) => void
    disabled: boolean
    onPendingChange: (pending: boolean) => void
}

type SaveStatus = "idle" | "saving" | "saved" | "error"

export default function ProfileTextForm({user, onSaved, disabled, onPendingChange}: ProfileTextFormProps) {

    const { t } = useTranslation()

    const [name, setName] = useState(user.name ?? "")
    const [biography, setBiography] = useState(user.biography ?? "")

    const savedName = user.name ?? ""
    const savedBio = user.biography ?? ""

    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")

    const bioId = useId()
    const counterId = useId()

    const isDirty = name !== savedName || biography !== savedBio
    const isSaving = saveStatus === "saving"

	const [fieldErrors, setFieldErrors] = useState<{
		name?: string
		biography?: string
	}>({})

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!isDirty || isSaving || disabled) return

        const trimmedName = name.trim()
        const trimmedBio = biography.trim()

        const changes: UpdateProfileData = {}
        if (trimmedName !== savedName) changes.name = trimmedName || null
        if (trimmedBio !== savedBio) changes.biography = trimmedBio || null

        if (Object.keys(changes).length === 0) {
            setName(savedName)
            setBiography(savedBio)
			setFieldErrors({})	/* Ensure a clean form if the user enters only spaces. */
			setSaveStatus("idle")
            return
        }

		setFieldErrors({})

		const validation = updateUserSchema.safeParse(changes)

		if (!validation.success) {
			const errors: {
				name?: string
				biography?: string
			} = {}

			for (const issue of validation.error.issues) {
				const message = t(`auth.fieldErrors.${issue.message}`, {
					defaultValue: t("auth.fieldErrors.INVALID_VALUE")
				})
				if (issue.path[0] === "name")
					errors.name = message

				if (issue.path[0] === "biography")
					errors.biography = message
			}

			setFieldErrors(errors)
			setSaveStatus("error")
			return
		}

        setSaveStatus("saving")
        onPendingChange(true)
        try {
            const updated = await updateCurrentUser(validation.data)

            onSaved(updated)
            setName(updated.name ?? "")
            setBiography(updated.biography ?? "")
            setSaveStatus("saved")
		} catch (err) {
			if (err instanceof ApiError && err.status === 400) {
				const errors: {
					name?: string
					biography?: string
				} = {}

				if (err.details.name) {
					errors.name = t(`auth.fieldErrors.${err.details.name}`, {
						defaultValue: t("auth.fieldErrors.INVALID_VALUE")
					})
				}

				if (err.details.biography) {
					errors.biography = t(`auth.fieldErrors.${err.details.biography}`, {
						defaultValue: t("auth.fieldErrors.INVALID_VALUE")
					})
				}

				if (errors.name || errors.biography) {
					setFieldErrors(errors)
					setSaveStatus("error")
					return
				}
			}

			setSaveStatus("error")
		} finally {
			onPendingChange(false)
		}
    }

    function handleCancel() {
        setName(savedName)
        setBiography(savedBio)
		setFieldErrors({})
        setSaveStatus("idle")
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={isSaving} className="flex flex-col gap-4">
                <InputComponent label={ t("settings.profile.name") }
                                value={name}
                                onChange={(e) => {
									setName(e.target.value)
									setFieldErrors(prev => ({ ...prev, name: undefined })) 
    								setSaveStatus("idle")
								}}
                                maxLength={NAME_MAX_LENGTH}
								error={fieldErrors.name} />

                <div className="space-y-1">
                    <label htmlFor={bioId}
                            className="block text-sm font-semibold uppercase tracking-wide">
                        { t("settings.profile.biography") }
                    </label>

                    <textarea id={bioId}
                            value={biography}
                            onChange={(e) => {
								setBiography(e.target.value)
								setFieldErrors(prev => ({ ...prev, biography: undefined }))
								setSaveStatus("idle")
							}}
                            maxLength={BIO_MAX_LENGTH}
                            rows={5}
                            aria-describedby={counterId}
                            className="w-full resize-y rounded-md bg-white px-3 py-2
                                        text-zinc-800 focus:outline-none" />
		
					{/* Biography validation error */}
					{ fieldErrors.biography && (
						<p role="alert" className="text-sm text-danger">
							{ fieldErrors.biography }
						</p>
					)}

                    <p id={counterId}
                        className={`text-right text-xs ${
                            biography.length >= BIO_MAX_LENGTH ? "text-danger" : "text-soft-text"
                        }`}>
                        { biography.length } / { BIO_MAX_LENGTH }
                    </p>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button type="button" onClick={handleCancel} disabled={!isDirty}
                            className="rounded-md bg-soft-text/20 px-4 py-2 text-sm font-medium
                                        hover:bg-soft-text/30 transition-colors cursor-pointer
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        disabled:hover:bg-soft-text/20">
                        { t("settings.profile.cancel") }
                    </button>

                    <button type="submit" disabled={!isDirty || disabled}
                            className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-medium text-white
                                        hover:bg-cyan-300 transition-colors cursor-pointer
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        disabled:hover:bg-cyan-400">
                        { isSaving ? t("settings.profile.saving") : t("settings.profile.save") }
                    </button>
                </div>

                { saveStatus === "saved" && !isDirty && (
					<div className="flex flex-wrap items-center gap-4">
	                    <p role="status" className="text-sm text-success">{ t("settings.profile.saved") }</p>
						<Link
							to={`/users/${encodeURIComponent(user.username)}`}
							className="text-sm text-cyan-400 underline hover:text-cyan-300"
						>
							{ t("settings.profile.viewProfile") }
						</Link>
					</div>				
                )}
				
                { saveStatus === "error" && !fieldErrors.name && !fieldErrors.biography && (  /* Avoid duplicating specific and generic errors */
                    <p role="alert" className="text-sm text-danger">{ t("settings.profile.saveError") }</p>
                )}
            </fieldset>
        </form>
    )

}