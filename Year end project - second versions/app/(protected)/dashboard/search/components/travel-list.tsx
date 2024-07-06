import TravelCard from "./travel-card";
import { db } from "@/lib/db";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CEPagination from "@/components/CEPagination";

interface TravelListProps {
  page: number;
}

const TravelList: React.FC<TravelListProps> = async ({ page }) => {
  const step = 5;
  const hikings_length = await db.hiking.count();
  const hikings = await db.hiking.findMany({
    // skip: page * step,
    // take: step,
  });
  console.table(hikings);
  const last_page = Math.round(hikings_length / step) - 1;

  return (
    <div className="w-full h-full flex flex-col gap-y-4 p-4">
      {hikings.map((hiking, index) => (
        <TravelCard
          key={index}
          title={hiking.title}
          img="bg.jpg"
          stars="4,4"
          difficulty={
            hiking.difficultyId === 1
              ? "Easy"
              : hiking.difficultyId === 3
              ? "Medium"
              : "Hard"
          }
          distance={hiking.distance}
          city={hiking.city}
          area={hiking.area}
          country={hiking.country}
          description={hiking.description}
        />
      ))}
      <CEPagination
        url="/dashboard/search/?page="
        pages_length={last_page}
        current_page={page}
      />
    </div>
  );
};

export default TravelList;
