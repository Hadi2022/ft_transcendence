import { useTranslation } from "react-i18next"
import type { Post } from "../../services/posts"
import { Link } from "react-router"
import PostImage from "./PostImage"
import UserAvatar from "./UserAvatar"

type PostCardProps = {
    post: Post
    variant?: "feed" | "profile"
}

export default function PostCard({ post, variant = "feed" }: PostCardProps) {

    const { t, i18n } = useTranslation()
    const imageAlt = t("posts.view.imageAlt", { username: post.user.username })

    if (variant === "profile")
        return (
            <Link to={`/posts/${post.id}`}
                    className="block overflow-hidden rounded-md
                                focus-visible:outline-2 focus-visible:outline-offset-2
                                focus-visible:outline-blue-400
								cursor-pointer transition-all duration-200 ease-out
								motion-safe:hover:scale-[0.96] hover:brightness-90
								motion-safe:active:scale-95">
                <PostImage src={post.multimediaUrl} alt={imageAlt}
                            className="aspect-square w-full object-cover" />
            </Link>
        )

    const createdDate = new Date(post.createdAt).toLocaleDateString(i18n.language, {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <article className="flex w-full flex-col overflow-hidden rounded-xl bg-surface">
            <header className="flex items-center gap-3 p-3">
                <UserAvatar src={post.user.avatarUrl} className="size-9" />
                <Link to={`/users/${post.user.username}`}
                    className="min-w-0 truncate font-semibold hover:underline">
                    { post.user.username }
                </Link>
            </header>

            <PostImage src={post.multimediaUrl} alt={imageAlt}
                className="aspect-square w-full object-cover" />

            <div className="flex flex-col gap-2 p-3">
                { post.caption && (
                    <p className="whitespace-pre-line break-words">{ post.caption }</p>
                )}
                <time dateTime={post.createdAt} className="text-xs text-soft-text">
                    { createdDate }
                </time>
            </div>
        </article>
    )
}