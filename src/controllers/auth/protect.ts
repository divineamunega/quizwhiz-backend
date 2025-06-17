import { AppError } from "@/errors";
import { prisma } from "@/lib";
import { AsyncErrorHandler } from "@/middlewares";
import { verifyJWT } from "@/utils";

const accessSecret = process.env.ACCESS_TOKEN_SECRET;
if (!accessSecret) {
	throw new AppError("Missing ACCESS_TOKEN_SECRET environment variable.", 500);
}

const protect = AsyncErrorHandler(async function (req, res, next) {
	const authHeader = req.headers["authorization"];
	if (!authHeader?.startsWith("Bearer ")) {
		return next(
			new AppError("Authorization header missing or malformed.", 401)
		);
	}

	const accessToken = authHeader.split(" ")[1];
	const payload = verifyJWT(accessToken, accessSecret) as {
		id: string;
		iat: number;
		exp: number;
	};

	const user = await prisma.user.findUnique({ where: { id: payload.id } });
	if (!user) {
		return next(new AppError("User associated with token not found.", 404));
	}

	req.user = user;
	next();
});

export { protect };
