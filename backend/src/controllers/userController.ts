import type { Request, Response } from 'express'
import { registerUserSchema, updateUserSchema, usernameSchema } from '@transcendence/shared/schemas/user'
import { listUsersQuerySchema } from '../schemas/user.ts'
import { createUser, listUserProfiles, findUserOwnProfileById, updateUser, findUserProfileByUsername, saveAvatar, deleteAvatar} from '../services/userService.ts'
import { BadRequestError, ConflictError, NotFoundError } from '../errors/HttpErrors.ts'
import { formatZodErrors } from '../utils/zod.ts'
import { UserConcurrencyError, UserEmailConflictError, UserNameConflictError, UserNotFoundError } from '../errors/userErrors.ts'
import type { AuthenticatedRequest } from '../types/express/Request.js'
import { ErrorCodes } from '@transcendence/shared/errors/error-codes'
import { ErrorDetails } from '@transcendence/shared/errors/error-details'
import { validateImage } from '../utils/imageValidation.ts'
import { queryParamsPaginationSchema } from '@transcendence/shared/schemas/common'
import type { Follow } from '../types/follow.ts'
import { AlreadyFollowingError, FollowNotFoundError } from '../errors/followError.ts'
import { isFollowing, countFollowers, countFollowing, createFollow, deleteFollow, getFollowings as getFollowingsFromService, getFollowers as getFollowersFromService } from '../services/followService.ts'

async function registerUser(req: Request, res: Response): Promise<void> {
    const parsed = registerUserSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new BadRequestError({
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Input contains invalid fields',
            details: formatZodErrors(parsed.error)
        })
    }

    let user

    try {
        user = await createUser(parsed.data)
    } catch (e: any) {
        
        if (e instanceof UserEmailConflictError)
            throw new ConflictError({ message: 'User already exists', details: {
                'email': ErrorDetails.EMAIL_IN_USE
            }})

        if (e instanceof UserNameConflictError)
            throw new ConflictError({ message: 'User already exists', details: {
                'username': ErrorDetails.USERNAME_IN_USE
            }})

        throw e
    }

    res.status(201).json({
        data: {
            ...user
        }
    })
}

const getUsers = async (req: Request, res: Response) => {
    const parsed = listUsersQuerySchema.safeParse(req.query)

    if (!parsed.success) {
        throw new BadRequestError({
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Invalid query parameters',
            details: formatZodErrors(parsed.error)
        })
    }

    const { order, order_by } = parsed.data

    const users = await listUserProfiles({
        order,
        orderBy: order_by === 'created_at' ? 'createdAt' : order_by
    })

    res.status(200).json({
        data: {
            users: users,
            // add pagination details here when implemented
        }
    })

}

const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {

    const user = await findUserOwnProfileById(req.user.id)

    if (!user)
        throw new NotFoundError({message: 'You do not exist! (wow!)'})

    res.status(200).json({
        data: {
            ...user
        }
    })

}

const getUserById = (req: Request, res: Response): void => {

    const user = req.userResource

    if (!user) {
        throw new NotFoundError({
            message: 'User not found'
        })
    }

    res.status(200).json({
        data: user
    })
}

const getUserByUsername = async (
    req: Request,
    res: Response
): Promise<void> => {

    const parsed = usernameSchema.safeParse(req.params)

    if (!parsed.success) {
        throw new BadRequestError({
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Invalid username',
            details: formatZodErrors(parsed.error)
        })
    }

    const user = await findUserProfileByUsername(parsed.data.username)

    if (!user) {
        throw new NotFoundError({
            message: 'User not found'
        })
    }

    res.status(200).json({
        data: user
    })
}

const updateCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const parsed = updateUserSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new BadRequestError({
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Input contains invalid fields',
            details: formatZodErrors(parsed.error)
        })
    }

    let user

    try {
        user = await updateUser(req.user.id, parsed.data)
    }
    catch (error) {
        if (error instanceof UserNotFoundError) {
            throw new NotFoundError({
                message: 'User not found'
            })
        }

        throw error
    }

    res.status(200).json({
        data: {
            ...user
        }
    })
}

