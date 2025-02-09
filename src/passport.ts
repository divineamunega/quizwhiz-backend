import passport from "passport";
import GoogleStrategy from "./controllers/auth/GooglePassport";

passport.use(GoogleStrategy);

// This is called when authentication is successful. Before it, the userId is saved in a cookie and the session is created and linked to the user saved in the cookie
passport.serializeUser((user, done) => {
	done(null, user);
});

// This is called on subsequent requests when the browser sends a cookie with the userId
passport.deserializeUser((user: any, done) => {
	done(null, user);
});

export default passport;
