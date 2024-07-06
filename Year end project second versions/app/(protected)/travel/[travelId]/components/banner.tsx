import { StarIcon } from "lucide-react";
import { Hiking, Prisma } from "@prisma/client";
import Link from "next/link";

type HikingWithDifficulty = Prisma.HikingGetPayload<{
  include: { difficulties: true };
}>;

interface TravelBanner {
  hiking: HikingWithDifficulty;
  evaluations: number;
}

const TravelBanner: React.FC<TravelBanner> = ({ hiking, evaluations }) => {
  return (
    <div
      className="w-full h-[300px] bg-cover bg-center bg-no-repeat px-10 py-4"
      style={{
        backgroundImage: `url("/images/Global/default_bg.png")`,
      }}
    >
      <div className="w-full h-full md:px-20 flex justify-end flex-col text-white">
        <div className="flex flex-wrap gap-x-4 items-center">
          <h1 className="text-xl font-bold">{hiking.title}</h1>
          {hiking.ratingAverage && hiking.ratingAverage > 0.0 ? (
            <span className="flex items-center">
              {hiking.ratingAverage}
              <StarIcon fill="#ffd700" strokeWidth="0" width={20} height={20} />
              <Link href={`/travel/${hiking.id}#comment`}>
                <span className="ml-2 text-sm hover:underline transition-colors">
                  ({evaluations})
                </span>
              </Link>
            </span>
          ) : (
            <></>
          )}

          <div className="flex gap-x-2 items-center">
            {hiking.difficulties.id === 1 ? (
              <img src="/images/Global/difficulty/easy.svg" />
            ) : hiking.difficulties.id === 2 ? (
              <img src="/images/Global/difficulty/medium.svg" />
            ) : (
              <img src="/images/Global/difficulty/hard.svg" />
            )}
            {hiking.difficulties.label}
          </div>
          <p>{hiking.distance}km</p>
        </div>
        <p className="font-light text-sm">
          {hiking.city}, {hiking.area}, {hiking.country}
        </p>
      </div>
    </div>
  );
};

export default TravelBanner;
