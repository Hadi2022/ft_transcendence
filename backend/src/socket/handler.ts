
		// Emit message to all users on socket that client connected
		// Emit message to client showing all logged in users

import type { Socket, Server } from "socket.io";

const isAuthenticated = (socket: Socket) => {
	if (!socket.data.user || !socket.data.session)
		return false
	return true
}

export const connectionHandler = (io: Server, socket: Socket) => {

	if (!isAuthenticated(socket)) {
		socket.disconnect(true)
		return 
	}

	socket.broadcast.emit('status', 'hello')
	socket.emit('status', 'You are logged in')
	
	socket.on('disconnect', () => {
		io.emit('status', 'bye')
	})
	
	socket.on('status', (status: string) => {
		console.log(status)
	})
	
}