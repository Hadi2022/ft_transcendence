import { useEffect, useState } from "react"
import { getPosts, type Post } from "../../../services/posts"
import { useTranslation } from "react-i18next"
import PostCard from "../../../components/posts/PostCard"

const PAGE_SIZE = 12

type ProfilePostsProps = {
    userId: string
}

type PostsResult =
    | { status: "loading" }
    | { status: "ready", posts: Post[], total: number }
    | { status: "error" }

export default function ProfilePosts({ userId }: ProfilePostsProps) {

	const { t } = useTranslation()

	const [result, setResult] = useState<PostsResult>({
    	status: "loading"
	})
	const [page, setPage] = useState(0)
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

				setResult({
					status: "ready",
					posts: response.data,
					total: response.pagination.total
				})

			} catch {
				if (controller.signal.aborted)
					return

				setResult({ status: "error" })
			}
		}

		void loadPosts()

		return () => {
			controller.abort()
		}

	}, [userId, page, retryCount])

	function handleRetry() {
		setResult({ status: "loading" })
		setRetryCount(count => count + 1)
	}

	function handlePageChange(newPage: number) {
		setResult({ status: "loading" })
		setPage(newPage)
	}

	if (result.status === "loading")
		return (
			<section className="grid grid-cols-3 gap-2 animate-pulse">
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
            <div className="grid grid-cols-3 gap-2">
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