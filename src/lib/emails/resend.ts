import { AppError } from "@/errors";
import { Resend } from "resend";

const resendApi = process.env.RESEND_API_KEY;
const env = process.env.NODE_ENV;
const resendDomain = process.env.RESEND_DOMAIN;

if (!resendApi || !env) {
	throw new AppError("Invalid environment", 500);
}

if (env === "production" && !resendDomain) {
	throw new AppError("Missing production domain", 500);
}

const resend = new Resend(resendApi);

type SendEmailParams = {
	to: string;
	subject: string;
	html: string;
	throwError?: boolean;
};

export const sendEmail = async ({
	to,
	subject,
	html,
	throwError = false,
}: SendEmailParams): Promise<boolean> => {
	const from = resendDomain || "onboarding@resend.dev";

	const result = await resend.emails.send({ from, to, html, subject });

	if (result.error) {
		console.error("Resend error:", result.error);

		if (throwError) {
			throw new AppError("Error occurred while sending email", 400);
		}

		return false;
	}

	return true;
};
