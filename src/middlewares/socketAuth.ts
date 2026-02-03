import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { verifyJWT } from "@/utils";
import { JwtPayload } from "jsonwebtoken";
import { env } from "@/config/env";

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
		// Verify JWT token
		const decoded = verifyJWT(
			token as string,
			env.accessTokenSecret
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
