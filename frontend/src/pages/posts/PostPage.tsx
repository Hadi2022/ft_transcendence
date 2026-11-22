import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { getPostById, type Post } from "../../services/posts";
import { ApiError } from "../../services/api";

const DEFAULT_AVATAR = "/img/default-avatar.svg"

type PostResult =
    | { id: string, status: "ready", post: Post }
    | { id: string, status: "notFound" }
    | { id: string, status: "error" }

export default function PostPage() {
    const { t, i18n } = useTranslation()
    const { id } = useParams()
    const location = useLocation()

    const navigate = useNavigate()
    const [justCreated] = useState(
        () => (location.state as {created?: boolean} | null)?.created === true
    )
    const [result, setResult] = useState<PostResult|null>(null)
    const lastRequest = useRef(0)

    useEffect(() => {
        if (justCreated)
            navigate(location.pathname, {replace: true, state: null})
    }, [justCreated, location.pathname, navigate])

    function loadPost(postId: string) {
        const requestId = ++lastRequest.current
        
        getPostById(postId)
            .then((post) => {
                if (requestId !== lastRequest.current) return
                setResult({ id: postId, status: "ready", post })
            })
            .catch((err: unknown) => {
                if (requestId !== lastRequest.current) return
                if (err instanceof ApiError && (err.status === 404 || err.status === 400))
                    setResult({ id: postId, status: "notFound" })
                else
                    setResult({ id: postId, status: "error" })
            })
    }

    useEffect(() => {
        if (!id) return
        loadPost(id)

        return () => {
            lastRequest.current += 1
        }
    }, [id])

    function handleRetry() {
        if (!id) return
        setResult(null)
        loadPost(id)
    }

    if (!result || result.id !== id)
        return (
            <div className="mx-auto grid w-full max-w-4xl animate-pulse gap-6
                            md:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="aspect-square w-full rounded-lg bg-soft-text/20" />
                <div className="flex flex-col gap-4 rounded-xl bg-surface p-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-soft-text/20" />
                        <div className="h-4 w-32 rounded bg-soft-text/20" />
                    </div>
                    <div className="h-4 w-2/3 rounded bg-soft-text/20" />
                </div>
            </div>
        )

    if (result.status === "notFound")
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <h2 className="text-xl font-semibold">{ t("posts.view.notFoundTitle") }</h2>
                <p className="text-soft-text">{ t("posts.view.notFoundText") }</p>
                <Link to="/" className="text-primary hover:underline">{ t("posts.view.backHome") }</Link>
            </div>
        )
    
    if (result.status === "error")
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-sm text-danger">{ t("posts.view.loadError") }</p>
                <button onClick={handleRetry}
                        className="rounded-md bg-soft-text/20 px-4 py-2 text-sm font-medium
                                   hover:bg-soft-text/30 transition-colors cursor-pointer">
                    { t("retry") }
                </button>
            </div>
        )

    const { post } = result
    const createdDate = new Date(post.createdAt).toLocaleDateString(i18n.language, {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
            { justCreated && (
                <p role="status" className="rounded-md bg-success/10 px-4
                                            py-2 text-sm text-success">
                    { t("posts.view.created") }
                </p>
            )}

            <article className="grid gap-6 md:grid-cols-[minmax(0,1fr)_20rem]">
                { /* Image */ }
                <div className="flex items-center justify-center">
                    <img src={post.multimediaUrl}
                        alt={ t("posts.view.imageAlt", { username: post.user.username }) }
                        className="block max-h-[80vh] w-auto max-w-full rounded-lg" />
                </div>

                { /* Side panel */ }
                <aside className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-4">
                    <header className="flex items-center gap-3">
                        <img src={post.user.avatarUrl ?? DEFAULT_AVATAR} alt=""
                            onError={(e) => {
                                if (!e.currentTarget.src.endsWith(DEFAULT_AVATAR))
                                    e.currentTarget.src = DEFAULT_AVATAR
                            }}
                            className="size-10 shrink-0 rounded-full object-cover bg-transcendence" />
                        <div className="min-w-0">
                            <Link to={`/users/${post.user.username}`}
                                className="block truncate font-semibold hover:underline">
                                { post.user.username }
                            </Link>
                            <time dateTime={post.createdAt} className="text-xs text-soft-text">
                                { createdDate }
                            </time>
                        </div>
                    </header>

                    { post.caption && (
                        <p className="whitespace-pre-line break-words">{ post.caption }</p>
                    )}

                    { /* TODO: comments (future task) */ }
                    <div aria-hidden="true"
                        className="min-h-40 flex-1 rounded-lg bg-soft-text/10" />

                    { /* TODO: likes (future task) */ }
                    <div aria-hidden="true"
                        className="h-10 rounded-lg bg-soft-text/10" />
                </aside>
            </article>
        </div>
    )
}