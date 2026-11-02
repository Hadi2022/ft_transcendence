import type { StatePost } from "@prisma/client"

export type NewPostData = {
	userId: string
	content: string
	multimediaUrl: string | null
	typeMultimedia: string | null
}

export type Post = {
	id:string
	userId: string
	content: string
	multimediaUrl: string | null
	typeMultimedia: string | null
	state: StatePost
	createdAt: Date
	updatedAt: Date
}
