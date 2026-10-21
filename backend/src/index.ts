const process = require("process");
const express = require ("express");

const apiRoutes = require('./routes/apiRoutes.ts');
// const connectDB = require('./db/connectDB.ts');

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

