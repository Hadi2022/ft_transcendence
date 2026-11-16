import { idParamSchema } from "@transcendence/shared/schemas/common";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express/Request.js";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError} from "../errors/HttpErrors.ts";
import { ErrorCodes } from "@transcendence/shared/errors/error-codes";
import { formatZodErrors } from "../utils/zod.ts";
import * as postService from '../services/postService.ts'
import { ConflictPostError, ForbiddenAccessPostError, InternalPostError, PostNotFoundError } from "../errors/postErrors.ts";

const deletePost = async (
	req:AuthenticatedRequest,
	res: Response)=> {

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
			throw new ForbiddenError({message:error.message})
		else if (error instanceof PostNotFoundError)
			throw new NotFoundError({message:error.message})
		else if (error instanceof ConflictPostError)
			throw new ConflictError({
				message:error.message,
				code:ErrorCodes.CONFLICT})
		throw error;
	}

}

export {deletePost}
