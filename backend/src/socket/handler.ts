
		// Emit message to all users on socket that client connected
		// Emit message to client showing all logged in users

import type { Socket, Server } from "socket.io";

export const connectionHandler = (io: Server, socket: Socket) => {

	socket.broadcast.emit('status', 'hello')
	socket.emit('status', 'You are logged in')
	
	socket.on('disconnect', () => {
		io.emit('status', 'bye')
	})
	
	socket.on('status', (status: string) => {
		console.log(status)
	})
	
}