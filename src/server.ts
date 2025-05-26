import "module-alias/register";

import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

import app from "./app";
import { createServer } from "node:http";

const PORT = process.env.PORT || 4000;

const server = createServer(app);

console.log(process.env.NODE_ENV);

server.listen(PORT, () => {
	console.log(
		`Server running on port ${PORT} in ${process.env.NODE_ENV?.toLowerCase()}.`
	);
});
