
import type { Response } from 'express'
import { listPendingByRecipient, openOrAcceptFriendRequest, declineFriendRequest, acceptFriendRequest } from '../services/friendService.ts'
import type { AuthenticatedRequest } from '../types/express/Request.js'
import { openFriendRequestSchema, acceptFriendRequestSchema } from '@transcendence/shared/schemas/friend'
import { formatZodErrors } from '../utils/zod.ts'
import { BadRequestError, ConflictError, InternalError, NotFoundError } from '../errors/HttpErrors.ts'
import { FriendError } from '../errors/friendErrors.ts'
import { UserNotFoundError } from '../errors/userErrors.ts'
import { idParamSchema } from '@transcendence/shared/schemas/common'

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

		else if (error instanceof UserNotFoundError)
			throw new NotFoundError({
				details: {reason: 'cannot send friend request because the user does not exist'}
			})
		
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
            message: 'Invalid UUID in route parameter'
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

export const patchFriendRequest = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const parsedId = idParamSchema.safeParse(req.params)

    if (!parsedId.success)
        throw new BadRequestError({
            message: 'Invalid UUID in route parameter'
        })

    const parsedBody = acceptFriendRequestSchema.safeParse(req.body)

    if (!parsedBody.success)
        throw new BadRequestError({
            message: 'Invalid friend request status',
            details: formatZodErrors(parsedBody.error)
        })

    const friendRequest = await acceptFriendRequest(
        parsedId.data.id,
        req.user.id
    )

    if (!friendRequest)
        throw new NotFoundError({
            message: 'Pending friend request could not be found'
        })

    res.status(200).json({ data: friendRequest })
}
