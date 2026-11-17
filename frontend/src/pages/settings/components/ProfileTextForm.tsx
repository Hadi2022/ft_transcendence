import { useTranslation } from "react-i18next"
import type { UserProfile } from "../../../services/auth"
import { useId, useState, type SubmitEvent } from "react"
import InputComponent from "../../../components/InputComponent"
import { updateCurrentUser } from "../../../services/users"

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

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!isDirty || isSaving || disabled) return

        setSaveStatus("saving")
        onPendingChange(true)
        try {
            const updated = await updateCurrentUser({
                name: name.trim() || null,
                biography: biography.trim() || null
            })

            onSaved(updated)
            setName(updated.name ?? "")
            setBiography(updated.biography ?? "")
            setSaveStatus("saved")
        } catch {
            setSaveStatus("error")
        } finally {
            onPendingChange(false)
        }
    }

    function handleCancel() {
        setName(savedName)
        setBiography(savedBio)
        setSaveStatus("idle")
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={isSaving} className="flex flex-col gap-4">
                <InputComponent label={ t("settings.profile.name") }
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={NAME_MAX_LENGTH} />

                <div className="space-y-1">
                    <label htmlFor={bioId}
                            className="block text-sm font-semibold uppercase tracking-wide">
                        { t("settings.profile.biography") }
                    </label>

                    <textarea id={bioId}
                            value={biography}
                            onChange={(e) => setBiography(e.target.value)}
                            maxLength={BIO_MAX_LENGTH}
                            rows={5}
                            aria-describedby={counterId}
                            className="w-full resize-y rounded-md bg-white px-3 py-2
                                        text-zinc-800 focus:outline-none" />

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
                    <p role="status" className="text-sm text-success">{ t("settings.profile.saved") }</p>
                )}

                { saveStatus === "error" && (
                    <p role="alert" className="text-sm text-danger">{ t("settings.profile.saveError") }</p>
                )}
            </fieldset>
        </form>
    )

}