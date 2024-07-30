import { body } from "express-validator";
import { handleData } from "./handleRequestBody";

const createQuizValidator = function () {
	return [
		body("name").exists().withMessage("A quiz must have a name"),
		body("description").exists().withMessage("A quiz must have a description"),
		handleData,
	];
};

const createQuestionValidator = function () {
	return [
		body("question")
			.exists()
			.withMessage("A question must have a question field"),
		body("answers")
			.exists()
			.withMessage("Each question must have an answer field")
			.isArray({ min: 2 })
			.bail()
			.withMessage("Every question must have at least 2 answers")
			.custom((value, { req }) => {
				console.log(req.body);
				return Boolean(
					req.body.answers?.some((obj: any) => {
						return obj.isCorrect === true;
					})
				);
			})
			.withMessage("A question must have at least one correct answer"),

		body("answers.*.isCorrect")
			.exists()
			.withMessage("Every answer must have an isCorrect field ")
			.bail()
			.isBoolean()
			.withMessage("iscorrect must be a boolean"),

		body("answers.*.answer")
			.exists()
			.withMessage("Every answer object must have an answer field")
			.bail(),

		handleData,
	];
};

export { createQuizValidator, createQuestionValidator };
