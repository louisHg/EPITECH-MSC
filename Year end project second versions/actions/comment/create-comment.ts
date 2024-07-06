"use server";

import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { CreateCommentSchema } from "@/schemas";
import * as z from "zod";

export const createComment = async (
  values: z.infer<typeof CreateCommentSchema>
) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CreateCommentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { travelId, title, rating, description } = validatedFields.data;

  const currentUser = await getUserByEmail(session.user.email);

  if (!currentUser) {
    return { error: "User not found!" };
  }

  try {
    await db.comment.create({
      data: {
        userId: currentUser.id,
        title: title,
        hikingId: travelId,
        content: description,
        rating,
      },
    });

    const comments = await db.comment.findMany({
      where: {
        hikingId: travelId,
      },
    });

    let totalRatings = 0;
    comments.map((comment) => {
      totalRatings += comment.rating;
    });

    const averageRating = parseFloat(
      (totalRatings / comments.length).toFixed(1)
    );

    await db.hiking.update({
      where: {
        id: travelId,
      },
      data: {
        ratingAverage: averageRating,
      },
    });

    return { succes: "Nice comment!", travelId: travelId };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
