import { createClient } from "redis";
import { env } from "@/config/env";

class RedisClient {
	private client: ReturnType<typeof createClient>;
	private isConnected: boolean = false;

	constructor() {
		this.client = createClient({
			url: env.redisUrl,
			socket: {
				reconnectStrategy: (retries) => {
					// Exponential backoff with max delay of 30 seconds
					const delay = Math.min(retries * 50, 30000);
					console.log(
						`Redis reconnection attempt ${retries}, waiting ${delay}ms`
					);
					return delay;
				},
			},
		});

		this.setupEventHandlers();
	}

	private setupEventHandlers() {
		this.client.on("connect", () => {
			console.log("Redis client connected");
		});

		this.client.on("ready", () => {
			console.log("Redis client ready");
			this.isConnected = true;
		});

		this.client.on("error", (err) => {
			console.error("Redis client error:", err);
			this.isConnected = false;
		});

		this.client.on("end", () => {
			console.log("Redis client disconnected");
			this.isConnected = false;
		});
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
		} catch (error) {
			console.error("Failed to connect to Redis:", error);
			console.warn("Redis is not available. Session features will be limited.");
			// Don't throw error in development to allow server to start without Redis
			if (env.nodeEnv === "production") {
				throw error;
			}
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.destroy();
			this.isConnected = false;
		} catch (error) {
			console.error("Failed to disconnect from Redis:", error);
			throw error;
		}
	}

	getClient() {
		if (!this.isConnected) {
			console.warn("Redis client is not connected, operations will be skipped");
			return null;
		}
		return this.client;
	}

	isReady(): boolean {
		return this.isConnected;
	}

	// Session management methods
	async setSessionData(
		sessionId: string,
		data: any,
		ttlSeconds: number = 7200
	): Promise<void> {
		if (!this.isConnected) {
			console.warn("Redis not connected, skipping session data storage");
			return;
		}
		try {
			const key = `quiz_session:${sessionId}`;
			await this.client.setEx(key, ttlSeconds, JSON.stringify(data));
		} catch (error) {
			console.error("Error setting session data:", error);
		}
	}

	async getSessionData(sessionId: string): Promise<any | null> {
		if (!this.isConnected) {
			console.warn("Redis not connected, returning null for session data");
			return null;
		}
		try {
			const key = `quiz_session:${sessionId}`;
			const data = await this.client.get(key);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error("Error getting session data:", error);
			return null;
		}
	}

	async deleteSessionData(sessionId: string): Promise<void> {
		if (!this.isConnected) {
			console.warn("Redis not connected, skipping session data deletion");
			return;
		}
		try {
			const key = `quiz_session:${sessionId}`;
			await this.client.del(key);
		} catch (error) {
			console.error("Error deleting session data:", error);
		}
	}

	// Connection mapping methods
	async setConnectionMapping(
		socketId: string,
		data: any,
		ttlSeconds: number = 14400
	): Promise<void> {
		if (!this.isConnected) {
			console.warn("Redis not connected, skipping connection mapping storage");
			return;
		}
		try {
			const key = `connection:${socketId}`;
			await this.client.setEx(key, ttlSeconds, JSON.stringify(data));
		} catch (error) {
			console.error("Error setting connection mapping:", error);
		}
	}

	async getConnectionMapping(socketId: string): Promise<any | null> {
		if (!this.isConnected) {
			console.warn(
				"Redis not connected, returning null for connection mapping"
			);
			return null;
		}
		try {
			const key = `connection:${socketId}`;
			const data = await this.client.get(key);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error("Error getting connection mapping:", error);
			return null;
		}
	}

	async deleteConnectionMapping(socketId: string): Promise<void> {
		if (!this.isConnected) {
			console.warn("Redis not connected, skipping connection mapping deletion");
			return;
		}
		try {
			const key = `connection:${socketId}`;
			await this.client.del(key);
		} catch (error) {
			console.error("Error deleting connection mapping:", error);
		}
	}

	// Answer history methods
	async addAnswerHistory(
		sessionId: string,
		participantId: string,
		answerData: any
	): Promise<void> {
		if (!this.isConnected) {
			console.warn("Redis not connected, skipping answer history storage");
			return;
		}
		try {
			const key = `answers:${sessionId}:${participantId}`;
			await this.client.rPush(key, JSON.stringify(answerData));
			await this.client.expire(key, 7200); // 2 hours TTL
		} catch (error) {
			console.error("Error adding answer history:", error);
		}
	}

	async getAnswerHistory(
		sessionId: string,
		participantId: string
	): Promise<any[]> {
		if (!this.isConnected) {
			console.warn("Redis not connected, returning empty answer history");
			return [];
		}
		try {
			const key = `answers:${sessionId}:${participantId}`;
			const answers = await this.client.lRange(key, 0, -1);
			return answers.map((answer) => JSON.parse(answer));
		} catch (error) {
			console.error("Error getting answer history:", error);
			return [];
		}
	}

	async deleteAnswerHistory(
		sessionId: string,
		participantId: string
	): Promise<void> {
		if (!this.isConnected) {
			console.warn("Redis not connected, skipping answer history deletion");
			return;
		}
		try {
			const key = `answers:${sessionId}:${participantId}`;
			await this.client.del(key);
		} catch (error) {
			console.error("Error deleting answer history:", error);
		}
	}

	async setQuizData(quizId: string, data: any): Promise<"OK" | null> {
		if (!this.isConnected) {
			console.warn("Redis not connected, skipping quiz data storage");
			return null;
		}
		try {
			const key = `quiz:${quizId}`;
			// TODO Random TTL number to be changed to class variables just lazy now
			await this.client.setEx(key, 60 * 60 * 0.5, JSON.stringify(data));
			return "OK";
		} catch (error) {
			console.error("Error setting quiz data: ON REDIS", error);
			return null;
		}
	}

	async getQuizData(quizId: string): Promise<any | null> {
		if (!this.isConnected) {
			console.warn("Redis not connected, returning null for quiz data");
			return null;
		}
		try {
			const key = `quiz:${quizId}`;
			const data = await this.client.get(key);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error("Error getting quiz data:", error);
			return null;
		}
	}
}

// Create singleton instance
const redisClient = new RedisClient();

export default redisClient;
