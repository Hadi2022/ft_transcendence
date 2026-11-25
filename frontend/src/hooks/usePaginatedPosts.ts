import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { getPosts, type Post } from "../services/posts"

type PaginatedPostsOptions = {
    pageSize: number //Profile & Global Feed
    userId?: string //Only Profile
}

type PostsResult =
    | { status: "loading" }
    | { status: "ready", posts: Post[], total: number, page: number }
    | { status: "error", page: number }

export function usePaginatedPosts({
    pageSize,
    userId
}: PaginatedPostsOptions) {

    const [result, setResult] = useState<PostsResult>({
        status: "loading"
    })

    const [searchParams, setSearchParams] = useSearchParams()

    const requestedPage = Number(searchParams.get("page") ?? "1")

    const page = Number.isSafeInteger(requestedPage)
        && requestedPage > 0
        && requestedPage <= Math.floor(Number.MAX_SAFE_INTEGER / pageSize)
        ? requestedPage - 1
        : 0

    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {

        const controller = new AbortController()

        async function loadPosts() {
            try {
                const response = await getPosts({
                    userId,
                    limit: pageSize,
                    offset: page * pageSize
                }, controller.signal)

                if (controller.signal.aborted)
                    return

                const totalPages = Math.ceil(
                    response.pagination.total / pageSize
                )

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

    }, [userId, page, pageSize, retryCount, setSearchParams])

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

    const isLoading = result.status === "loading"
        || result.page !== page

    const totalPages = result.status === "ready"
        ? Math.ceil(result.total / pageSize)
        : 0

    return {
        result,
        page,
        totalPages,
        isLoading,
        handleRetry,
        handlePageChange
    }
}