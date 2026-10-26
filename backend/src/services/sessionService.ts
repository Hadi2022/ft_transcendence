import { hashToken, generateToken } from "../utils/hash.ts"
import type { Session } from '@prisma/client'

import * as sessionRepository from '../repositories/sessionRepository.ts'
import * as sessionConstants from '../constants/session.ts'

type CreateSessionMeta = {
	ipOrigin?: string
	userAgent?: string
}

export const findActiveSessionByToken = async (token: string): Promise<Session> => {
	
	const session = await sessionRepository.findByTokenHash(hashToken(token))

	if (!session || session.expiresAt < new Date())
		return null

	return session
}

export const findUserSessions = async (userId: string) => {
	return sessionRepository.findByUserId(userId)
}

export const openSession = async (userId: string, meta?: CreateSessionMeta) => {

	const token = generateToken()
	const tokenHash = hashToken(token)
	const expiresAt = new Date(Date.now() + sessionConstants.SESSION_DURATION_MS)

	await sessionRepository.create({
		userId,
		tokenHash,
		expiresAt,
		...meta
	})

	return { token, expiresAt }
}

export const closeUserSessionById = async (sessionId: string, userId: string) => {
	return await sessionRepository.deleteByIdAndUserId(sessionId, userId)
}

export const closeAllUserSessions = async (userId: string) => {

	await sessionRepository.deleteByUserId(userId)

}