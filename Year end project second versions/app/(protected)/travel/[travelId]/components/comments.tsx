import CommentCard from "./comments-card";
import React from "react";
import { Prisma } from "@prisma/client";

type TravelWithUser = Prisma.CommentGetPayload<{ include: { user: true } }>;

interface TravelComments {
  comments: TravelWithUser[];
  currentUserId: string;
  travelId: string;
}

const TravelComments: React.FC<TravelComments> = ({
  comments,
  currentUserId,
  travelId
}) => {
  return (
    <section className="md:px-20 py-10">
      <h2 className="font-semibold text-2xl mb-6 " id="comment">
        Comments
      </h2>
      <div className="w-full flex flex-col gap-4">
        {comments.map((comment) => (
          <>
            <CommentCard
              idComment={comment.id}
              travelId={travelId}
              currentUserId={currentUserId}
              idUser={comment.user?.id}
              name={comment.user?.name}
              title={comment.title}
              content={comment.content}
              date={comment.createdAt.toDateString()}
              rating={comment.rating}
            />
            <hr className="my-4 last:hidden" />
          </>
        ))}
      </div>
    </section>
  );
};

export default TravelComments;
