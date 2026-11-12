import * as postRepository from '../repositories/postRepository.ts'
import { UnauthorizedError } from "../errors/HttpErrors.ts";
import { ErrorCodes } from '@transcendence/shared/errors/error-codes';

export const getPostById = async(postId:string) => {
	return postRepository.getPostById(postId);
}

export const deletePost = async(postId:string, userId:string) => {

	const post = await getPostById(postId)
	if (userId != post?.userId){
		throw new UnauthorizedError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Only the author of the post can delete it.',
		})
	}
	try {
		const postDeleted = await postRepository.deletePost(postId)
	} catch (error) {

	}

}
