import { prisma } from "../db/prisma/prisma.ts";
import type { NewPostData, Post } from "../types/post.ts";
import { Prisma } from '@prisma/client';
import { userProfileOmit } from "./userRepository.ts";
import { UserNotFoundError } from "../errors/userErrors.ts";
import { RecordNotFoundError } from "../errors/RepositoryErrors.ts";


export async function createPost(
	_data: NewPostData
): Promise<Post> {

	try {
		const post = await prisma.post.create({
			data: {
				userId : _data.userId,
				multimediaUrl: _data.multimediaUrl,
				caption: _data.caption ?? null,
			},
			include: {
				user: {
					omit:userProfileOmit
				}
			}
		});
		return post;
	}
	catch (error: unknown) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2003')
				throw new UserNotFoundError('User not found');
			else if (error.code === 'P2003')
				throw new RecordNotFoundError(error.message);
		}
		throw error;
	}
}
