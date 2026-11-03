
import type { Response } from 'express'
import { openOrAcceptFriendRequest } from '../services/friendService.ts'
import type { AuthenticatedRequest } from '../types/express/Request.js'
import { openFriendRequestSchema } from '../schemas/friend.ts'
import { formatZodErrors } from '../utils/zod.ts'
import { BadRequestError, ConflictError, InternalError } from '../errors/HttpErrors.ts'
import { FriendError } from '../errors/friendErrors.ts'

export const openFriendRequest = async (req: AuthenticatedRequest, res: Response) => {

	const parsed = openFriendRequestSchema.safeParse(req.body)

	if (parsed.error) {
		throw new BadRequestError({
			message: "Input contains invalid fields",
			details: formatZodErrors (parsed.error),
		})
	}

	let friendRequest

	try {
		friendRequest = await openOrAcceptFriendRequest({ senderId: req.user.id, ...parsed.data})    
	} catch (error) {
		if (error instanceof FriendError) {
			throw new ConflictError({
				details: {reason: error.message}
			})
		}
		
		throw error
	}

	let code

	if (friendRequest?.status == 'accepted')
		code = 200
	else if (friendRequest?.status == 'pending')
		code = 201
	else
		throw new InternalError()

	res.status(code).json({
		data: friendRequest
	})
}