if (process.env.NODE_ENV === "production") {
	require("module-alias/register");
}

import app from "./app";
import { createServer } from "node:http";
import { prisma, redisClient, createWebSocketServer } from "@/lib";
import { env } from "@/config/env";

const PORT = env.port;

const server = createServer(app);

// Initialize Redis connection
async function startServer() {
	try {
		// Connect to Redis
		await redisClient.connect();
		console.log("Redis connected successfully");

		// Initialize WebSocket server
		createWebSocketServer(server);
		console.log("WebSocket server created");

		// connect to prisma
		prisma.$connect().then(() => {
			console.log("Prisma connected successfully");
		});

		server.listen(PORT, () => {
			console.log(
				`Server running on port ${PORT} in ${env.nodeEnv.toLowerCase()}.`
			);
			console.log("WebSocket server initialized");
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
}

// Graceful shutdown
process.on("SIGTERM", async () => {
	console.log("SIGTERM received, shutting down gracefully");
	try {
		await redisClient.disconnect();
		server.close(() => {
			console.log("Server closed");
			process.exit(0);
		});
	} catch (error) {
		console.error("Error during shutdown:", error);
		process.exit(1);
	}
});

process.on("SIGINT", async () => {
	console.log("SIGINT received, shutting down gracefully");
	try {
		await redisClient.disconnect();
		server.close(() => {
			console.log("Server closed");
			process.exit(0);
		});
	} catch (error) {
		console.error("Error during shutdown:", error);
		process.exit(1);
	}
});

startServer();
