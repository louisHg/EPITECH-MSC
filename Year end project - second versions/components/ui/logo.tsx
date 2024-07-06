"use client";
import Image from "next/image";
import React from "react";
import useDeviceType from "@/hooks/use-device-type";
import Link from "next/link";

interface LogoProps {}

const Logo: React.FC<LogoProps> = () => {
  return (
    <Link href="/">
      <Image
        src="/images/Logo/dark-logo-desktop.svg"
        alt="logo of trackfinder"
        width={300}
        loading="lazy"
        height={300}
      />
    </Link>
  );
};

export default Logo;
