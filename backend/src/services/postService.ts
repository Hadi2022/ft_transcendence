import * as postRepository from '../repositories/postRepository.ts'
import { PostNotFoundError, ForbiddenAccessPostError } from '../errors/postErrors.ts';
import { deleteImage } from '../utils/imageStorage.ts';

export const getPostById = async(postId:string) => {
	return postRepository.getPostById(postId);
}

export const deletePost = async(postId:string, userId:string) => {

	const post = await getPostById(postId)
	if (!post)
	{
		throw new PostNotFoundError("Post not found.");
	}
	if (userId != post.userId){
		throw new ForbiddenAccessPostError('Only the author of the post can delete it.')
	}
	const deletedPost = await postRepository.deletePost(postId)
	if (deletedPost.multimediaUrl)
		await deleteImage(deletedPost.multimediaUrl,'posts')
	return deletedPost
}
