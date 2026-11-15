import * as postRepository from '../repositories/postRepository.ts'
import { PostNotFoundError, ForbiddenAccessPostError, InternalPostError, ConflictPostError, BadRequestPostsError } from '../errors/postErrors.ts';
import { deleteImage, getStorageDirectory } from '../utils/imageStorage.ts';
import path from 'node:path';
import { promises as fs } from 'fs';
import { UPLOAD_PUBLIC_PATH } from '../constants/imageUpload.ts';
import { RecordNotFoundError } from '../errors/RepositoryErrors.ts';

const IMAGE_FILENAME_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/



const activeDeletions = new Set<string>();

export const getPostById = async (postId: string) => {
	return postRepository.getPostById(postId);
}

export const deletePost = async (postId: string, userId: string) => {

	if (activeDeletions.has(postId)) {
		throw new ConflictPostError('A deletion for this post is already in progress.')
	}
	activeDeletions.add(postId);
	try {
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
			const directory = 'posts';
			const storageDirectory = getStorageDirectory(directory);
			const expectedPrefix = `${UPLOAD_PUBLIC_PATH}/${directory}/`;

			if (!post.multimediaUrl.startsWith(expectedPrefix)) {
				throw new BadRequestPostsError('Invalid image path');
			}

			const filename = post.multimediaUrl.slice(expectedPrefix.length);

            if (!IMAGE_FILENAME_PATTERN.test(filename)) {
                throw new BadRequestPostsError('Invalid image filename');
            }

			originalFilePath = path.join(storageDirectory, filename);
			const stagingDirectory = path.join(storageDirectory, '..', 'staging');
			stagedFilePath = path.join(stagingDirectory, filename);
			try {
				await fs.mkdir(stagingDirectory, { recursive: true })
				await fs.rename(originalFilePath, stagedFilePath);
			} catch (error: any) {
				if (error.code != 'ENOENT') {
					throw new InternalPostError({ message: 'Failed to process media file for deletion' })
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
					throw new InternalPostError({ message: 'Failed to restore media file for rollback' })
				}
			}
			if ((error instanceof RecordNotFoundError) || (error && typeof error === 'object' && 'code' in error && error.code === 'P2025')){
				throw new PostNotFoundError('Post not found');
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

				throw new InternalPostError({ message: 'Failed to delete image',
					details: `The following file must be deleted manually: ${stagedFilePath}`})
			}

			return deletedPost
		}
	} finally {
		activeDeletions.delete(postId);
	}

}
