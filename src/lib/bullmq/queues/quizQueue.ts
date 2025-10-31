import { Queue } from "bullmq";

const quizQueue = new Queue("quiz", {
	connection: {
		url: process.env.REDIS_URL || "redis://localhost:6379",
	},
});

export { quizQueue };
