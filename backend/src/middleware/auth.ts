
import * as sessionService from '../services/sessionService.ts'
import * as userService from '../services/userService.ts'

import * as sessionConstants from '../constants/session.ts'

import type { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

	const token = req.cookies[sessionConstants.COOKIE_NAME]

	if (token)
		req.session = sessionService.findSessionByToken(token)

	if (req.session)
		req.user = userService.findUserById(req.session.userId)

	next();
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	if (!req.session)
		throw new Error('Unauthorized')// will be new Unauthorized()
}
