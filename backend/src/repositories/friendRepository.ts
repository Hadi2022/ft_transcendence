
import { prisma } from '../db/prisma/prisma.ts'
import type { Friend, FriendRelation, FriendshipStatus } from '../types/friend.ts'
import { UniqueConstraintError,GenericConstraintError } from '../errors/RepositoryErrors.ts'
import { Prisma } from '@prisma/client'
import type { Order } from '../types/query.ts'

export const create = async (data: FriendRelation) => {

	let friend

	try {
		friend = await prisma.friend.create({
			data
		})
	} catch (error) {

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2002')
			throw new UniqueConstraintError('Friend status exists')

		else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2004')
			throw new GenericConstraintError('Constraint violation')

		throw error
	}

	return friend
}

export const findManyPendingByReceiver = async (receiver:string) => {

	const order: Order = 'desc'

	return prisma.friend.findMany({
		where: {
			receiverId: receiver, 
			status: 'pending',
		},
		orderBy: [{ createdAt: order }],
	})
}


export const findOpenRequest = async (data: FriendRelation) => {

	return prisma.friend.findUnique({
		where: {
			senderId_receiverId: {...data},
			status: 'pending',
		}
	})
}

export const findBidirectional = async (data: FriendRelation): Promise<Friend | null> => {
	return await prisma.friend.findUnique({
		where: {
				senderId_receiverId: {...data},
		}
	})
	??
	await prisma.friend.findUnique({
		where: {
				senderId_receiverId: {senderId: data.receiverId, receiverId: data.senderId},
		}
	})
}

export const findAcceptedBidirectional = async (data: FriendRelation): Promise<Friend | null> => {
	return await prisma.friend.findUnique({
		where: {
				senderId_receiverId: {...data},
				status: 'accepted',
		}
	})
	??
	await prisma.friend.findUnique({
		where: {
				senderId_receiverId: {senderId: data.receiverId, receiverId: data.senderId},
				status: 'accepted',
		}
	})
}

export const updateStatus = async (id: string, status: FriendshipStatus): Promise<Friend> => {

	return prisma.friend.update({
		where: {
			id: id,
		},
		data: {
			status
		}
	})

}