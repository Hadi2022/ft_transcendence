import process from 'node:process';
import express from 'express';

import parseCookies from './middleware/parseCookies.ts';
import { loadSession } from './middleware/auth.ts';
import apiRoutes from './routes/apiRoutes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(parseCookies);
app.use(loadSession);

app.use('/api', apiRoutes);

app.use(errorHandler)

const port = process.env.PORT || 3000;

const start = async () => {
    app.listen(port, () => {
        console.log(`App started on port ${port}`);
    });
};

start();