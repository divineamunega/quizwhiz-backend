import { Router } from "express";
import { loginValidator, signupValidator } from "../validators/AuthValidators";
import {
	loggedIn,
	login,
	protect,
	signup,
} from "../controllers/AuthController";
import passport from "passport";

const router = Router();

// When a person clicks on the google button, this route is called
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
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
		res.redirect(process.env.GOOGLE_REDIRECT_URI + "");
	}
);
router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.get("/check", protect, loggedIn);

export default router;
