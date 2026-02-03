import { AppError } from "@/errors";
import { Resend } from "resend";
import { env } from "@/config/env";

const resend = new Resend(env.resendApiKey);

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
	const from = env.resendDomain || "onboarding@resend.dev";

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
