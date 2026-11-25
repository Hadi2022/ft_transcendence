import { useTranslation } from "react-i18next"
import { usePaginatedPosts } from "../../hooks/usePaginatedPosts"
import PostCard from "../../components/posts/PostCard"
import PostsPagination from "../../components/posts/PostsPagination"

const PAGE_SIZE = 12

export default function FeedPage() {

	const { t } = useTranslation()

	const {
		result,
		page,
		totalPages,
		isLoading,
		handleRetry,
		handlePageChange
	} = usePaginatedPosts({
		pageSize: PAGE_SIZE
	})

	if (isLoading || result.status === "loading")
		return (
			<section className="mx-auto w-full max-w-lg
								flex flex-col gap-6 animate-pulse">
				{Array.from({ length: PAGE_SIZE }, (_, index) => (
					<div
						key={index}
						className="overflow-hidden rounded-xl bg-surface"
					>
						<div className="flex items-center gap-3 p-3">
							<div className="size-9 rounded-full bg-soft-text/20" />
							<div className="h-4 w-28 rounded bg-soft-text/20" />
						</div>

						<div className="aspect-square bg-soft-text/20" />

						<div className="flex flex-col gap-2 p-3">
							<div className="h-4 w-3/4 rounded bg-soft-text/20" />
							<div className="h-3 w-24 rounded bg-soft-text/20" />
						</div>
					</div>
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
					type="button"
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
		<section className="mx-auto w-full max-w-lg">
			<div className="flex flex-col gap-6">
				{result.posts.map((post) => (
					<PostCard
						key={post.id}
						post={post}
						variant="feed"
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
