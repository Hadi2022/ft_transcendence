import { prisma } from '../db/prisma/prisma.ts'

type CreateSessionData = {
	userId: string
	tokenHash: string
	expiresAt: Date
	ipOrigin?: string
	userAgent?: string
}

export const create = async (data: CreateSessionData) => {
	return prisma.session.create({ data })
}

export const findByUserId = async (userId: string) => {
	return prisma.session.findMany({
		where: { userId },
		omit: { tokenHash: true },
	})
}

export const findByTokenHash = async (tokenHash: string) => {
	return prisma.session.findUnique({ where: { tokenHash } })
}

export const deleteByIdAndUserId = async ({ userId, sessionId }: { userId: string; sessionId: string }) => {
	return prisma.session.deleteMany({ where: { id: sessionId, userId} })
}

export const deleteByUserId = async (userId: string) => {
	return prisma.session.deleteMany({ where: { userId } })
}