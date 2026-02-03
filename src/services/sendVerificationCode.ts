import { AppError } from "@/errors";
import { prisma, renderVerifyCodeTemplate, sendEmail } from "@/lib";
import { createRandomCode } from "@/utils";
import { User } from "@prisma/client";
import ms from "ms";

export const sendVerificationCode = async function (
  user: Pick<User, "id" | "email" | "name">,
  throwError: boolean = false,
) {
  try {
    console.log("sending email");
    const { rawCode, hashedCode } = await createRandomCode(6, true);

    console.log(rawCode, hashedCode);
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
    console.log("sent email");
  } catch (err) {
    console.log("An error occured while sending Email");

    if (throwError) throw new AppError("Could not Send email", 400);
  }
};
