import bycrypt from "bcryptjs";
import prisma from "../prisma";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";
import { signToken } from "../utils/jwt";

const signup = AsyncErrorHandler(async (req, res, next) => {
	const { name, email, password } = req.data;

	// Hash the passwords here
	const hashedPassword = await bycrypt.hash(password, 12);

	// Create new user in the database
	const newUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	// Sign A Json Web Token
	const token = signToken(newUser.id);

	// Send back user data + JWT to client
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

const login = AsyncErrorHandler(async (req, res, next) => {});

const protect = AsyncErrorHandler(async (req, res, next) => {});

export { signup, login, protect };
