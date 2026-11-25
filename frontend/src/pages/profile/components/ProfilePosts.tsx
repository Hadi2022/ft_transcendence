import { useTranslation } from "react-i18next"
import PostCard from "../../../components/posts/PostCard"
import { usePaginatedPosts } from "../../../hooks/usePaginatedPosts"
import PostsPagination from "../../../components/posts/PostsPagination"

const PAGE_SIZE = 12

type ProfilePostsProps = {
    userId: string
}

export default function ProfilePosts({ userId }: ProfilePostsProps) {

	const { t } = useTranslation()

	const {
		result,
		page,
		totalPages,
		isLoading,
		handleRetry,
		handlePageChange
	} = usePaginatedPosts({
		pageSize: PAGE_SIZE,
		userId
	})

	if (isLoading || result.status === "loading")
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

			<PostsPagination
				page={page}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
        </section>
    )
}