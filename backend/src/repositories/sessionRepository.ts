import { Prisma } from '@prisma/client'
import { prisma } from '../db/prisma/prisma.ts'
import { ErrorSessionCleanup } from "../errors/sessionErrors.ts";

type CreateSessionData = {
	userId: string
	tokenHash: string
	expiresAt: Date
	ipOrigin?: string | null
	userAgent?: string | null
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
	return prisma.session.deleteMany({ where: { id: sessionId, userId } })
}

export const deleteByUserId = async (userId: string) => {
	return prisma.session.deleteMany({ where: { userId } })
}

export const purgeExpired = async () => {
	try {
		const result = await prisma.session.deleteMany(
			{
				where: {
					expiresAt: {
						lt: new Date()
					}
				}
			}
		);
		return result;
	}catch (error:unknown) {
		if (error instanceof Prisma.PrismaClientKnownRequestError){
			throw new ErrorSessionCleanup(error.message);
		}
		throw error;
	}
}


