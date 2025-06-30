import { prisma, renderVerifyCodeTemplate, sendEmail } from "@/lib";
import { createRandomCode } from "@/utils";
import { User } from "@prisma/client";
import ms from "ms";

export const sendVerificationCode = async function (user: User) {
	try {
		const { rawCode, hashedCode } = await createRandomCode(6, true);

		await prisma.verificationCode.create({
			data: {
				hashedCode: hashedCode,
				userId: user.id,
				expiresAt: new Date(Date.now() + ms("10m")),
				type: "EMAIL",
			},
		});

		await sendEmail({
			to: user.email,
			subject: "Verification Code",
			html: renderVerifyCodeTemplate(rawCode, user.name),
		});
	} catch (err) {
		console.log("An error occured while sending Email");
	}
};
