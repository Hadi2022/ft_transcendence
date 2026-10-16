import type { Request, Response } from 'express';

const getHealth = (req: Request, res: Response): void => {
    res.status(200).send('ok');
};

module.exports = { getHealth };
