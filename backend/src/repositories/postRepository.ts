import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma/prisma.ts";
import type { NewPostData, Post } from "../types/post.ts";
import { ForeignKeyConstraintError } from "../errors/RepositoryErrors.ts";


export async function createPost(
	_data: NewPostData
): Promise<Post> {

	try {
		const post = await prisma.post.create({
			data: {
				userId: _data.userId,
				content: _data.content,
				multimediaUrl: _data.multimediaUrl,
				typeMultimedia: _data.typeMultimedia,
				state: 'published'
			},
		});
		return post;
	}
	catch (error: unknown) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2003') {
			const target = (error.message as string);
			if (target.includes('user')) {
				throw new ForeignKeyConstraintError('Unique constraint violation: record already exists', 'user');
			}
		}
		throw error;
	}
}
