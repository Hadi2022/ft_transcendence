import type { Request, Response } from 'express';

import { idParamSchema } from '../schemas/common.ts';
import { openSessionSchema } from '../schemas/session.ts';

import * as sessionService from '../services/sessionService.ts'
import * as userService from '../services/userService.ts'

import * as sessionConstants from '../constants/session.ts'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors/HttpErrors.ts';
import { formatZodErrors } from '../utils/zod.ts';

function assertAuthenticated(req: Request
): asserts req is Request & {
    user: NonNullable<Request['user']>
    session: NonNullable<Request['session']>
} {
    if (!req.user || !req.session) {
        throw new UnauthorizedError({})
    }
}

export const openSession = async (req: Request, res: Response) => {

	if (req.session)
		throw new ConflictError({ message: 'You are already logged in' })

	const parsed = openSessionSchema.safeParse(req.body)
	
	if (!parsed.success)
		throw new BadRequestError({
			message: 'Input contains invalid fields',
			details: formatZodErrors(parsed.error)
	})

	const { identifier, password } = parsed.data

	const user = await userService.isValidCredentials(identifier, password)	

	if (!user)
		throw new UnauthorizedError({ message: 'Invalid credentials' })

	const session = await sessionService.openSession(user.id, {
		ipOrigin: req.ip ?? null,
		userAgent: req.get('user-agent')?.slice(0, 255) ?? null,
	})

	res.cookie(sessionConstants.COOKIE_NAME, session.token, {
		httpOnly: true,
		expires: session.expiresAt,
		path: '/'
		// Will add more later, currently just for production and testing
	})

	res.status(201).end()
}

export const listSessions = async (req: Request, res: Response) => {
	assertAuthenticated(req)

	const sessions = await sessionService.findUserSessions(req.user.id)
	
	res.status(200).json({
		data:
			sessions.map((s) => ({ ...s, current: s.id === req.session.id }))
	})
}

export const closeSession = async (req: Request, res: Response) => {
	assertAuthenticated(req)

	const parsed = idParamSchema.safeParse(req.params)

	if (!parsed.success)
		throw new BadRequestError({ message: 'Invalid UUID in route parameter' })

	if (!await sessionService.closeUserSessionById({userId: req.user.id, sessionId: parsed.data.id}))
		throw new NotFoundError({ message: 'Session could not be found' })

	if (parsed.data.id === req.session.id)
		res.clearCookie(sessionConstants.COOKIE_NAME, {
			httpOnly: true,
			path: '/'
	})

	res.status(204).end();
}

export const closeCurrentSession = async (req: Request, res: Response) => {
	assertAuthenticated(req)

	await sessionService.closeUserSessionById({userId: req.user.id, sessionId: req.session.id});

	res.clearCookie(sessionConstants.COOKIE_NAME, {
		httpOnly: true,
		path: '/'
	})

	res.status(204).end();
}

export const closeAllUserSessions = async (req: Request, res: Response) => {
	assertAuthenticated(req)

	await sessionService.closeAllUserSessions(req.user.id)

	res.clearCookie(sessionConstants.COOKIE_NAME, {
		httpOnly: true,
		path: '/'
	})

	res.status(204).end()
}