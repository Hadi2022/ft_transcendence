const process = require("process");
const express = require ("express");

const healthRoutes = require('./routes/api/health.ts');
// const connectDB = require('./db/connectDB.ts');

const app = express();

app.use('/health', healthRoutes);

const port = process.env.PORT || 3000;
const start = async () => {
	
	// await connectDB();

	app.listen(port, () => {
		console.log(`App started on port ${port}`);
	});
}

start();

