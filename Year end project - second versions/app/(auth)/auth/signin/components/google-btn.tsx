"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const GoogleButton = () => {
  return (
    <Button
      onClick={async () => {
        await signIn();
      }}
      className="text-blue-500 hover:text-blue-400 cursor-pointer"
    >
      Google
    </Button>
  );
};

export default GoogleButton;
