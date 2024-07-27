import { Response, Request, NextFunction } from "express";
import prisma from "../prisma";

// JUst testing randome stuff
const createQuiz = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const testUser = await prisma.user.create({
			data: {
				name: "Divine",
				email: "blahb;a",
				password: "KoinKon",
			},
		});
		const quiz = await prisma.quiz.create({
			data: {
				name: "Name",
				description: "A quiz to ask people",
				status: "IDLE",
				creator: { connect: { id: testUser.id } },
			},
		});

		res.status(200).json({
			data: [testUser, quiz],
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			err,
		});
	}
};

export { createQuiz };
