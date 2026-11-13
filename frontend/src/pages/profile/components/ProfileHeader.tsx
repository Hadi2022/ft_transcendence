import { useTranslation } from "react-i18next"
import type { UserProfile } from "../../../services/auth"

const DEFAULT_AVATAR = "/img/default-avatar.svg"

export type ProfileRelation = "own" | "other" | "guest"

type ProfileHeaderProps = {
    profile: UserProfile
    relation: ProfileRelation
}

export default function ProfileHeader({profile, relation} : ProfileHeaderProps) {

    const { t, i18n } = useTranslation()

    const joinedDate = new Date(profile.createdAt).toLocaleDateString(i18n.language, {
        month: "long",
        year: "numeric"
    })

    return (
        <section className="flex flex-col items-center gap-6 text-center
                            sm:flex-row sm:items-start sm:gap-10 sm:text-left">
            <img src={profile.avatarUrl ?? DEFAULT_AVATAR} 
                    alt={t("profile.avatarAlt", {username: profile.username})} 
                    onError={(e) => {
                        if (!e.currentTarget.src.endsWith(DEFAULT_AVATAR))
                            e.currentTarget.src = DEFAULT_AVATAR
                    }}
                    className="size-24 sm:size-36 shrink-0 rounded-full
                                object-cover bg-surface"
                    />
            <div className="flex w-full min-w-0 flex-col items-center
                            gap-3 sm:items-start">
                <h2 className="text-2xl font-semibold break-all">{profile.username}</h2>
                { profile.name && (
                    <p className="font-medium">
                        { profile.name }
                    </p>
                )}
                { profile.biography && (
                    <p className="max-w-prose whitespace-pre-line
                                    break-words text-soft-text">
                        { profile.biography }
                    </p>
                )}

                <p className="text-sm text-soft-text">{ t("profile.joined", { date: joinedDate }) }</p>
                
                {
                    relation === "own" && (
                        <button type="button"
                                className="rounded-md bg-soft-text/20 px-4 py-2
                                            text-sm font-medium hover:bg-soft-text/30
                                            transition-colors">
                            { t("profile.editProfile") }
                        </button>
                    )
                }

                {
                    relation === "other" && (
                        <button type="button"
                                className=" rounded-md bg-cyan-400 px-6 py-2 text-sm 
                                            font-medium text-white hover:bg-cyan-300
                                            transition-colors cursor-pointer">
                            { t("profile.follow") }
                        </button>
                    )
                }
            </div>
            
        </section>
    )

}