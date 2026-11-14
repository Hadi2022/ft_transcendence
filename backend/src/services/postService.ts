import * as postRepository from '../repositories/postRepository.ts'
import { UnauthorizedError } from "../errors/HttpErrors.ts";
import { ErrorCodes } from '@transcendence/shared/errors/error-codes';
import { RecordNotFoundError } from '../errors/RepositoryErrors.ts';
import { deleteImage } from '../utils/imageStorage.ts';

export const getPostById = async(postId:string) => {
	return postRepository.getPostById(postId);
}

export const deletePost = async(postId:string, userId:string) => {

	const post = await getPostById(postId)
	if (!post)
	{
		throw new RecordNotFoundError('Post not found');
	}
	if (userId != post.userId){
		throw new UnauthorizedError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Only the author of the post can delete it.',
		})
	}
	const deletedPost = await postRepository.deletePost(postId)
	if (deletedPost.multimediaUrl)
		await deleteImage(deletedPost.multimediaUrl,'posts')
	return deletedPost
}
