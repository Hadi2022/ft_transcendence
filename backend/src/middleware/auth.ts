import * as sessionService from '../services/sessionService.ts'
import * as userService from '../services/userService.ts'

import * as sessionConstants from '../constants/session.ts'

import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/HttpErrors.ts';

export const loadSession = async (req: Request, res: Response, next: NextFunction) => {

	const token = req.cookies[sessionConstants.COOKIE_NAME]

	if (typeof token === 'string') {
		const session = await sessionService.findActiveSessionByToken(token)

		if (session) {
			req.session = session

			const user = await userService.findUserById(session.userId)

			if (user) {
				req.user = user
			}
		}
	}

	next();
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user || !req.session)
		throw new UnauthorizedError({ message: 'You are not logged in' })
	next()
}