import { body } from "express-validator";
import { handleData } from "@/middlewares";

const createQuizValidator = function () {
	return [
		body("title").exists().notEmpty().withMessage("A quiz must have a title"),
		body("description")
			.exists()
			.notEmpty()
			.withMessage("A quiz must have a description"),

		body("tags")
			.optional()
			.isArray()
			.withMessage("Tags must be an array")
			.custom((tags: any[]) =>
				tags.every((tag) => typeof tag === "string" && tag.trim().length > 0)
			)
			.withMessage("Each tag must be a non-empty string"),

		handleData,
	];
};

const addQuestionValidator = () => [
	body("text").exists().withMessage("A question must have a text field"),

	body("answers")
		.isArray({ min: 2 })
		.withMessage("Every question must have at least 2 answers")
		.custom(
			(answers) =>
				Array.isArray(answers) && answers.some((a) => a.isCorrect === true)
		)
		.withMessage("A question must have at least one correct answer"),

	body("answers.*.isCorrect")
		.isBoolean()
		.withMessage("isCorrect must be a boolean"),

	body("answers.*.text")
		.notEmpty()
		.withMessage("Each answer must have a text field"),

	handleData,
];

export { createQuizValidator, addQuestionValidator };
