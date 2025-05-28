import "module-alias/register";
import app from "./app";
import { createServer } from "node:http";

const PORT = process.env.PORT || 4000;

const server = createServer(app);

server.listen(PORT, () => {
	console.log(
		`Server running on port ${PORT} in ${process.env.NODE_ENV?.toLowerCase()}.`
	);
});
