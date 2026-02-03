import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import redisClient from "@/lib/redis";
import { env } from "@/config/env";
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
			url: env.redisUrl,
		},
	}
);

export { worker };
