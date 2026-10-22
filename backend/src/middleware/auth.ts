
const sessionService = require('../services/sessionService.ts')

import type { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

	req.session = sessionService.findSessionById(req.cookies.sessionID)

	next();
}

module.exports = authMiddleware