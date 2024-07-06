"use client";

import { auth } from "@/auth";
import { Cross1Icon } from "@radix-ui/react-icons";
import { CpuIcon, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { deleteComment } from "@/actions/comment/delete-comment";
import { AlertModal } from "@/components/modals/alert-modal";

interface CommentCardProps {
  idComment: number;
  idUser: string | null | undefined;
  travelId: string;
  name: string | null | undefined;
  title: string;
  content: string;
  date: string;
  rating: number;
  currentUserId: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  idComment,
  travelId,
  idUser,
  name,
  title,
  content,
  date,
  rating,
  currentUserId,
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const handleDeleteComment = async () => {
    startTransition(async () => {
      const result = await deleteComment(idComment, idUser, travelId);

      if (result.error) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Comment deleted");
      router.refresh();
    });
  };

  const roundedRating = Math.round(rating);
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteComment}
        loading={isPending}
      />
      <div className="flex flex-col gap-2 py-2">
        <div className="flex gap-2 items-center w-full justify-between">
          <div className="flex gap-3">
            <div className="flex flex-row gap-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  fill={index < roundedRating ? "#ffd700" : "#d3d3d3"}
                  strokeWidth="0"
                />
              ))}
            </div>
            <p className="italic">{name}</p>
          </div>
          {currentUserId === idUser ? (
            <div
              onClick={() => setOpen(true)}
              className="flex items-center justify-center border p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer "
            >
              <Cross1Icon color="red" height={20} width={20} />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm font-light text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm">{content}</p>
      </div>
    </>
  );
};

export default CommentCard;
