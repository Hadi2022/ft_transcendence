import * as process from "process";
import express from "express";

import parseCookies from './middleware/parseCookies.ts'
import { loadSession } from "./middleware/auth.ts";

import apiRoutes from './routes/apiRoutes.ts';
// const connectDB = require('./db/connectDB.ts');

const app = express();

app.use(express.json())
app.use(parseCookies)
app.use(loadSession)

app.use('/', apiRoutes);

const port = process.env.PORT || 3000;
const start = async () => {
	
	// await connectDB();

	app.listen(port, () => {
		console.log(`App started on port ${port}`);
	});
}

start();

