import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { AsyncErrorHandler } from "@/middlewares";
import { prisma } from "@/lib";
import { sendVerificationCode } from "@/services";
import { createRefresh } from "@/utils/createRefresh";
import { sendRefreshCookie } from "@/utils/sendRefreshCookie";
import { env } from "@/config/env";

export const signup = AsyncErrorHandler(async (req, res) => {
  // Extract name, email, and password from the validated request data
  const { name, email, password } = req.data;

  // Hash the password with a salt of 12 rounds
  const hashedPassword = await bycrypt.hash(password, 10);

  // Create a new user in the database with the hashed password and a refresh token
  const [refreshToken, hashedRefreshToken] = createRefresh();
  const { newUser } = await prisma.$transaction(
    async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      await tx.refreshToken.create({
        data: {
          expiresAt: new Date(
            Date.now() + ms(env.refreshTokenExpiresIn as StringValue),
          ),
          value: hashedRefreshToken,
          userId: newUser.id,
        },
      });

      return { newUser };
    },
  );

  // Create Access token
  const accessToken = jwt.sign({ id: newUser.id }, env.accessTokenSecret, {
    expiresIn: env.accessExpiresIn as StringValue,
  });

  // Send refresh token as http-only cookie
  sendRefreshCookie(res, refreshToken);

  // todo change this to an async job later
  // Send verification code to user's email
  void sendVerificationCode(newUser);

  // Send response
  res.status(201).json({
    message: "success",
    accessToken: accessToken,

    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar ? newUser.avatar : undefined,
    },
  });
});
