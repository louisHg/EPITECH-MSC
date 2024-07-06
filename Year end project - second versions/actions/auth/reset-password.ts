"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { auth } from "@/auth";

import { getUserByEmail } from "@/data/user";
import { ResetPasswordSchema } from "@/schemas";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { currentPassword, newPassword, confirmPassword } =
    validatedFields.data;

  const session = await auth();

  if (session?.user?.email) {
    const existingUser = await getUserByEmail(session.user.email);
    if (existingUser?.password) {
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        existingUser.password
      );
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.user.update({
          where: {
            email: session.user.email,
          },
          data: {
            password: hashedPassword,
          },
        });
        return { success: "Password changed!" };
      } else {
        return { error: "Current password incorrect." };
      }
    }
  }
};