const setAvatar = async (req: AuthenticatedRequest, res: Response) => {

    const   image = await validateImage(req.file!.buffer, 'avatar')
    let     newAvatarUrl: string

    try {
        newAvatarUrl = await saveAvatar(image, req.user)
    } catch (error: any) {

        if (error instanceof UserConcurrencyError)
            throw new ConflictError()

        throw error
    }
    
    res.status(200).json({
        data: {
            avatarUrl: newAvatarUrl
        }
    })
}

const clearAvatar = async (req: AuthenticatedRequest, res: Response) => {

    try {
        await deleteAvatar(req.user)
    } catch (error: any) {

        if (error instanceof UserConcurrencyError)
            throw new ConflictError()

        throw error
    }

    res.status(204).send()

}

const getFollowings = async (req:AuthenticatedRequest, res: Response) => {

    const parsed_pagination = queryParamsPaginationSchema.safeParse(req.query)
    if (!parsed_pagination.success)
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Invalid pagination query parameters',
			details: formatZodErrors(parsed_pagination.error),
	})
    
    const followings = await getFollowingsFromService (req.userResource!.id,  parsed_pagination.data)

    return res.status(200).json(followings);
    
}

const getFollowers = async (req:AuthenticatedRequest, res: Response) => {

    const parsed_pagination = queryParamsPaginationSchema.safeParse(req.query)
    if (!parsed_pagination.success)
		throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			message: 'Invalid pagination query parameters',
			details: formatZodErrors(parsed_pagination.error),
	})
    
    const followings = await getFollowersFromService (req.userResource!.id,  parsed_pagination.data)

    return res.status(200).json(followings);
    
}

const followUser = async (req: AuthenticatedRequest, res: Response) => {

    const followerId = req.user.id
    const continuedId = req.userResource.id

    if (followerId == continuedId)
        throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			details: { followingId: ErrorDetails.CANNOT_TARGET_SELF }
		})

    let newFollow: Follow

    try {
        newFollow = await createFollow({
            followerId,
            continuedId,
        })
    } catch (err) {
        if (err instanceof UserNotFoundError)
            throw new NotFoundError()
        if (err instanceof AlreadyFollowingError)
            throw new ConflictError()
        throw err
    }

    res.status(201).json({
        data: {
            followerId: newFollow.followerId,
            followingId: newFollow.continuedId,
            createdAt: newFollow.createdAt
        }
    })
}

const unfollowUser = async (req: AuthenticatedRequest, res: Response) => {

    const followerId = req.user.id
    const continuedId = req.userResource.id

    if (followerId == continuedId)
        throw new BadRequestError({
			code: ErrorCodes.VALIDATION_ERROR,
			details: { followingId: ErrorDetails.CANNOT_TARGET_SELF }
		})

    try {
        await deleteFollow({
            followerId,
            continuedId,
        })
    } catch (err) {
        if (err instanceof FollowNotFoundError)
            throw new NotFoundError()
        throw err
    }

    res.status(204).send()
}

const followInfo = async (req: Request, res: Response) => {

    const userId = req.userResource.id
    let follows: null | boolean = false

    if (!req.user)
        follows = null
    else if (await isFollowing(req.user.id, userId))
        follows = true

    const followersCount = await countFollowers(userId)
    const followingCount = await countFollowing(userId)

    res.status(200).json({
        data: {
            followersCount,
            followingCount,
            isFollowing: follows
        }
    })
}

export { 
    registerUser,
    getUsers,
    getCurrentUser,
    getUserById,
    getUserByUsername,
    updateCurrentUser,
    setAvatar,
    clearAvatar,
    getFollowings,
    getFollowers,
    followUser,
    unfollowUser,
    followInfo,
}