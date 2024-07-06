import { Button } from "./button";
import Link from "next/link";

const OptionnalNav: React.FC = () => {
  const profileImgUrl = "/images/Global/default_profile.png";

  return (
    <div className="h-full flex items-center gap-10">
      <Link href="/auth/signin">
        <Button variant="default">Sign In</Button>
      </Link>
    </div>
  );
};

export default OptionnalNav;
