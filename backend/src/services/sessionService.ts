import { hashToken, generateToken } from "../utils/hash.ts"

import * as sessionRepository from '../repositories/sessionRepository.ts'
import * as sessionConstants from '../constants/session.ts'

type CreateSessionMeta = {
	ipOrigin?: string | null
	userAgent?: string | null
}

export const findActiveSessionByToken = async (token: string) => {
	
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

export const closeUserSessionById = async ({ userId, sessionId }: { userId: string; sessionId: string }) => {
	const { count } = await sessionRepository.deleteByIdAndUserId({ sessionId, userId })
	return count > 0
}

export const closeAllUserSessions = async (userId: string) => {
	await sessionRepository.deleteByUserId(userId)
}