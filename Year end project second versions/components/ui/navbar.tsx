import MainNav from "@/components/ui/main-nav";
import Logo from "./logo";

import OptionnalNav from "./optionnal-nav";
import UserButton from "./user-button";
import { auth } from "@/auth";
import { Button } from "./button";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Navbar: React.FC = async () => {
  const session = await auth();
  const name = session?.user?.name;

  return (
    <header className="md:py-6 py-8 bg-white dark:bg-black border-b">
      <div className="flex gap-5 h-full w-full items-center container">
        <Logo />
        <div className="w-full flex items-center justify-between">
          {name ? <MainNav /> : <div></div>}

          {name ? (
            <div className="flex gap-x-3">
              <Button asChild>
                <Link href="/create-hiking" className="flex gap-x-2">
                  <PlusIcon width={20} height={20} />
                  Add Hiking
                </Link>
              </Button>
              <UserButton name={name} />
            </div>
          ) : (
            <OptionnalNav />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
