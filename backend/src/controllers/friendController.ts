
import type { Response } from 'express'
import { listPendingByRecipient, openOrAcceptFriendRequest } from '../services/friendService.ts'
import type { AuthenticatedRequest } from '../types/express/Request.js'
import { openFriendRequestSchema } from '@transcendence/shared/schemas/friend'
import { formatZodErrors } from '../utils/zod.ts'
import { BadRequestError, ConflictError, InternalError, NotFoundError } from '../errors/HttpErrors.ts'
import { AlreadyFriendsError, FriendError, FriendRequestExistsError, FriendSelfError } from '../errors/friendErrors.ts'
import { UserNotFoundError } from '../errors/userErrors.ts'
import { idParamSchema } from '@transcendence/shared/schemas/common'
import { declineFriendRequest } from '../services/friendService.ts'
import { ErrorCodes } from '@transcendence/shared/errors/error-codes'
import { ErrorDetails } from '@transcendence/shared/errors/error-details'

export const openFriendRequest = async (req: AuthenticatedRequest, res: Response) => {

	const parsed = openFriendRequestSchema.safeParse(req.body)

	if (parsed.error) {
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: "Input contains invalid fields",
			details: formatZodErrors (parsed.error),
		})
	}

	let friendRequest

	try {
		friendRequest = await openOrAcceptFriendRequest({ senderId: req.user.id, ...parsed.data})    
	} catch (error) {
		if (error instanceof FriendSelfError)
			throw new BadRequestError({
				message: error.message,
				code: ErrorCodes.VALIDATION_ERROR,
				details: { userId: ErrorDetails.CANNOT_TARGET_SELF }
			})

		if (error instanceof AlreadyFriendsError)
			throw new ConflictError({
				message: error.message,
				code: ErrorCodes.ALREADY_FRIENDS
			})

		if (error instanceof FriendRequestExistsError)
			throw new ConflictError({ message: error.message })

		if (error instanceof UserNotFoundError)
			throw new NotFoundError()
		
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

export const deleteFriendRequest = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const parsed = idParamSchema.safeParse(req.params)

    if (!parsed.success) {
        throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
            message: 'Invalid UUID in route parameter',
			details: formatZodErrors(parsed.error),
        })
    }

    const deleted = await declineFriendRequest(
        parsed.data.id,
        req.user.id
    )

    if (!deleted) {
        throw new NotFoundError({
            message: 'Friend request could not be found'
        })
    }

    res.status(204).end()
}

export const getFriendRequests = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const friendRequests = await listPendingByRecipient(req.user.id)

    res.status(200).json({
        data: friendRequests
    })
}
