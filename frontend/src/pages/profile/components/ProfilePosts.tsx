import { useCallback, useEffect, useState } from "react"
import { getPosts, type Post } from "../../../services/posts"
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

	const [result, setResult] = useState<PostsResult>({
    	status: "loading"
	})
	const [page, setPage] = useState(0)

	const loadPosts = useCallback(async () => {
		setResult({ status: "loading" })

		try {
			const response = await getPosts({
				userId,
				limit: PAGE_SIZE,
				offset: page * PAGE_SIZE
			})

			setResult({
				status: "ready",
				posts: response.data,
				total: response.pagination.total
			})

		} catch {
			setResult({ status: "error" })
		}
	}, [userId, page])

	useEffect(() => {
		void loadPosts()
	}, [loadPosts])

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
					Could not load posts.
				</p>

				<button
					onClick={() => void loadPosts()}
					className="rounded-md bg-soft-text/20 px-4 py-2
							text-sm font-medium hover:bg-soft-text/30
							transition-colors cursor-pointer"
				>
					Retry
				</button>
			</section>
		)

	if (result.posts.length === 0)
		return (
			<section className="py-10 text-center text-soft-text">
				No posts yet.
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
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                        className="rounded-md bg-soft-text/20 px-4 py-2
                                   text-sm font-medium hover:bg-soft-text/30
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   cursor-pointer transition-colors"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-soft-text">
                        {page + 1} / {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="rounded-md bg-soft-text/20 px-4 py-2
                                   text-sm font-medium hover:bg-soft-text/30
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   cursor-pointer transition-colors"
                    >
                        Next
                    </button>

                </div>
            )}				
        </section>
    )
}