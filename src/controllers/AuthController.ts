import bycrypt from "bcryptjs";
import prisma from "../prisma";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";
import { signToken } from "../utils/jwt";
import AppError from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";
import { CookieOptions, Response } from "express";

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

	createSendToken(newUser, 201, res);
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

	// Generate a JSON Web Token for the user as a http only cookie
	createSendToken(user, 200, res);
});

const protect = AsyncErrorHandler(async (req, res, next) => {
	// Get token from header
	// const token = req.headers.authorization?.split(" ")[1];

	// Get cookie from cookie
	const token = req.cookies.jwt;
	console.log(req.cookies.jwt);

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

	// Find User and throw error if no user found
	const user = await prisma.user.findFirst({ where: { id: decoded.id } });
	if (!user) {
		throw new AppError(
			"The user associated with token does not exist.",
			401,
			null,
			"invalid_token"
		);
	}

	// Assign the user to a user property on the req object
	const capitalizedName = user.name[0].toUpperCase() + user.name.slice(1);
	req.user = user;
	req.user.name = capitalizedName;

	// Free to pass on to the protected resource
	next();
});

// TODO LATERRRR

const createSendToken = (user: User, statusCode: number, res: Response) => {
	// Create Signed JWT token
	const token = signToken(user.id);

	// Create an http only cookie to be sent after successfull signin
	const cookieOptions = {
		expires: new Date(
			Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: process.env.ENVIROMENT === "development", // Cookie will be sent only over HTTPS
		sameSite: "none", // Necessary for cross-domain cookies
	} as CookieOptions;

	res.cookie("jwt", token, cookieOptions);

	res.status(statusCode).json({
		status: "success",
		data: {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		},
	});
};

const loggedIn = AsyncErrorHandler(async (req, res) => {
	res
		.status(200)
		.json({ status: "success", message: "Hello You are logged in" });
});

export { signup, login, protect, loggedIn };
