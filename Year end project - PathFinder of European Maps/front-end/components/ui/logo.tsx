"use client";
import Image from "next/image";
import React from "react";
import useDeviceType from "@/hooks/use-device-type";
import Link from "next/link";

interface LogoProps {}

const Logo: React.FC<LogoProps> = () => {
  const deviceType = useDeviceType();

  if (deviceType === "desktop") {
    return (
      <Link href="/">
        <Image
          src="/images/Logo/dark-logo-desktop.svg"
          alt="logo of trackfinder"
          width={300}
          height={300}
          className="w-64 h-auto"
        />
      </Link>
    );
  } else {
    return (
      <Link href="/">
        <Image
          src="/images/Logo/dark-logo-mobile.svg"
          alt="logo of trackfinder"
          width={50}
          height={50}
          className="w-auto"
        />
      </Link>
    );
  }
};

export default Logo;
