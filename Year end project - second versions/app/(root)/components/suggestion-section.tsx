import SuggestionCard from "@/components/ui/suggestion-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SuggestionSection: React.FC = () => {
  const suggestions = [
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.4,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.4,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.4,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.4,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.4,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.4,
    },
    {
      title: "Nom de la randonnée",
      country: "Pays",
      city: "Ville",
      star: 4.4,
    },
  ];
  return (
    <section className="w-full py-16 justify-center  px-5 md:px-[10%] flex flex-col gap-8">
      <h2 className="text-3xl">
        Local favorites near <span className="underline">Lille</span>
      </h2>
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

      {/* <div className="w-full  flex flex-col md:flex-row flex-wrap gap-8">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={index}
            title={suggestion.title}
            city={suggestion.city}
            country={suggestion.country}
            star={suggestion.star}
          />
        ))}
      </div> */}
    </section>
  );
};

export default SuggestionSection;
