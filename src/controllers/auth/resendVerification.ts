import { AsyncErrorHandler } from "@/middlewares";
import { sendVerificationCode } from "@/services";
import { AuthenticatedRequest } from "@/types";

export const resendVerification = AsyncErrorHandler(async function (
  req: AuthenticatedRequest,
  res,
) {
  const user = req.user;

  await sendVerificationCode(user!);

  res.status(200).json({ message: "Verification Code Sent successfully" });
});
