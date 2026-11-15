import * as postRepository from '../repositories/postRepository.ts'
import { PostNotFoundError, ForbiddenAccessPostError, InternalPostError } from '../errors/postErrors.ts';
import { deleteImage, getStorageDirectory } from '../utils/imageStorage.ts';
import path from 'node:path';
import { promises as fs } from 'fs';


export const getPostById = async (postId: string) => {
	return postRepository.getPostById(postId);
}

export const deletePost = async (postId: string, userId: string) => {

	const post = await getPostById(postId)
	if (!post) {
		throw new PostNotFoundError("Post not found.");
	}
	if (userId != post.userId) {
		throw new ForbiddenAccessPostError('Only the author of the post can delete it.')
	}
	//Preparation and isolation of the file (if multimedia is present)
	let originalFilePath = null;
	let stagedFilePath = null;
	if (post.multimediaUrl) {
		const storageDirectory = getStorageDirectory('posts')
		const filename = path.basename(post.multimediaUrl);
		originalFilePath = path.join(storageDirectory, filename);
		const stagingDirectory = path.join(storageDirectory, '..', 'staging');
		stagedFilePath = path.join(stagingDirectory, filename);
		try {
			await fs.mkdir(stagingDirectory, { recursive: true })
			await fs.rename(originalFilePath, stagedFilePath);
		} catch (error: any) {
			if (error.code != 'ENOENT') {
				throw new InternalPostError('Failed to process media file for deletion')
			}
			originalFilePath = null;
			stagedFilePath = null;
		}
	}
	// Deletion in the Database
	let deletedPost;
	try {
		deletedPost = await postRepository.deletePost(postId);
	} catch (error) {
		if (originalFilePath && stagedFilePath) {
			try {
				await fs.rename(stagedFilePath, originalFilePath);
			} catch (error) {
				throw new InternalPostError('Failed to restore media file for rollback')
			}
		}
		throw error;
	}
	//Definitive cleanup (The record has already been successfully deleted)
	if (stagedFilePath) {
		try {
			await fs.unlink(stagedFilePath);
		} catch (error) {
			if (
				error instanceof Error &&
				'code' in error &&
				error.code === 'ENOENT'
			) {
				return;
			}

			throw new InternalPostError('Failed to delete image')
		}

		return deletedPost
	}
}
