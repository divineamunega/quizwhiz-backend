import crypto from "node:crypto";
import { hashToken } from "./hashToken";

export const createRefresh = function () {
	// Create Refresh token
	const refreshToken = "quizwhizz_rt" + crypto.randomBytes(32).toString("hex");

	// hash refresh tokem
	const hashedRefreshToken = hashToken(refreshToken);

	return [refreshToken, hashedRefreshToken];
};
