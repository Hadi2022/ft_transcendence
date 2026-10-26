
import * as sessionService from '../services/sessionService.ts'
import * as userService from '../services/userService.ts'

import * as sessionConstants from '../constants/session.ts'

import type { Request, Response, NextFunction } from 'express';

export const loadSession = async (req: Request, res: Response, next: NextFunction) => {

	const token = req.cookies[sessionConstants.COOKIE_NAME]

	if (typeof token === 'string')
		req.session = await sessionService.findActiveSessionByToken(token)

	if (req.session)
		req.user = await userService.findUserById(req.session.userId)

	next();
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user)
		throw new Error('Unauthorized')// will be new Unauthorized()
	next()
}
