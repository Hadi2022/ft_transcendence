
const sessionService = require('../services/sessionService.ts')

const sessionConstants = require('../constants/session.ts')

import type { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

	req.session = sessionService.findSessionById(req.cookies[sessionConstants.COOKIE_NAME])

	next();
}

module.exports = authMiddleware