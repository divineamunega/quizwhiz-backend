import { AppError } from "@/errors";
import jwt, { JwtPayload } from "jsonwebtoken";

function verifyJWT(token: string, secret: string): string | JwtPayload {
	try {
		return jwt.verify(token, secret);
	} catch (err) {
		const message =
			process.env.NODE_ENV === "development"
				? `JWT verification failed: ${(err as Error).message}`
				: "Authentication token is invalid or has expired.";
		throw new AppError(message, 401); // 401: Unauthorized (auth failure)
	}
}

export { verifyJWT };
