// import { Server as SocketIOServer } from "socket.io";
// import { Server as HTTPServer } from "http";
// import {
// 	socketAuthMiddleware,
// 	AuthenticatedSocket,
// } from "@/middlewares/socketAuth";
// import redisClient from "@/lib/redis";

// // Event interfaces
// interface ClientEvents {
// 	startQuiz: (data: { quizId: string }) => void;
// 	joinSession: (data: { sessionId: string; joinCode?: string }) => void;
// 	submitAnswer: (data: {
// 		questionId: string;
// 		answerId: string;
// 		timeSpent: number;
// 	}) => void;
// 	reconnectSession: (data: { sessionId: string }) => void;
// }

// interface ServerEvents {
// 	sessionCreated: (data: SessionCreatedData) => void;
// 	questionDelivered: (data: QuestionData) => void;
// 	answerResult: (data: AnswerResultData) => void;
// 	sessionCompleted: (data: SessionResultData) => void;
// 	error: (data: ErrorData) => void;
// }

// class WebSocketServer {
// 	private io: SocketIOServer<ClientEvents, ServerEvents>;

// 	constructor(httpServer: HTTPServer) {
// 		this.io = new SocketIOServer(httpServer, {
// 			cors: {
// 				origin: process.env.FRONTEND_URL || "http://localhost:5173",
// 				methods: ["GET", "POST"],
// 				credentials: true,
// 			},
// 			transports: ["websocket", "polling"],
// 		});

// 		this.setupMiddleware();
// 		this.setupEventHandlers();
// 	}

// 	private setupMiddleware() {
// 		// Authentication middleware
// 		this.io.use(socketAuthMiddleware);
// 	}

// 	private setupEventHandlers() {
// 		this.io.on("connection", (socket: AuthenticatedSocket) => {
// 			console.log(`User ${socket.userId} connected with socket ${socket.id}`);

// 			// Store connection mapping in Redis
// 			this.storeConnectionMapping(socket);

// 			// Set up event handlers
// 			this.setupSocketEventHandlers(socket);

// 			// Handle disconnection
// 			socket.on("disconnect", (reason) => {
// 				console.log(`User ${socket.userId} disconnected: ${reason}`);
// 				this.handleDisconnection(socket);
// 			});
// 		});
// 	}

// 	private async storeConnectionMapping(socket: AuthenticatedSocket) {
// 		try {
// 			if (!socket.userId) return;

// 			const connectionData = {
// 				userId: socket.userId,
// 				socketId: socket.id,
// 				connectedAt: new Date().toISOString(),
// 			};

// 			await redisClient.setConnectionMapping(socket.id, connectionData);
// 		} catch (error) {
// 			console.error("Failed to store connection mapping:", error);
// 		}
// 	}

// 	private setupSocketEventHandlers(socket: AuthenticatedSocket) {
// 		// Start quiz event
// 		socket.on("startQuiz", async (data) => {
// 			try {
// 				console.log(`User ${socket.userId} starting quiz ${data.quizId}`);

// 				// TODO: Implement quiz start logic in next task
// 				// For now, just acknowledge the event
// 				socket.emit("error", {
// 					code: "NOT_IMPLEMENTED",
// 					message: "Quiz start functionality not yet implemented",
// 					recoverable: true,
// 				});
// 			} catch (error) {
// 				console.error("Error starting quiz:", error);
// 				socket.emit("error", {
// 					code: "START_QUIZ_ERROR",
// 					message: "Failed to start quiz",
// 					details: error instanceof Error ? error.message : "Unknown error",
// 					recoverable: true,
// 				});
// 			}
// 		});

// 		// Join session event
// 		socket.on("joinSession", async (data) => {
// 			try {
// 				console.log(`User ${socket.userId} joining session ${data.sessionId}`);

// 				// TODO: Implement session join logic in next task
// 				socket.emit("error", {
// 					code: "NOT_IMPLEMENTED",
// 					message: "Session join functionality not yet implemented",
// 					recoverable: true,
// 				});
// 			} catch (error) {
// 				console.error("Error joining session:", error);
// 				socket.emit("error", {
// 					code: "JOIN_SESSION_ERROR",
// 					message: "Failed to join session",
// 					details: error instanceof Error ? error.message : "Unknown error",
// 					recoverable: true,
// 				});
// 			}
// 		});

// 		// Submit answer event
// 		socket.on("submitAnswer", async (data) => {
// 			try {
// 				console.log(
// 					`User ${socket.userId} submitting answer for question ${data.questionId}`
// 				);

// 				// TODO: Implement answer submission logic in next task
// 				socket.emit("error", {
// 					code: "NOT_IMPLEMENTED",
// 					message: "Answer submission functionality not yet implemented",
// 					recoverable: true,
// 				});
// 			} catch (error) {
// 				console.error("Error submitting answer:", error);
// 				socket.emit("error", {
// 					code: "SUBMIT_ANSWER_ERROR",
// 					message: "Failed to submit answer",
// 					details: error instanceof Error ? error.message : "Unknown error",
// 					recoverable: true,
// 				});
// 			}
// 		});

// 		// Reconnect session event
// 		socket.on("reconnectSession", async (data) => {
// 			try {
// 				console.log(
// 					`User ${socket.userId} reconnecting to session ${data.sessionId}`
// 				);

// 				// TODO: Implement session reconnection logic in next task
// 				socket.emit("error", {
// 					code: "NOT_IMPLEMENTED",
// 					message: "Session reconnection functionality not yet implemented",
// 					recoverable: true,
// 				});
// 			} catch (error) {
// 				console.error("Error reconnecting to session:", error);
// 				socket.emit("error", {
// 					code: "RECONNECT_ERROR",
// 					message: "Failed to reconnect to session",
// 					details: error instanceof Error ? error.message : "Unknown error",
// 					recoverable: true,
// 				});
// 			}
// 		});
// 	}

// 	private async handleDisconnection(socket: AuthenticatedSocket) {
// 		try {
// 			// Clean up connection mapping
// 			await redisClient.deleteConnectionMapping(socket.id);

// 			// TODO: Handle session cleanup if needed
// 			console.log(`Cleaned up connection mapping for socket ${socket.id}`);
// 		} catch (error) {
// 			console.error("Error handling disconnection:", error);
// 		}
// 	}

// 	getIO(): SocketIOServer<ClientEvents, ServerEvents> {
// 		return this.io;
// 	}
// }

// export default WebSocketServer;
// export type {
// 	ClientEvents,
// 	ServerEvents,
// 	SessionCreatedData,
// 	QuestionData,
// 	AnswerResultData,
// 	SessionResultData,
// 	ErrorData,
// };

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "@/config/env";

const startQuiz = async (quizId: string) => {
	if (!quizId) return;

	console.log("Starting quiz");
	console.log(quizId);

	// Look for the Quiz in the DATABASE OR REDIS
};

const createWebSocketServer = (httpServer: HttpServer) => {
	const io = new SocketIOServer(httpServer, {
		cors: {
			origin: env.frontendUrl,
			methods: ["GET", "POST"],
			credentials: true,
		},
		transports: ["websocket", "polling"],
	});

	io.on("connection", (socket) => {
		socket.on("message", (msg) => {
			try {
				console.log(msg);
				console.log(typeof msg);
				if (!msg.type) return;

				switch (msg.type) {
					case "startQuiz":
						startQuiz(msg.id);
				}
			} catch (err) {
				console.log(err);
				console.log("An error OCCURED");
				socket.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
			}
		});
		socket.on("disconnect", () => {
			console.log("user disconnected");
		});
	});
	return io;
};

export { createWebSocketServer };
