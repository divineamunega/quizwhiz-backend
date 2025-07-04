import { AsyncErrorHandler } from "@/middlewares";
import { sendVerificationCode } from "@/services";

export const resendVerification = AsyncErrorHandler(async function (req, res) {
	const user = req.user;

	await sendVerificationCode(user!);

	res.status(200).json({ message: "Verification Code Sent successfully" });
});
