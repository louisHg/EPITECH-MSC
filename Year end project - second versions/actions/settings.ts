"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export const updateUsername = async (name: string, email: string) => {
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Unauthorized" };
  }

  await db.user.update({
    where: { email },
    data: { name },
  });

  return { success: "User edited!", name: name };
};
