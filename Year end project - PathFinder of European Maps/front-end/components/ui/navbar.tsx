"use client";

import MainNav from "@/components/ui/main-nav";
import { useRouter } from "next/navigation";
import Logo from "./logo";
import { Button } from "./button";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

const Navbar: React.FC = () => {
  const router = useRouter();
  const profileImgUrl = "/images/Global/default_profile.png";
  const { authState, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("User disconnected.");
      router.push("/");
    } catch (error) {
      toast.error("User logout failed.");
      console.log(error);
    }
  };

  return (
    <header className="px-10  md:py-6 py-8 flex md:flex-row flex-col gap-3 md:gap-0 justify-between bg-white dark:bg-black items-center border-b-1  w-full">
      <div className="flex gap-5 h-full items-center">
        <Logo />

        <MainNav />
      </div>
      <div className="h-full flex items-center gap-10">
        {authState.isAuthenticated ? (
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 gap-2 dark:text-white"
          >
            <Plus />
            New Trip
          </Button>
        ) : (
          <></>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src={profileImgUrl}
              height={40}
              width={40}
              alt="default profile picture"
              className="rounded-full border"
            />
          </DropdownMenuTrigger>
          {!authState.isAuthenticated ? (
            <DropdownMenuContent align="end">
              <Link href="/signin">
                <DropdownMenuItem>Sign In</DropdownMenuItem>
              </Link>
              <Link href="/signup">
                <DropdownMenuItem>Sign Up</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent align="end">
              <Link href="/dashboard">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
              <Link href="/settings/profile">
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
