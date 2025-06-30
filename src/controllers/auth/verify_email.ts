import { isAfter } from "date-fns";
import { AppError } from "@/errors";
import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import { compare } from "bcryptjs";

const verifyEmail = AsyncErrorHandler(async function (req, res, next) {
	const userId = req.user?.id;

	const emailVerified = req.user?.emailVerified;

	if (emailVerified) throw new AppError("Email Already verified", 409);

	const code = (req.query["code"] as string).trim();

	if (!userId || !code) {
		// 400 Bad Request – missing required input
		throw new AppError("Missing user ID or verification code.", 400);
	}

	const verifyCode = await prisma.verificationCode.findFirst({
		where: { userId, isUsed: false, type: "EMAIL" },
		orderBy: { createdAt: "desc" },
	});

	if (!verifyCode) {
		// 404 Not Found – no active verification code exists
		throw new AppError(
			"No active verification code found. Please request a new one.",
			404
		);
	}

	if (isAfter(new Date(), verifyCode.expiresAt)) {
		// 410 Gone – resource existed but is no longer valid
		throw new AppError(
			"This verification code has expired. Please request a new one.",
			410
		);
	}

	const isCorrect = await compare(code, verifyCode.hashedCode);

	if (!isCorrect) {
		// 401 Unauthorized – invalid or failed authentication
		throw new AppError(
			"Invalid verification code. Please check the code and try again.",
			401
		);
	}

	await prisma.verificationCode.update({
		where: { id: verifyCode.id },
		data: { isUsed: true },
	});

	await prisma.user.update({
		where: { id: userId },
		data: { emailVerified: true },
	});

	res.status(200).json({
		status: "success",
		message: `User ${userId} email verified successfully.`,
	});
});

export { verifyEmail };
