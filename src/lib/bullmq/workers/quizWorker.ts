import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import redisClient from "@/lib/redis";
const worker = new Worker(
	"quiz",
	async (job) => {
		if (job.name === "save-quiz") {
			const id = job.data.quizId;

			if (!id) return;
			const quizData = await prisma.quiz.findUnique({
				where: {
					id: job.data.quizId,
				},
				include: {
					questions: {
						include: {
							answers: true,
						},
					},
				},
			});

			await redisClient.setQuizData(job.data.quizId, quizData);
		}
	},
	{
		connection: {
			url: process.env.REDIS_URL || "redis://localhost:6379",
		},
	}
);

export { worker };
