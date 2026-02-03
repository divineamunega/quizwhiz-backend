import { Queue } from "bullmq";
import { env } from "@/config/env";

const quizQueue = new Queue("quiz", {
	connection: {
		url: env.redisUrl,
	},
});

export { quizQueue };
