import { idParamSchema } from "@transcendence/shared/schemas/common";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express/Request.js";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../errors/HttpErrors.ts";
import { ErrorCodes } from "@transcendence/shared/errors/error-codes";
import { formatZodErrors } from "../utils/zod.ts";
import * as postService from '../services/postService.ts'
import { ConflictPostError, ForbiddenAccessPostError, PostNotFoundError } from "../errors/postErrors.ts";
import { updatePostSchema, uploadPostSchema } from "@transcendence/shared/schemas/post";


const deletePost = async (
	req: AuthenticatedRequest,
	res: Response) => {

	const parsedIdPost = idParamSchema.safeParse(req.params)
	if (!parsedIdPost.success)
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Invalid UUID in route parameter',
			details: formatZodErrors(parsedIdPost.error),
		})

	try {
		await postService.deletePost(parsedIdPost.data.id, req.user.id);
		return res.status(204).send();
	} catch (error) {
		if (error instanceof ForbiddenAccessPostError)
			throw new ForbiddenError({ message: error.message })
		else if (error instanceof PostNotFoundError)
			throw new NotFoundError({ message: error.message })
		else if (error instanceof ConflictPostError)
			throw new ConflictError({
				message: error.message,
				code: ErrorCodes.CONFLICT
			})
		throw error;
	}

}

const updatePost = async (
	req: AuthenticatedRequest,
	res: Response) => {

	const parsedIdPost = idParamSchema.safeParse(req.params)
	if (!parsedIdPost.success)
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Invalid UUID in route parameter',
			details: formatZodErrors(parsedIdPost.error),
	})

	const captionParse = updatePostSchema.safeParse(req.body);
	if (!captionParse.success)
				throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Input contains invalid fields',
			details: formatZodErrors(captionParse.error),
	})

	try {
		const updatedPost = await postService.updatePost(parsedIdPost.data.id, req.user.id, req.body);
		return res.status(200).json({
			data:updatedPost
		});

	} catch (error) {
		if (error instanceof ForbiddenAccessPostError)
			throw new ForbiddenError({ message: error.message })
		else if (error instanceof PostNotFoundError)
			throw new NotFoundError({ message: error.message })

		throw error;
	}
}

const uploadPost = async (req: AuthenticatedRequest, res: Response) => {

	const userId = req.user.id;
	if (!req.file)
		throw new BadRequestError({
			code: ErrorCodes.BAD_REQUEST,
			message: 'Image is required.'
	});

	const captionParsed = uploadPostSchema.safeParse(req.body)
	if (!captionParsed.success)
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Caption malformed',
			details: formatZodErrors(captionParsed.error),
	})
	let postCreated;
	try {
		postCreated = await postService.createPost(userId, req.file.buffer, captionParsed.data.caption ?? null)
	} catch (error) {
		throw error;
	}
	return res.status(201).json({
		data:postCreated
	});
}

const getPostById = async (req: AuthenticatedRequest, res: Response) => {

	const parsedIdPost = idParamSchema.safeParse(req.params)
	if (!parsedIdPost.success)
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Invalid UUID in route parameter',
			details: formatZodErrors(parsedIdPost.error),
	})
	try{
		const post = await postService.getPublicPostById(parsedIdPost.data.id)
		if (!post)
			throw new NotFoundError({
					message:'Post not found',
					code:ErrorCodes.NOT_FOUND,
				})
		return res.status(200).json({
			data:post
		})
	} catch(error){
		throw error;
	}

}


const getPosts = async (req: AuthenticatedRequest, res: Response) => {


	return res.status(200).json({
			data:{}
		})
		/*
	try{
		const post = await postService.getPublicPostById(parsedIdPost.data.id)
		if (!post)
			throw new NotFoundError({
					message:'Post not found',
					code:ErrorCodes.NOT_FOUND,
				})

	} catch(error){
		throw error;
	}
*/
}

export { deletePost, uploadPost, updatePost, getPostById, getPosts}
