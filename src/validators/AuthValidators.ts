import { NextFunction, Request, Response } from "express";
import { body, matchedData, validationResult } from "express-validator";
import AppError from "../errors/AppError";

// Extend the Request interface to include a 'data' property
declare module "express-serve-static-core" {
	interface Request {
		data?: any;
	}
}

/**
 * Middleware to handle validation errors and extract validated data.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
const handleData = (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Pass validation errors to the next middleware (error handler)
		return next(
			new AppError("Validation Error", 400, errors.array(), "express_validator")
		);
	}

	// Attach validated data to the request object
	req.data = matchedData(req);
	next();
};

/**
 * Validation chain for user signup.
 *
 * Validates the presence and format of 'name', 'email', and 'password' fields.
 *
 * @returns Array of validation chains and the handleData middleware
 */
const signupValidator = () => [
	body("name")
		.exists()
		.withMessage("A user must have a name")
		.trim()
		.notEmpty()
		.withMessage("Name cannot be empty"),
	body("email")
		.exists()
		.withMessage("A user must have an email")
		.trim()
		.isEmail()
		.withMessage("Please provide a valid email"),
	body("password")
		.exists()
		.withMessage("Please provide a password")
		.isLength({ min: 8 })
		.withMessage("Your password must be at least 8 characters long"),
	handleData,
];

const handleLoginData = function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Pass validation errors to the next middleware (error handler)
		return next(new AppError("Authentication Error", 400, null, "login_error"));
	}

	// Attach validated data to the request object
	req.data = matchedData(req);
	next();
};
const loginValidator = () => [
	body("password").isLength({ min: 8 }),
	body("email").trim().isEmail(),
	handleLoginData,
];

export { signupValidator, loginValidator };
