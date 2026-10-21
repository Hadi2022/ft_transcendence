const process = require("process");
const express = require ("express");
const cookieParser = require('cookie-parser')

const apiRoutes = require('./routes/apiRoutes.ts');
// const connectDB = require('./db/connectDB.ts');

const app = express();

app.use(cookieParser())

app.use('/', apiRoutes)

const port = process.env.PORT || 3000
const start = async () => {
	
	// await connectDB();

	app.listen(port, () => {
		console.log(`App started on port ${port}`);
	});
}

start();

