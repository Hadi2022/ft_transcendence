
import { GenericConstraintError, UniqueConstraintError } from '../errors/RepositoryErrors.ts'
import * as friendRepository from '../repositories/friendRepository.ts'
import * as userRepository from '../repositories/userRepository.ts'
import type { Friend, FriendRelation } from '../types/friend.ts'

import { AlreadyFriendsError, FriendSelfError, FriendRequestExistsError } from '../errors/friendErrors.ts'
import { UserNotFoundError } from '../errors/userErrors.ts'

export const openOrAcceptFriendRequest = async (
    relation: FriendRelation
): Promise<Friend> => {

    if (await userRepository.findById(relation.receiverId) == null)
        throw new UserNotFoundError('User not found')

    if (relation.receiverId == relation.senderId)
        throw new FriendSelfError('Cannot friend yourself')

    const existingRequest = await friendRepository.findBidirectional(relation)

    if (existingRequest)
        return await resolveExistingRequest(existingRequest, relation)

    try {
        return await friendRepository.create(relation)

    } catch (error) {

        if (error instanceof UniqueConstraintError) {

            const concurrentRequest =
                await friendRepository.findBidirectional(relation)

            if (concurrentRequest)
                return await resolveExistingRequest(
                    concurrentRequest,
                    relation
                )

            throw new FriendRequestExistsError(
                'Friend request already open'
            )
        }

        if (error instanceof GenericConstraintError)
            throw new FriendRequestExistsError('Friend request already open')

        throw error
    }
}

export const declineFriendRequest = async (
    requestId: string,
    receiverId: string
): Promise<boolean> => {
    return friendRepository.deletePendingReceivedRequest(
        requestId,
        receiverId
    )
}

export const listPendingByRecipient = async (id: string) => {

    const list = await friendRepository.findManyPendingByReceiver(id)

    return list

}

export const acceptFriendRequest = async (
    requestId: string,
    receiverId: string
): Promise<Friend | null> => {

    return friendRepository.acceptPendingReceivedRequest(
        requestId,
        receiverId
    )
}

const resolveExistingRequest = async (
    existingRequest: Friend,
    relation: FriendRelation
): Promise<Friend> => {

    if (existingRequest.status === 'accepted')
        throw new AlreadyFriendsError('Already friends')

    if (existingRequest.senderId === relation.receiverId) {

        const accepted = await friendRepository.acceptPendingReceivedRequest(
            existingRequest.id,
            relation.senderId
        )

        if (accepted)
            return accepted

        throw new FriendRequestExistsError(
            'Friend request is no longer pending'
        )
    }

    throw new FriendRequestExistsError('Friend request already open')
}