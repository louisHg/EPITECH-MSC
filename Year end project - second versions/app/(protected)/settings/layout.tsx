"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = [
    {
      label: "Profile",
      href: "/settings/profile",
      active: pathname === "/settings/profile",
    },
    {
      label: "Password",
      href: "/settings/password",
      active: pathname === "/settings/password",
    },
    {
      label: "Email",
      href: "/settings/email",
      active: pathname === "/settings/email",
    },
  ];

  return (
    <>
      <div className="w-full h-screen flex flex-col dark:bg-black ">
        <div className="container md:py-8 h-full dark:bg-black">
          <h1 className="text-4xl mb-3 md:mb-10">Settings</h1>
          <hr />
          <div className="w-full flex md:flex-row flex-col h-full pt-6">
            <nav className="flex flex-row md:flex-col gap-6 md:pr-24 mb-3 md:mb-0">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`${
                    link.active ? "dark:bg-gray-800 bg-gray-100" : ""
                  } rounded-lg px-5 py-2 text-sm`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="w-full h-full">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
