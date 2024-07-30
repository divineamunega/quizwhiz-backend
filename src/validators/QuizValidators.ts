import { body } from "express-validator";
import { handleData } from "./handleRequestBody";

const createQuizValidator = function () {
	return [
		body("name").exists().withMessage("A quiz must have a name"),
		body("description").exists().withMessage("A quiz must have a description"),
		handleData,
	];
};

export { createQuizValidator };
