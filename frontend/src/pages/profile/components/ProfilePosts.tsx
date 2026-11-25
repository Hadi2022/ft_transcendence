import { useEffect, useState } from "react"
import { getPosts, type Post } from "../../../services/posts"
import { useTranslation } from "react-i18next"
import PostCard from "../../../components/posts/PostCard"
import { useSearchParams } from "react-router"

const PAGE_SIZE = 12

type ProfilePostsProps = {
    userId: string
}

type PostsResult =
    | { status: "loading" }
    | { status: "ready", posts: Post[], total: number, page: number }
    | { status: "error", page: number }

export default function ProfilePosts({ userId }: ProfilePostsProps) {

	const { t } = useTranslation()

	const [result, setResult] = useState<PostsResult>({
		status: "loading"
	})
	const [searchParams, setSearchParams] = useSearchParams()

	const requestedPage = Number(searchParams.get("page") ?? "1")

	const page = Number.isSafeInteger(requestedPage)
		&& requestedPage > 0
		&& requestedPage <= Math.floor(Number.MAX_SAFE_INTEGER / PAGE_SIZE)
		? requestedPage - 1
		: 0

	const [retryCount, setRetryCount] = useState(0)

	useEffect(() => {

		const controller = new AbortController()

		async function loadPosts() {
			try {
				const response = await getPosts({
					userId,
					limit: PAGE_SIZE,
					offset: page * PAGE_SIZE
				}, controller.signal)

				if (controller.signal.aborted)
					return

				const totalPages = Math.ceil(response.pagination.total / PAGE_SIZE)
				const lastValidPage = Math.max(0, totalPages - 1)

				if (page > lastValidPage) {
					setResult({ status: "loading" })

					setSearchParams(prev => {
						const params = new URLSearchParams(prev)
						params.set("page", String(lastValidPage + 1))
						return params
					}, { replace: true })

					return
				}

				setResult({
					status: "ready",
					posts: response.data,
					total: response.pagination.total,
					page: page
				})

			} catch {
				if (controller.signal.aborted)
					return

				setResult({ status: "error", page: page })
			}
		}

		void loadPosts()

		return () => {
			controller.abort()
		}

	}, [userId, page, retryCount, setSearchParams])

	function handleRetry() {
		setResult({ status: "loading" })
		setRetryCount(count => count + 1)
	}

	function handlePageChange(newPage: number) {
		setResult({ status: "loading" })
		setSearchParams(prev => {
			const params = new URLSearchParams(prev)
			params.set("page", String(newPage + 1))
			return params
		})
	}

	if (result.status === "loading" || result.page !== page)
		return (
			<section className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-pulse">
				{Array.from({ length: PAGE_SIZE }, (_, index) => (
					<div
						key={index}
						className="aspect-square rounded-lg bg-soft-text/20"
					/>
				))}
			</section>
		)

	if (result.status === "error")
		return (
			<section className="flex flex-col items-center gap-4 py-10">
				<p className="text-sm text-danger">
					{t("posts.list.loadError")}
				</p>

				<button
					onClick={handleRetry}
					className="rounded-md bg-soft-text/20 px-4 py-2
							text-sm font-medium hover:bg-soft-text/30
							transition-colors cursor-pointer"
				>
					{t("retry")}
				</button>
			</section>
		)

	if (result.posts.length === 0)
		return (
			<section className="py-10 text-center text-soft-text">
				{t("posts.list.empty")}
			</section>
		)

	const totalPages = Math.ceil(result.total / PAGE_SIZE)

    return (
        <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
				{result.posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        variant="profile"
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">

                    <button
                        type="button"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        className="rounded-md bg-soft-text/20 px-4 py-2
                                   text-sm font-medium hover:bg-soft-text/30
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   cursor-pointer transition-colors"
                    >
                        {t("posts.list.previous")}
                    </button>

                    <span className="text-sm text-soft-text">
                        {page + 1} / {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="rounded-md bg-soft-text/20 px-4 py-2
                                   text-sm font-medium hover:bg-soft-text/30
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   cursor-pointer transition-colors"
                    >
                        {t("posts.list.next")}
                    </button>

                </div>
            )}
        </section>
    )
}