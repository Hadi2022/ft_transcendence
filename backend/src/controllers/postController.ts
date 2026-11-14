import { idParamSchema } from "@transcendence/shared/schemas/common";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express/Request.js";
import { BadRequestError} from "../errors/HttpErrors.ts";
import { ErrorCodes } from "@transcendence/shared/errors/error-codes";
import { formatZodErrors } from "../utils/zod.ts";
import * as postService from '../services/postService.ts'
import { RecordNotFoundError } from "../errors/RepositoryErrors.ts";

const deletePost = async (
	req:AuthenticatedRequest,
	res: Response)=> {

	const parsedIdPost = idParamSchema.safeParse(req.params)
	console.log(`parseID ${parsedIdPost.data?.id}\n`)
	console.log(`userID ${req.user.id}`)
	if (!parsedIdPost.success)
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Invalid UUID in route parameter',
			details: formatZodErrors(parsedIdPost.error),
		})
	try {
		await postService.deletePost(parsedIdPost.data.id, req.user.id);
	} catch (error) {
		if (error instanceof RecordNotFoundError)
			throw error
		throw error
	}

	return res.status(204)
}

export {deletePost}
