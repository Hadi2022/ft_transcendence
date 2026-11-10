import process from 'node:process';
import express from 'express';
import http from 'node:http'

import parseCookies from './middleware/parseCookies.ts';
import { loadSession } from './middleware/auth.ts';
import apiRoutes from './routes/apiRoutes.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { syntaxErrorParser } from './middleware/jsonParser.ts';
import { startSessionCleanUp } from './jobs/session-cleanup.ts';
import { initSocket } from './socket/socket.ts';

const app = express();
const server = http.createServer(app)
initSocket(server)

app.set('trust proxy', 1);

app.use(express.json());
app.use(syntaxErrorParser)
app.use(parseCookies);
app.use(loadSession);

app.use('/api', apiRoutes);

app.use(errorHandler)

const port = process.env.PORT || 3000;

const start = async () => {
    server.listen(port, () => {
        console.log(`App started on port ${port}`);
        startSessionCleanUp();
    });

};

start();
