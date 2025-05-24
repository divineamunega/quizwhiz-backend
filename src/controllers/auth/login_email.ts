import bycrypt from "bcryptjs";

import { prisma } from "@/lib";
import { AppError } from "@/errors";
import { AsyncErrorHandler } from "@/middlewares";

export const login = AsyncErrorHandler(async (req, res, next) => {
	// Extract email and password from the validated request data
	const { email, password } = req.data;

	// Find the user by email in the database
	const user = await prisma.user.findFirst({ where: { email } });

	// If user does not exist, throw an authentication error
	if (!user) {
		// deleteCookie(res);
		throw new AppError("Authentication Error", 401, null, "login_error");
	}

	// Check if the provided password matches the stored hashed password
	const isCorrect = await bycrypt.compare(password, user.password ?? "");

	console.log(isCorrect);
	// If password is incorrect, throw an authentication error
	if (!isCorrect) {
		// deleteCookie(res);
		throw new AppError("Authentication Error", 401, null, "login_error");
	}

	// Generate a JSON Web Token for the user as a http only cookie
	// createSendToken(user, 200, res);

	// TODO Work on a way to auth
	res.status(200).json({ message: "success" });
});
