import bycrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { AsyncErrorHandler } from "@/middlewares";
import { prisma, renderVerifyCodeTemplate, sendEmail } from "@/lib";
import { AppError } from "@/errors";

const environment = process.env.NODE_ENV;
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const accessExpiresIn = process.env.ACCESS_EXPIRES_IN;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiresIn = process.env
	.REFRESH_TOKEN_EXPIRES_IN as StringValue;

if (
	!accessSecret ||
	!accessExpiresIn ||
	!refreshSecret ||
	!refreshTokenExpiresIn ||
	!environment
) {
	throw new AppError("Invalid enviroment variables", 500);
}

export const signup = AsyncErrorHandler(async (req, res) => {
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

	// Create Access token
	const accessToken = jwt.sign({ id: newUser.id }, accessSecret, {
		expiresIn: accessExpiresIn,
	});

	// Create Refresh token
	const refreshToken = jwt.sign({ id: newUser.id }, refreshSecret, {
		expiresIn: refreshTokenExpiresIn,
	});

	// hash refresh tokem
	const hashedRefreshToken = await bycrypt.hash(refreshToken, 12);

	// TODO Use Prisma transactions
	await prisma.refreshToken.create({
		data: {
			expiresAt: new Date(Date.now() + ms(refreshTokenExpiresIn)),
			value: hashedRefreshToken,
			userId: newUser.id,
		},
	});

	// Send refresh token as http-only cookie
	res.cookie("_rt", refreshToken, {
		maxAge: ms(refreshTokenExpiresIn),
		httpOnly: true,
		sameSite: "strict",
		secure: environment === "production",
		path: "/",
	});

	// Send Random 6 digit code
	const randomCode = crypto.randomBytes(3).toString("hex");
	const hashedCode = await bycrypt.hash(randomCode, 12);

	// Todo create a webhook or dont use await  for it

	await prisma.verificationCode.create({
		data: {
			hashedCode,
			userId: newUser.id,
			expiresAt: new Date(Date.now() + ms("10m")),
			type: "EMAIL",
		},
	});

	console.log("sending email");

	await sendEmail({
		to: newUser.email,
		subject: "Verification Code",
		html: renderVerifyCodeTemplate(randomCode, newUser.name),
	});
	console.log("sent email");

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
