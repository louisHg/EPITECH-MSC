import { signIn } from "next-auth/react";

import LoginForm from "./components/login-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleButton from "./components/google-btn";

const SignIn = () => {
  return (
    <div className="w-full h-full px-10 py-5 flex flex-col items-start">
      <div className="h-full flex flex-col items-center w-full px-0 md:px-[20%] justify-center  gap-5">
        <h3 className="text-black text-3xl self-start font-semibold">
          Welcome back
        </h3>
        <p className="text-black opacity-70 self-start">
          Welcome back ! Please enter your details.
        </p>
        <LoginForm />
        <p className="text-sm font-light">
          Don&apos;t have account ?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-500 hover:text-blue-400 cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
