import { useCallback, useEffect, useState } from "react"
import { getPosts, type Post } from "../../../services/posts"
import PostCard from "../../../components/posts/PostCard"

type ProfilePostsProps = {
    userId: string
}

type PostsResult =
    | { status: "loading" }
    | { status: "ready", posts: Post[] }
    | { status: "error" }

export default function ProfilePosts({ userId }: ProfilePostsProps) {

	const [result, setResult] = useState<PostsResult>({
    	status: "loading"
	})

	const loadPosts = useCallback(async () => {
		setResult({ status: "loading" })

		try {
			const response = await getPosts({
				userId,
				limit: 12,
				offset: 0
			})

			setResult({
				status: "ready",
				posts: response.data
			})

		} catch {
			setResult({ status: "error" })
		}
	}, [userId])

	useEffect(() => {
		void loadPosts()
	}, [loadPosts])

	if (result.status === "loading")
		return (
			<section className="grid grid-cols-3 gap-2 animate-pulse">
				{Array.from({ length: 12 }, (_, index) => (
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
        </section>
    )
}