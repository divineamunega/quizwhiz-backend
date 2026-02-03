import { Response } from "express";
import ms, { StringValue } from "ms";
import { env } from "@/config/env";

export const sendRefreshCookie = function (res: Response, token: string) {
	// Send refresh token as http-only cookie
	res.cookie("_rt", token, {
		maxAge: ms(env.refreshTokenExpiresIn as StringValue),
		httpOnly: true,
		sameSite: "lax",
		secure: true,
		path: "/",
		domain: "",
	});
};
