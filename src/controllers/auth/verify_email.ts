import { AsyncErrorHandler } from "@/middlewares";

import crypto from "node:crypto";

console.log(parseInt(crypto.randomBytes(3).toString("hex"), 16));
const verifyEmail = AsyncErrorHandler(async function (req, res, next) {
	// Get the users email,
	// generate a  random 6 digit code or provide a link (What is the better UX)
	// hash and save the code in database? (or suggest the best way to do it)
	// Confirm code
	// SWucessfully verified
});

export { verifyEmail };
