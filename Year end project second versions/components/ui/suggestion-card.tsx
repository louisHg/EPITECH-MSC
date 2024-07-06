import { auth } from "@/auth";
import { BookmarkIcon, StarIcon } from "lucide-react";

interface SuggestionCardProps {
  title: string;
  country: string;
  city: string;
  star: number;
}

const SuggestionCard: React.FC<SuggestionCardProps> = async ({
  title,
  country,
  city,
  star,
}) => {
  const session = await auth();
  return (
    <div>
      <div
        className="rounded-xl bg-cover flex justify-end  p-3 bg-center bg-no-repeat w-full md:w-[250px] h-[150px]"
        style={{
          backgroundImage: 'url("/images/LandingPage/Suggestion/bg.jpg")',
        }}
      >
        {session ? (
          <BookmarkIcon
            size={40}
            className="top-0 cursor-pointer hover:scale-105 transition-transform duration-300 transform bg-slate-50 rounded-full p-2 "
          />
        ) : (
          <></>
        )}
      </div>
      <div className="flex justify-between pt-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="flex gap-2 font-semibold text-sm">
          <StarIcon fill="#ffd700" strokeWidth="0"/>
          {star}
        </span>
      </div>
      <p className="font-light text-sm">
        {country},{city}
      </p>
    </div>
  );
};

export default SuggestionCard;
