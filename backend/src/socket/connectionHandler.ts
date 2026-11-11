
import type { Socket, Server } from "socket.io";
import type { User } from "../types/user.ts";

const isAuthenticated = (socket: Socket) => {
	if (!socket.data.user || !socket.data.session)
		return false
	return true
}

const	connectedUsers = new Map<string, Set<string>>()

const	addUserConnection = (user: User, socket: Socket): number => {

	const userSockets = connectedUsers.get(user.id)

	if (!userSockets) {
		const	newUserSockets = new Set<string>()
		newUserSockets.add(socket.id)
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

const informSocket = (socket: Socket) => {

	socket.emit('user:online-list', {
		userIds: [...connectedUsers.keys()],
	})
}

export const connectionHandler = (io: Server, socket: Socket) => {

	if (!isAuthenticated(socket)) {
		socket.disconnect(true)
		return 
	}

	const	user = socket.data.user

	if (addUserConnection(user, socket) === 1)
		socket.broadcast.emit('user:online', {
			userId: user.id,
		})

	informSocket(socket)
	
	socket.on('disconnect', () => {
		const connectionAmount = removeUserConnection(user, socket)
		if (connectionAmount < 1)
			socket.broadcast.emit('user:offline', {
				userId: user.id,
			})
	})
}