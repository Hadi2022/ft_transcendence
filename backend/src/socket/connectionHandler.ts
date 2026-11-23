
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
const	announcedOnline = new Set<string>()

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

const syncPresence = (socket: Socket): string | null => {

	const userId = socket.data.user.id

	const online = connectedUsers.has(userId)

	if (online === announcedOnline.has(userId))
		return null

	if (online)
		announcedOnline.add(userId)
	else
		announcedOnline.delete(userId)

	return online ? 'user:online' : 'user:offline'

}

const notifyFriends = (io: Server, socket: Socket, friends: string[]) => {

	const userId = socket.data.user.id
	const friendRooms = friends.map(userRoom)
	const state = syncPresence(socket)

	if (friendRooms.length > 0 && state)
		io.to(friendRooms).emit(state, { userId })
}

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
				notifyFriends(io, socket, await getOnlineFriends(user.id))
			} catch (err) {
				console.error('Failed to emit user:offline', err)
			}
		}
	})

	const currentFriends = getOnlineFriends(user.id)

	if (addUserConnection(user, socket) === 1) {
		notifyFriends(io, socket, await currentFriends)
	}

	informSocket(socket, await currentFriends)
}