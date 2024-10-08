import { configDotenv } from "dotenv";
import app from "./app";
import { createServer } from "node:http";
import initSocket from "./io";

configDotenv({ path: "./env" });

const PORT = process.env.PORT || 3000;

const server = createServer(app);
const socketServer = initSocket(server);

server.listen(PORT, () => {
	console.log(
		`Server running on port ${PORT} in ${process.env.ENVIROMENT?.toLowerCase()}.`
	);
});

socketServer.of("/lobby").on("connect", (socket) => {
	console.log("Connected");

	socket.on("create", function (room) {
		console.log(`A quiz lobby is on the way 🔥 ${room.joinCode}`);
		console.log(room);
		socket.join(room.joinCode);
		// socket.emit("joined", room.name);
		socket.broadcast.emit("joined", room.name);
	});
});

export { socketServer };
