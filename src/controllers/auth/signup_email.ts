import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { AsyncErrorHandler } from "@/middlewares";
import { prisma } from "@/lib";
import { sendVerificationCode } from "@/services";
import { createRefresh } from "@/utils/createRefresh";
import { sendRefreshCookie } from "@/utils/sendRefreshCookie";
import { env } from "@/config/env";

export const signup = AsyncErrorHandler(async (req, res) => {
	// Extract name, email, and password from the validated request data
	const { name, email, password } = req.data;

	// Hash the password with a salt of 12 rounds
	const hashedPassword = await bycrypt.hash(password, 10);

	// Create a new user in the database with the hashed password
	const newUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	// Create Access token
	const accessToken = jwt.sign({ id: newUser.id }, env.accessTokenSecret, {
		expiresIn: env.accessExpiresIn as StringValue,
	});

	const [refreshToken, hashedRefreshToken] = createRefresh();

	// TODO Use Prisma transactions
	await prisma.refreshToken.create({
		data: {
			expiresAt: new Date(
				Date.now() + ms(env.refreshTokenExpiresIn as StringValue)
			),
			value: hashedRefreshToken,
			userId: newUser.id,
		},
	});

	// Send refresh token as http-only cookie
	sendRefreshCookie(res, refreshToken);

	void sendVerificationCode(newUser);

	// Send response
	res.status(201).json({
		message: "success",
		accessToken: accessToken,

		user: {
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			avatar: newUser.avatar ? newUser.avatar : undefined,
		},
	});
});
