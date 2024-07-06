"use client";

import MainNav from "@/components/ui/main-nav";
import Logo from "./logo";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "./button";
import { Link, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoggedNavbar: React.FC = () => {
  const currentUser = useCurrentUser();
  const profileImgUrl = "/images/Global/default_profile.png";
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="md:py-6 py-8 bg-white dark:bg-black border-b-1">
      <div className="flex gap-5 h-full w-full items-center container">
        <Logo />
        <MainNav />
        <div className="h-full flex items-center justify-between w-full gap-10">
          <Button
            onClick={() => router.push("/create")}
            className="bg-blue-500 hover:bg-blue-400 gap-2 dark:text-white"
          >
            <Plus />
            New Trip
          </Button>

          <div className="flex gap-3">
            {}
            {pathname === "/dashboard" ? (
              <>
                <Button
                  className="bg-blue-500 hover:bg-blue-400 gap-2 dark:text-white"
                  onClick={() => router.push("/settings/profile")}
                >
                  Settings
                </Button>
              </>
            ) : (
              <Button
                className="bg-blue-500 hover:bg-blue-400 gap-2 dark:text-white"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
            )}

            <Button
              className="bg-blue-500 hover:bg-blue-400 gap-2 dark:text-white"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoggedNavbar;
