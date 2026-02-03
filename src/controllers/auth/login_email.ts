import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";

import { prisma } from "@/lib";
import { AppError } from "@/errors";
import { AsyncErrorHandler } from "@/middlewares";

import { createRefresh } from "@/utils/createRefresh";
import { sendRefreshCookie } from "@/utils/sendRefreshCookie";

const environment = process.env.NODE_ENV;
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const accessExpiresIn = process.env.ACCESS_EXPIRES_IN;
const refreshTokenExpiresIn = process.env
  .REFRESH_TOKEN_EXPIRES_IN as StringValue;

if (
  !accessSecret ||
  !accessExpiresIn ||
  !refreshTokenExpiresIn ||
  !environment
) {
  throw new AppError("Invalid enviroment variables", 500);
}

export const login = AsyncErrorHandler(async (req, res, next) => {
  // Extract email and password from the validated request data
  const { email, password } = req.data;

  // Find the user by email in the database
  const user = await prisma.user.findUnique({ where: { email } });

  // If user does not exist, throw an authentication error
  if (!user) {
    // deleteCookie(res);
    throw new AppError("Authentication Error", 401, null, "login_error");
  }

  // Check if the provided password matches the stored hashed password
  const isCorrect = await bycrypt.compare(password, user.password ?? "");

  // If password is incorrect, throw an authenticati	on error
  if (!isCorrect) {
    throw new AppError("Authentication Error", 401, null, "login_error");
  }
  // Create Access token
  const accessToken = jwt.sign({ id: user.id }, accessSecret as string, {
    expiresIn: accessExpiresIn as StringValue,
  });

  const [refreshToken, hashedRefreshToken] = createRefresh();

  // add the hashed refresh token to the database
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      value: hashedRefreshToken,
      expiresAt: new Date(Date.now() + ms(refreshTokenExpiresIn)),
    },
  });

  // Send refresh token as http-only cookie
  sendRefreshCookie(res, refreshToken);

  // send the user details and the access token as a response
  res.status(200).json({
    message: "success",
    accessToken: accessToken,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ? user.avatar : undefined,
    },
  });
});
