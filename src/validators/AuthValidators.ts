import { body } from "express-validator";

const signupValidator = () => [
	body("name").exists().withMessage("A user must have a name."),
	body("email")
		.exists()
		.withMessage("A user must have an email")
		.isEmail()
		.withMessage("Please provide an email"),
	body("password")
		.exists()
		.withMessage("Please provide a password")
		.isLength({ min: 8 })
		.withMessage("Your password must be greater than 8 characters"),
];

export { signupValidator };
