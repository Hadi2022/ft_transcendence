import { useTranslation } from "react-i18next"

type PostsPaginationProps = {
	page: number
	totalPages: number
	onPageChange: (newPage: number) => void
}

export default function PostsPagination({
	page,
	totalPages,
	onPageChange
}: PostsPaginationProps) {

	const { t } = useTranslation()

	if (totalPages <= 1)
		return null

	return (
		<div className="flex items-center justify-center gap-4 mt-6">

			<button
				type="button"
				onClick={() => onPageChange(page - 1)}
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
				onClick={() => onPageChange(page + 1)}
				disabled={page >= totalPages - 1}
				className="rounded-md bg-soft-text/20 px-4 py-2
							text-sm font-medium hover:bg-soft-text/30
							disabled:opacity-50 disabled:cursor-not-allowed
							cursor-pointer transition-colors"
			>
				{t("posts.list.next")}
			</button>

		</div>
	)
}
