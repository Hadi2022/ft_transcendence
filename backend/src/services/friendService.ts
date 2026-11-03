
import { GenericConstraintError, UniqueConstraintError } from '../errors/RepositoryErrors.ts'
import * as friendRepository from '../repositories/friendRepository.ts'
import type { Friend, FriendRelation } from '../types/friend.ts'

import { AlreadyFriendsError, FriendSelfError, FriendRequestExistsError } from '../errors/friendErrors.ts'

export const openOrAcceptFriendRequest = async (relation: FriendRelation): Promise<Friend | null> => {

	if (relation.receiverId == relation.senderId)
		throw new FriendSelfError('Cannot friend yourself')

	const existingRequest = await friendRepository.findBidirectional(relation)

	if (existingRequest?.status == 'accepted')
		throw new AlreadyFriendsError('Already friends')

	if (existingRequest?.status == 'pending' && existingRequest.senderId == relation.receiverId)
		return friendRepository.updateStatus(existingRequest.id, 'accepted')

	try {
		return await friendRepository.create(relation)	
	} catch (error) {

		if (error instanceof UniqueConstraintError || error instanceof GenericConstraintError)
			throw new FriendRequestExistsError('Friend reqeuest already open')

		throw error
	}
    
}
