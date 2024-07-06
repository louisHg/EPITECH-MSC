import FeatureCard from "./feature-card";

const FeatureSection: React.FC = () => {
  const datas = [
    {
      url: "reglage.svg",
      title: "Personalized Hiking",
      description:
        "Tailor routes to match your skill level and preferences, ensuring the perfect outdoor experience.",
    },
    {
      url: "coffre-au-tresor-1.svg",
      title: "Unlock Hidden Gems",
      description:
        "Discover secret, off-the-beaten-path treasures and explore unique, lesser-known destinations.",
    },
    {
      url: "boussole.svg",
      title: "Adventure for All",
      description:
        "Find adventures suitable for all levels of hikers, from beginners to experienced trekkers.",
    },
    {
      url: "livre.svg",
      title: "Cultural Insights",
      description:
        "Immerse yourself in the culture and history of the places you visit.",
    },
    {
      url: "pierre-chaude.svg",
      title: "Stress-Free Planning",
      description:
        "Enjoy your journey without the hassle of logistics; we handle the planning for you.",
    },
    {
      url: "livre2.svg",
      title: "Community Connection",
      description:
        "Join a community of fellow adventurers, share experiences, and make new friends.",
    },
  ];
  return (
    <div className="flex flex-wrap w-full justify-center my-16 container gap-12 ">
      {datas.map((data, index) => (
        <FeatureCard
          title={data.title}
          description={data.description}
          url={data.url}
          key={index}
        />
      ))}
    </div>
  );
};

export default FeatureSection;
