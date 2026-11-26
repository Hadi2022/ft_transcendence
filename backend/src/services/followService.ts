import { AlreadyFollowingError } from '../errors/followError.ts'
import { UniqueConstraintError, RecordNotFoundError } from '../errors/RepositoryErrors.ts'
import type { Follow, NewFollowData } from '../types/follow.ts'
import * as followRepository from '../repositories/followRepository.ts'

export const createFollow = async (data: NewFollowData): Promise<Follow> => {
	
	try {
		return followRepository.createFollow(data)
	} catch (err) {
		if (err instanceof UniqueConstraintError)
			throw new AlreadyFollowingError()
        throw err
	}

}