import { Router } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { loginValidator, signupValidator } from "../validators/AuthValidators";
import {
	loggedIn,
	login,
	protect,
	signup,
} from "../controllers/AuthController";
import passport from "passport";

const router = Router();

// Configuration for Google OAuth
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID + "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET + "",
			callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, callback) {
			// TODO Implement Find or Create User in AuthController.ts
			return callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, "sjj");
});

// When a person clicks on the google button, this route is called
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile"],
		successFlash: "Logged in successfully",
	}),
	(req, res) => {
		console.log("redirecting to google callback");
		res.json({
			message: "Redirecting to google callback",
		});
	}
);

// This route is called when the user is redirected back from google
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		console.log("query", req.query);
		console.log("params", req.params);

		res.status(200).json({
			message: "Logged Inn",
		});
		res.redirect("http://localhost:5173");
	}
);
router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.get("/check", protect, loggedIn);

export default router;
