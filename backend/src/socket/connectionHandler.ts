
import type { Socket, Server } from "socket.io";
import type { User } from "../types/user.ts";
import { userRoom, sessionRoom } from "../services/socketService.ts";
import { findManyAcceptedById } from "../repositories/friendRepository.ts";

const isAuthenticated = (socket: Socket) => {
	if (!socket.data.user || !socket.data.session)
		return false
	return true
}

const	connectedUsers = new Map<string, Set<string>>()

const	addUserConnection = (user: User, socket: Socket): number => {

	const userSockets = connectedUsers.get(user.id)

	if (!userSockets) {
		const	newUserSockets = new Set([socket.id])
		connectedUsers.set(user.id, newUserSockets)
		return 1
	}

	userSockets.add(socket.id)

	return userSockets.size
}

const removeUserConnection = (user: User, socket: Socket): number => {

	const	userSockets = connectedUsers.get(user.id)
	if (!userSockets)
		return 0

	userSockets.delete(socket.id)

	const userSocketAmount = userSockets.size

	if (userSocketAmount < 1) {
		connectedUsers.delete(user.id)
	}

	return userSocketAmount
}

const informSocket = (socket: Socket, friendsList: string[]) => {

	const user = socket.data.user

	socket.emit('user:online-list', {
		userIds: friendsList,
	})
}

const getOnlineFriends = async (userId: string) => {

	const relations = await findManyAcceptedById(userId)

	const friendsList = relations.map((x): string => {
		if (x.receiverId != userId)
			return x.receiverId
		return x.senderId
	})

	return friendsList.filter((x) => connectedUsers.has(x))

}

const getFriendRooms = async (onlineFriends: string[]) => onlineFriends.map(userRoom)

export const connectionHandler = async (io: Server, socket: Socket) => {

	if (!isAuthenticated(socket)) {
		socket.disconnect(true)
		return 
	}

	const	user = socket.data.user	
	const	session = socket.data.session
	
	const expiryTimer = setTimeout(() => {
		socket.disconnect(true)
	}, session.expiresAt - Date.now())

	socket.join(userRoom(user.id))
	socket.join(sessionRoom(session.id))

	socket.on('disconnect', async () => {
		clearTimeout(expiryTimer)
		const connectionAmount = removeUserConnection(user, socket)
		if (connectionAmount < 1) {
			try {
				const friendRooms = await getFriendRooms(await getOnlineFriends(user.id))

				if (friendRooms.length > 0 && !connectedUsers.has(user.id))
					io.to(friendRooms).emit('user:offline', { userId: user.id })
			} catch (err) {
				console.error('Failed to emit user:offline', err)
			}
		}
	})

	const currentFriends = await getOnlineFriends(user.id)

	if (addUserConnection(user, socket) === 1) {
		const friendRooms = await getFriendRooms(currentFriends)

		if (friendRooms.length > 0 && connectedUsers.has(user.id))
			io.to(friendRooms).emit('user:online', {
				userId: user.id,
			})
	}

	await informSocket(socket, currentFriends)
}