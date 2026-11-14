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
	if (!parsedIdPost.success)
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Invalid UUID in route parameter',
			details: formatZodErrors(parsedIdPost.error),
		})

	await postService.deletePost(parsedIdPost.data.id, req.user.id);

	return res.status(204).send()
}

export {deletePost}
