import Image from "next/image";

interface FeatureCardProps {
  url: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  url,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center gap-3 bg-slate-100 bg-opacity-50 w-[400px] h-[200px]  px-3 rounded-lg">
      <Image
        src={`/images/LandingPage/Deck/${url}`}
        alt={title}
        width={40}
        height={40}
        className="rounded-full translate-y-[-50%]"
      />
      <h3 className="text-center">{title}</h3>
      <p className="text-center opacity-50 mt-8">{description}</p>
    </div>
  );
};

export default FeatureCard;
