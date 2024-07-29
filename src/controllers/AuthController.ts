import bycrypt from "bcryptjs";
import prisma from "../prisma";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";
import { signToken } from "../utils/jwt";
import AppError from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";

// Signup function
const signup = AsyncErrorHandler(async (req, res, next) => {
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

	// Generate a JSON Web Token for the new user
	const token = signToken(newUser.id);

	// Send back the user data and JWT to the client
	res.status(201).json({
		status: "success",
		data: {
			token,
			user: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
			},
		},
	});
});

// Login function
const login = AsyncErrorHandler(async (req, res, next) => {
	// Extract email and password from the validated request data
	const { email, password } = req.data;

	// Find the user by email in the database
	const user = await prisma.user.findFirst({ where: { email } });

	// If user does not exist, throw an authentication error
	if (!user) {
		throw new AppError("Authentication Error", 401, null, "login_error");
	}

	// Check if the provided password matches the stored hashed password
	const isCorrect = await bycrypt.compare(password, user!.password);

	// If password is incorrect, throw an authentication error
	if (!isCorrect) {
		throw new AppError("Authentication Error", 401, null, "login_error");
	}

	// Generate a JSON Web Token for the user
	const token = signToken(user.id);

	// Send back the user data and JWT to the client
	res.status(200).json({
		status: "success",
		data: {
			token,
			user: {
				id: user!.id,
				name: user!.name,
				email: user!.email,
			},
		},
	});
});

const protect = AsyncErrorHandler(async (req, res, next) => {
	// Get token from header
	const token = req.headers.authorization?.split(" ")[1];
	if (!token)
		throw new AppError(
			"Your token is invalid. Please login again to get another token.",
			401,
			null,
			"invalid_token"
		);

	// Decode JWT token
	const decoded = jwt.verify(
		token,
		process.env.JWT_SECRET!
	) as unknown as JwtPayload;

	const user = await prisma.user.findFirst({ where: { id: decoded.id } });

	if (!user) {
		throw new AppError(
			"The user associated with token does not exist.",
			401,
			null,
			"invalid_token"
		);
	}

	res.json({
		decoded,
	});
});

export { signup, login, protect };
