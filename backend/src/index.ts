import process from 'node:process';
import express from 'express';

import apiRoutes from './routes/apiRoutes.ts';
// import connectDB from './db/connectDB.ts';

const app = express();

app.use(express.json()); // Parse incoming JSON request bodies
app.use('/', apiRoutes);

const port = process.env.PORT || 3000;
const start = async () => {
	
	// await connectDB();

	app.listen(port, () => {
		console.log(`App started on port ${port}`);
	});
}

start();

