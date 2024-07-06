import { BookmarkIcon } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface TravelCardProps {
  title: string;
  img: string;
  stars: string;
  difficulty: string;
  distance: number | null;
  city: string;
  area: string;
  country: string;
  description: string;
}

const TravelCard: React.FC<TravelCardProps> = ({
  title,
  img,
  stars,
  difficulty,
  distance,
  city,
  area,
  country,
  description,
}) => {
  return (
    <div className="w-full overflow-hidden flex cursor-pointer hover:bg-gray-50  max-h-[180px] rounded-xl duration-200 transition-colors">
      <div
        className="rounded-lg bg-cover flex justify-end  p-3 bg-center bg-no-repeat w-[350px] h-[180px] "
        style={{
          backgroundImage: `url("/images/LandingPage/Suggestion/${img}")`,
        }}
      >
        <BookmarkIcon
          size={40}
          className="top-0 cursor-pointer hover:scale-105 transition-transform duration-300 transform bg-slate-50 rounded-full p-2 "
        />
      </div>
      <div className="flex flex-col px-4">
        <div className="flex gap-x-4 items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <p>
            <span className="flex gap-2 items-center">
              <StarFilledIcon
                color="yellow"
                width={30}
                height={30}
                className="shadow-2xl"
              />
              {stars}
            </span>
          </p>
          <p className="">{difficulty}</p>
          <p className="">{distance} KM</p>
        </div>
        <p>
          {city}, {area}, {country}
        </p>
        <p className="max-w-[800px] mt-5 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default TravelCard;
