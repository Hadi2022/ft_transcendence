import { useTranslation } from "react-i18next"
import type { UserProfile } from "../../../services/auth"
import { useId, useState } from "react"
import InputComponent from "../../../components/InputComponent"

const NAME_MAX_LENGTH = 100
const BIO_MAX_LENGTH = 1000

type ProfileTextFormProps = {
    user: UserProfile
}

export default function ProfileTextForm({user}: ProfileTextFormProps) {

    const { t } = useTranslation()

    const [name, setName] = useState(user.name ?? "")
    const [biography, setBiography] = useState(user.biography ?? "")

    const bioId = useId()
    const counterId = useId()

    return (
        <form className="flex flex-col gap-4">
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
                    className={`text-right text-xs
                        ${ biography.length >= BIO_MAX_LENGTH ? "text-danger" : "text-soft-text"}
                    `}>
                    { biography.length } / { BIO_MAX_LENGTH }
                </p>
            </div>
        </form>

    )

}