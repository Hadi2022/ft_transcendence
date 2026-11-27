import { AlreadyFollowingError, FollowNotFoundError } from '../errors/followError.ts'
import { UniqueConstraintError, RecordNotFoundError } from '../errors/RepositoryErrors.ts'
import type { Follow, NewFollowData } from '../types/follow.ts'
import * as followRepository from '../repositories/followRepository.ts'
import { UserNotFoundError } from '../errors/userErrors.ts'

export const createFollow = async (data: NewFollowData): Promise<Follow> => {
	
	try {
		return await followRepository.createFollow(data)
	} catch (err) {
		if (err instanceof UniqueConstraintError)
			throw new AlreadyFollowingError()
		if (err instanceof RecordNotFoundError)
			throw new UserNotFoundError('User could not be found')
        throw err
	}

}

export const deleteFollow = async (data: NewFollowData): Promise<Follow> => {

	try {
		return await followRepository.deleteFollow(data.followerId, data.continuedId)
	} catch (err) {
		if (err instanceof RecordNotFoundError)
			throw new FollowNotFoundError('User could not be found')
        throw err
	}

}

export const isFollowing = followRepository.isFollowing
export const countFollowers = followRepository.countFollowers
export const countFollowing = followRepository.countFollowings
// I did so much work here...