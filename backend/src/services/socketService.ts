
import { getIo } from '../socket/socket.ts'

export const userRoom = (userId: string) => `user:${userId}`
export const sessionRoom = (sessionId: string) => `session:${sessionId}`

export const disconnectSession = (sessionId: string) =>
	getIo().in(sessionRoom(sessionId)).disconnectSockets(true)

export const disconnectUser = (userId: string) =>
	getIo().in(userRoom(userId)).disconnectSockets(true)

export const emitToUser = (userId: string, event: string, payload: unknown) =>
	getIo().to(userRoom(userId)).emit(event, payload)