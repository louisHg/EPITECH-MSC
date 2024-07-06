import { Dribbble, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

interface WorkerCardProps {
  url: string;
  name: string;
  post: string;
  twitter: string;
  linkedin: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  url,
  name,
  post,
  twitter,
  linkedin,
}) => {
  return (
    <div className="flex md:basis-1/4 basis-1/2 mt-6">
      <div className="mx-auto my-2">
        <Image
          loading="lazy"
          src={`/images/LandingPage/Worker/${url}`}
          alt={`picture ${name}`}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-blue-500 font-medium mb-2">{post}</p>
        </div>
        <ul className="flex gap-3">
          <li>
            <Button variant="outline" size="icon">
              <Twitter className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            </Button>
          </li>
          <li>
            <Button variant="outline" size="icon">
              <Linkedin className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WorkerCard;
