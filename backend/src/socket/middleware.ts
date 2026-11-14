import type { Socket,  } from "socket.io";
import * as sessionService from '../services/sessionService.ts'
import * as userService from '../services/userService.ts'
import { parse } from 'cookie-es'

export const loadSession = async (socket: Socket, next: Function) => {

	const cookies = parse(socket.handshake.headers.cookie || "");
	const token = cookies?.sessionID

	if (typeof token !== 'string')
		return next()

	try {

		const session = await sessionService.findActiveSessionByToken(token)

		if (session) {
			socket.data.session = session

			const user = await userService.findUserById(session.userId)

			if (user) {
				socket.data.user = user
			}
		}		
			
	} catch (error) {
		console.log(error)
		return next(new Error('internal'))
	}
	next()
}

export const requireAuth = (socket: Socket, next: Function) => {
	if (!socket.data.user || !socket.data.session)
		return next(new Error('unauthenticated'))
	next()
}
