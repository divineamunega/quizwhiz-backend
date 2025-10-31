import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { verifyJWT } from "@/utils";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedSocket extends Socket {
	userId?: string;
	user?: {
		id: string;
		email: string;
	};
}

interface DecodedToken extends JwtPayload {
	id: string;
	email?: string;
}

export const socketAuthMiddleware = (
	socket: AuthenticatedSocket,
	next: (err?: ExtendedError) => void
) => {
	try {
		// Get token from handshake auth or query
		const token = socket.handshake.auth?.token || socket.handshake.query?.token;

		if (!token) {
			return next(new Error("Authentication token required"));
		}

		// Get the access token secret from environment
		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
		if (!accessTokenSecret) {
			return next(new Error("Server configuration error"));
		}

		// Verify JWT token
		const decoded = verifyJWT(
			token as string,
			accessTokenSecret
		) as DecodedToken;

		if (!decoded || typeof decoded === "string" || !decoded.id) {
			return next(new Error("Invalid authentication token"));
		}

		// Attach user info to socket
		socket.userId = decoded.id;
		socket.user = {
			id: decoded.id,
			email: decoded.email || "",
		};

		next();
	} catch (error) {
		console.error("Socket authentication error:", error);
		next(new Error("Authentication failed"));
	}
};

export type { AuthenticatedSocket };
