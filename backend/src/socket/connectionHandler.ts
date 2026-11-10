
import type { Socket, Server } from "socket.io";
import type { User } from "../types/user.ts";

const isAuthenticated = (socket: Socket) => {
	if (!socket.data.user || !socket.data.session)
		return false
	return true
}

let	connectedUsers = new Map<string, Set<string>>()

const	addUserConnection = (user: User, socket: Socket): number => {

	let userSockets = connectedUsers.get(user.id)

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

	let userSockets = connectedUsers.get(user.id)
	if (!userSockets)
		throw new Error ('Fuck')

	userSockets.delete(socket.id)

	const userSocketAmount = userSockets.size

	if (userSocketAmount < 1) {
		connectedUsers.delete(user.id)
	}

	return userSocketAmount
}

export const connectionHandler = (io: Server, socket: Socket) => {

	if (!isAuthenticated(socket)) {
		socket.disconnect(true)
		return 
	}

	const	user = socket.data.user

	if (addUserConnection(user, socket) == 1)
		socket.broadcast.emit('status', 'hello')

	socket.emit('status', 'You are logged in')
	
	socket.on('disconnect', () => {
		const connectionAmount = removeUserConnection(user, socket)
		if (connectionAmount < 1)
			socket.broadcast.emit('status', 'bye')

	})
	
	socket.on('status', (status: string) => {
		console.log(status)
	})
	
}