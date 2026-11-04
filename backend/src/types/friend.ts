
export type FriendshipStatus = 'pending' | 'accepted'

export interface FriendRelation {
	senderId: string,
	receiverId: string,
}

export type Friend = {
	id: string,
	senderId: string,
	receiverId: string,
	status: FriendshipStatus,
	createdAt: Date,
}