import { Server } from "socket.io";
import { Server as nodeServer } from "node:http";
const initSocket = function (server: nodeServer) {
	return new Server(server, {
		cors: {
			origin: "http://localhost:5173",
		},
	});
};
export default initSocket;
