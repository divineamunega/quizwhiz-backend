import { Strategy } from "passport-google-oauth20";
import { verifyGoogle } from "../AuthController";

const GoogleStrategy = new Strategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID + "",
		clientSecret: process.env.GOOGLE_CLIENT_SECRET + "",
		callbackURL: process.env.GOOGLE_CALLBACK_URL + "",
	},
	verifyGoogle
);

export default GoogleStrategy;
