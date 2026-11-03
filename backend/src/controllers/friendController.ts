
import type { Response } from 'express'
import { openOrAcceptFriendRequest } from '../services/friendService.ts'
import type { AuthenticatedRequest } from '../types/express/Request.js'
import { openFriendRequestSchema } from '../schemas/friend.ts'
import { formatZodErrors } from '../utils/zod.ts'
import { BadRequestError, ConflictError } from '../errors/HttpErrors.ts'
import { FriendError } from '../errors/friendErrors.ts'

export const openFriendRequest = async (req: AuthenticatedRequest, res: Response) => {

	const parsed = openFriendRequestSchema.safeParse(req.body)

	if (parsed.error) {
		throw new BadRequestError({
			message: "Input contains invalid fields",
			details: formatZodErrors (parsed.error),
		})
	}

	try {
		await openOrAcceptFriendRequest({ senderId: req.user.id, ...parsed.data})    
	} catch (error) {
		if (error instanceof FriendError) {
			throw new ConflictError({
				details: {reason: error.message}
			})
		}
		else
			throw error
	}
	
}