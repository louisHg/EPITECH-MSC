import Link from "next/link";
import Logo from "@/components/ui/logo";
import RegisterForm from "./components/register-form";

const SignUp = () => {
  return (
    <div className="w-full h-full px-10 py-5 flex flex-col items-start">
      <div className="h-full flex flex-col items-center w-full px-0 md:px-[20%] justify-center  gap-5">
        <h3 className="text-black text-3xl self-start font-semibold">
          Sign Up
        </h3>
        <p className="text-black opacity-70 font-light self-start">
          Start your journey with us.
        </p>
        <RegisterForm />
        <p className="text-sm font-light">
          Already have an account ?{" "}
          <Link
            href="/auth/signin"
            className="text-blue-500 hover:text-blue-400 cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
