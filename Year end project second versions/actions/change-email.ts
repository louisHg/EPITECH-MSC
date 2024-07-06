"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { auth } from "@/auth";

import { getUserByEmail } from "@/data/user";
import { ChangeEmailSchema } from "@/schemas";

export const changeEmail = async (
  values: z.infer<typeof ChangeEmailSchema>
) => {
  const validatedFields = ChangeEmailSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { currentEmail, newEmail } = validatedFields.data;

  const session = await auth();

  if (session?.user?.email) {
    const existingUser = await getUserByEmail(session.user.email);

    if (!existingUser) return { error: "Unauthorized" };

    if (session.user.email === currentEmail) {
      await db.user.update({
        where: {
          email: session.user.email,
        },
        data: {
          email: newEmail,
        },
      });

      return { success: "Email updated!", email: newEmail };
    } else {
      return { error: "Current email don't match!" };
    }
  }

  return { error: "Something went wrong!" };
};
