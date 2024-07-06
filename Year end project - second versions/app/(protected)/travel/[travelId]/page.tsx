import dynamic from "next/dynamic";

import TravelBanner from "./components/banner";
import TravelDescription from "./components/description";
import TravelNearSuggestion from "./components/near-suggestion";
import TravelEventSuggestion from "./components/event-suggestion";
import TravelCommentsForm from "./components/comment-form";
const TravelComments = dynamic(() => import("./components/comments"), {
  ssr: false,
});
import { db } from "@/lib/db";
import Footer from "@/components/ui/footer";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

interface TravelPageProps {
  params: { travelId: string };
}

const TravelPage: React.FC<TravelPageProps> = async ({ params }) => {
  const travelId = params.travelId;

  const session = await auth();

  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    redirect("/auth/login");
  }

  const hiking = await db.hiking.findFirst({
    where: {
      id: travelId,
    },
    include: {
      difficulties: true,
    },
  });

  if (!hiking) {
    redirect("/");
  }

  const pointsList = await db.travelPoint.findMany({
    where: {
      hikingId: hiking.id,
    },
    orderBy: {
      order: "asc",
    },
  });

  const comments = await db.comment.findMany({
    where: {
      hikingId: params.travelId,
    },
    include: {
      user: true,
    },
  });

  return (
    <div className="flex w-full flex-col">
      <TravelBanner hiking={hiking} evaluations={comments.length} />
      <div className="px-10 py-10">
        <TravelDescription hiking={hiking} pointsList={pointsList} />
        <TravelNearSuggestion hiking={hiking} />
        <TravelEventSuggestion hiking={hiking} />
        {comments.length != 0 && (
          <TravelComments
            travelId={params.travelId}
            currentUserId={currentUserId}
            comments={comments}
          />
        )}
        {session && (
          <TravelCommentsForm hiking={hiking} travelId={params.travelId} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TravelPage;
