"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { FindHikingSchema } from "@/schemas";
import * as z from "zod";

export const findHiking = async (values: z.infer<typeof FindHikingSchema>) => {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const validatedFields = FindHikingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { city, difficultyId, rating, minLength, maxLength } =
    validatedFields.data;

  const clauseWhere: any = {};

  clauseWhere.city = city;

  if (difficultyId) {
    clauseWhere.difficultyId = difficultyId;
  }

  if (rating) {
    clauseWhere.rating = rating;
  }

  if (minLength) {
    clauseWhere.minLength = minLength;
  }

  if (maxLength) {
    clauseWhere.maxLength = maxLength;
  }

  const hikings = await db.hiking.findMany({
    where: clauseWhere,
  });
};
