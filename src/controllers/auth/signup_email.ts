import bycrypt from "bcryptjs";

import { AsyncErrorHandler } from "@/middlewares";
import { prisma } from "@/lib";

export const signup = AsyncErrorHandler(async (req, res, next) => {
	// Extract name, email, and password from the validated request data
	const { name, email, password } = req.data;

	// Hash the password with a salt of 12 rounds
	const hashedPassword = await bycrypt.hash(password, 12);

	// Create a new user in the database with the hashed password
	const newUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	// TODO Work on a way to auth
	res.status(200).json({ message: "success", user: newUser });
});
