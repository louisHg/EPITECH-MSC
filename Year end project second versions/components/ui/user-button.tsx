"use client";

import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export type UserButtonProps = {
  name: string;
};

const UserButton: React.FC<UserButtonProps> = ({ name }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-x-4 rounded-sm">
          <span className=" bg-gray-200 rounded-full p-[5px] flex items-center justify-center">
            <User size={20} />
          </span>

          {name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Link href="/settings/profile" className="flex gap-x-3">
            <Settings size={20} />
            My Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-x-3"
          onClick={async () => await signOut()}
        >
          <LogOut size={20} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
