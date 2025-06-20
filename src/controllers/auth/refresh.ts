import { AppError } from "@/errors";
import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import { verifyJWT } from "@/utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";

// Environment variable validation
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
	throw new AppError(
		"Server misconfiguration: missing environment variables.",
		500
	);
}

export const refresh = AsyncErrorHandler(async (req, res, next) => {
	const rawRefreshToken = req.cookies["_rt"];

	if (!rawRefreshToken) {
		throw new AppError("Refresh token missing. Please log in again.", 401);
	}

	const payload = verifyJWT(rawRefreshToken, refreshSecret) as {
		id: string;
		iat: number;
		exp: number;
	};

	const user = await prisma.user.findFirst({ where: { id: payload.id } });

	if (!user) {
		throw new AppError("User associated with token not found.", 401);
	}

	const validTokens = await prisma.refreshToken.findMany({
		where: {
			userId: payload.id,
			expiresAt: { gt: new Date() },
			revoked: false,
		},
		orderBy: { createdAt: "desc" },
	});

	let activeToken = null;
	for (const token of validTokens) {
		const isMatch = await bcrypt.compare(rawRefreshToken, token.value);
		if (isMatch) {
			activeToken = token;
			break;
		}
	}

	if (!activeToken) {
		throw new AppError(
			"Refresh token is invalid or has already been used.",
			401
		);
	}

	// Token rotation
	const newAccessToken = jwt.sign({ id: activeToken.userId }, accessSecret, {
		expiresIn: accessExpiresIn,
	});

	const newRefreshToken = jwt.sign({ id: activeToken.userId }, refreshSecret, {
		expiresIn: refreshTokenExpiresIn,
	});

	const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 12);

	await prisma.refreshToken.create({
		data: {
			userId: activeToken.userId,
			value: hashedNewRefreshToken,
			expiresAt: new Date(Date.now() + ms(refreshTokenExpiresIn)),
		},
	});

	await prisma.refreshToken.update({
		where: { id: activeToken.id },
		data: { revoked: true },
	});

	res.cookie("_rt", newRefreshToken, {
		httpOnly: true,
		secure: environment === "production",
		sameSite: "strict",
		path: "/",
		maxAge: ms(refreshTokenExpiresIn),
	});

	res.status(200).json({
		status: "success",
		data: { accessToken: newAccessToken },
	});
});
