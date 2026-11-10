
import { Server, Socket } from 'socket.io'
import type http from 'node:http'
import { connectionHandler } from './handler.ts'

let io: Server

export const initSocket = (server: http.Server) => {

	io = new Server(server)

	io.on('connection', (socket: Socket) => {

		connectionHandler(io, socket)

	})

}

export const getIo = () => {
	if (io == undefined)
		throw new Error('Socket server not running!')
	return io
}