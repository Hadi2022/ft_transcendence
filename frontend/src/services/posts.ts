import { throwApiError } from "./api"
import type { UserProfile } from "./auth"

export type Post = {
    id: string
    userId: string
    multimediaUrl: string
    caption: string | null
    createdAt: string
    updatedAt: string
    user: UserProfile
}

export type ListPostsResponse = {
    data: Post[]
    pagination: {
        total: number
    }
}

export type ListPostsParams = {
    limit: number
    offset: number
    userId?: string
}

export async function createPost(image: File, caption: string, signal?: AbortSignal): Promise<Post> {
    const formData = new FormData()
    formData.append("image", image)

    const trimmedCaption = caption.trim()
    if (trimmedCaption)
        formData.append("caption", trimmedCaption)

    const res = await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        body: formData,
        signal
    })

    if (!res.ok) await throwApiError(res)

    const body = await res.json()
    
    return (body.data)
}

export async function getPostById(id: string): Promise<Post> {
    const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, {
        credentials: "include"
    })

    if (!res.ok) await throwApiError(res)

    const body = await res.json()

    return (body.data)
}

export async function getPosts(
    { limit, offset, userId }: ListPostsParams,
	signal?: AbortSignal
): Promise<ListPostsResponse> {

    const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset)
    })

	/*  If a user identifier is provided, we add it to the query. 
		Otherwise, we retrieve posts from all authors. */
    if (userId !== undefined)
        params.set("userId", userId)

    const res = await fetch(`/api/posts?${params.toString()}`, {
        credentials: "include",
		signal
    })

    if (!res.ok) await throwApiError(res)

    const body = await res.json()

    return body
}
