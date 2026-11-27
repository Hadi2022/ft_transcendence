import { AlreadyFollowingError } from '../errors/followError.ts'
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