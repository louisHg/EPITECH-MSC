import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SuggestionCard from "@/components/ui/suggestion-card";
import { Hiking } from "@prisma/client";
interface TravelEventSuggestion {
  hiking: Hiking;
}

const TravelEventSuggestion: React.FC<TravelEventSuggestion> = ({ hiking }) => {
  const suggestions = [
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 3,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.8,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 3,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.4,
    },
  ];
  return (
    <section className="w-full py-10">
      <div className="md:px-20 flex flex-col gap-8">
        <h2 className="text-2xl font-semibold">Events for this trip</h2>
        <div className="px-5">
          <Carousel>
            <CarouselContent>
              {suggestions.map((suggestion, index) => (
                <CarouselItem key={index} className="basis-[250px] mr-6">
                  <SuggestionCard
                    title={suggestion.title}
                    city={suggestion.city}
                    country={suggestion.country}
                    star={suggestion.star}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TravelEventSuggestion;
