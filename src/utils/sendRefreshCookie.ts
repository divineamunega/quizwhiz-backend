import { AppError } from "@/errors";
import { Response } from "express";
import ms, { StringValue } from "ms";

const refreshTokenExpiresIn = process.env
	.REFRESH_TOKEN_EXPIRES_IN as StringValue;

if (!refreshTokenExpiresIn) {
	throw new AppError("Invalid enviroment variables", 500);
}

export const sendRefreshCookie = function (res: Response, token: string) {
	// Send refresh token as http-only cookie
	res.cookie("_rt", token, {
		maxAge: ms(refreshTokenExpiresIn),
		httpOnly: true,
		sameSite: "lax",
		secure: true,
		path: "/",
		domain: "",
	});
};
