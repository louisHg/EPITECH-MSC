"use server";

import { auth } from "@/auth";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";

export const deleteComment = async (
  id: number,
  userCommentId: string | null | undefined,
  travelId: string
) => {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const currentUser = await getUserById(session?.user?.id);

  if (currentUser?.id !== userCommentId) {
    return { error: "Unauthorized" };
  }

  const currentComment = await db.comment.findFirst({
    where: {
      id,
    },
  });

  if (!currentComment) {
    return { error: "Comment not found" };
  }

  try {
    await db.comment.delete({
      where: {
        id,
      },
    });

    const listHikingComments = await db.comment.findMany({
      where: {
        hikingId: travelId,
      },
    });
  
    if (!listHikingComments) {
      return { error: "No comments found for this hiking" };
    }

    let totalRatings = 0;
    listHikingComments.map((comment) => {
      totalRatings += comment.rating;
    });

    const averageRating = parseFloat(
      (totalRatings / listHikingComments.length).toFixed(1)
    );

    await db.hiking.update({
      where: {
        id: travelId,
      },
      data: {
        ratingAverage: averageRating,
      },
    });

    return { success: "Comment deleted" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};
