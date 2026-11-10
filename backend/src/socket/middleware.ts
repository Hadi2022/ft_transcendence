import type { Socket,  } from "socket.io";
import * as sessionService from '../services/sessionService.ts'
import * as userService from '../services/userService.ts'

export const loadSession = async (socket: Socket, next: Function) => {

	const token = socket.handshake.auth.token

	if (typeof token === 'string') {
		const session = await sessionService.findActiveSessionByToken(token)

		if (session) {
			socket.data.session = session

			const user = await userService.findUserById(session.userId)

			if (user) {
				socket.data.user = user
			}
		}
	}

	next();
}

export const isAuthenticated = (socket: Socket, next: Function) => {
	if (!socket.data.user || !socket.data.session)
		return false 
	return true
}
