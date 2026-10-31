
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/express/Request.js';

type AuthenticatedHandler = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => unknown;

export const authed = (handler: AuthenticatedHandler): RequestHandler => {
	return (req, res, next) => handler(req as AuthenticatedRequest, res, next);
}