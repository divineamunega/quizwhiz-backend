import { AppError } from "@/errors";
import { Resend } from "resend";

const resendApi = process.env.RESEND_API_KEY;
const enviroment = process.env.NODE_ENV;
const resendDomain = process.env.RESEND_DOMAIN;

if (!resendApi || !enviroment) {
	throw new AppError("Invalid Enviroment", 500);
}

if (enviroment === "production" && !resendDomain) {
	throw new AppError("Invalid Enviroment", 500);
}

const resend = new Resend(resendApi);

type SendEmailParams = {
	to: string;
	subject: string;
	html: string;
};

export const sendEmail = async function ({
	to,
	subject,
	html,
}: SendEmailParams) {
	const from = resendDomain || "onboarding@resend.dev";

	const result = await resend.emails.send({ from, to, html, subject });

	if (result.error) {
		console.log(result);
		console.log("Error while sending email");
	}
};
