import { prisma } from "../db/prisma/prisma.ts";
import type { NewPostData, Post, PostDelete } from "../types/post.ts";
import { Prisma } from '@prisma/client';
import { userProfileOmit } from "./userRepository.ts";
import { UserNotFoundError } from "../errors/userErrors.ts";
import { GenericConstraintError, RecordNotFoundError } from "../errors/RepositoryErrors.ts";


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
			else if (error.code === 'P2025')
				throw new RecordNotFoundError(error.message);
		}
		throw error;
	}
}

export async function deletePost(
	_idPost: string):Promise<PostDelete> {

	try {
		const deletedPost = await prisma.post.delete({
			where:{id: _idPost},
			select: {
				id: true,
				userId: true,
				multimediaUrl: true,
			}
			})
			return deletedPost;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025'){
					throw new RecordNotFoundError('Post not found');
				}//foreing key constrain
				if (error.code === 'P2003') {
					throw new GenericConstraintError(error.message);
				}
			}
		throw error;
	}
}
