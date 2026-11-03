
import { GenericConstraintError, UniqueConstraintError } from '../errors/RepositoryErrors.ts'
import * as friendRepository from '../repositories/friendRepository.ts'
import * as userRepository from '../repositories/userRepository.ts'
import type { Friend, FriendRelation } from '../types/friend.ts'

import { AlreadyFriendsError, FriendSelfError, FriendRequestExistsError } from '../errors/friendErrors.ts'
import { UserNotFoundError } from '../errors/userErrors.ts'

export const openOrAcceptFriendRequest = async (relation: FriendRelation): Promise<Friend> => {

	if (userRepository.findById(relation.receiverId) == null)
		throw new UserNotFoundError('User not found')

	if (relation.receiverId == relation.senderId)
		throw new FriendSelfError('Cannot friend yourself')

	const existingRequest = await friendRepository.findBidirectional(relation)

	if (existingRequest?.status == 'accepted')
		throw new AlreadyFriendsError('Already friends')

	if (existingRequest?.status == 'pending' && existingRequest.senderId == relation.receiverId)
		return await friendRepository.updateStatus(existingRequest.id, 'accepted')

	try {
		return await friendRepository.create(relation)	
	} catch (error) {

		if (error instanceof UniqueConstraintError || error instanceof GenericConstraintError)
			throw new FriendRequestExistsError('Friend reqeuest already open')

		throw error
	}
    
}
