"use client";

import { useTheme } from "next-themes";

import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import Image from "next/image";
import { Input } from "./input";
import { Button } from "./button";

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-slate-100 w-full gap-3 flex flex-col px-[10%] py-12">
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-8">
          {theme === "light" ? (
            <Image
              src="/images/Logo/light-logo-desktop.svg"
              alt="logo of trackfinder"
              width={50}
              loading="lazy"
              height={50}
              className="w-64 h-auto"
            />
          ) : (
            <Image
              src="/images/Logo/dark-logo-desktop.svg"
              alt="logo of trackfinder"
              width={50}
              loading="lazy"
              height={50}
              className="w-64 h-auto"
            />
          )}
          <div className="flex gap-10">
            <FaLinkedin className="text-blue-800" size={30} />
            <FaFacebook className="text-blue-600" size={30} />
            <FaInstagram className="text-pink-500" size={32} />
            <RiTwitterXLine size={30} />
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          <p className="font-semibold">Stay up to date</p>
          {/* <div className="flex gap-6">
            <Input placeholder="Enter your email"></Input>
            <Button variant="secondary">Subscribe</Button>
          </div> */}
        </div>
      </div>
      <hr className="my-10" />
      <div className="flex justify-between text-gray-400 ">
        <p className="">© 2023 Trackfinder. All rights reserved.</p>
        <ul className="flex gap-3 text-opacity-50">
          <li className="cursor-pointer hover:text-black transition color">
            Terms
          </li>
          <li className="cursor-pointer hover:text-black transition color">
            Privacy
          </li>
          <li className="cursor-pointer hover:text-black transition color">
            Cookies
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
