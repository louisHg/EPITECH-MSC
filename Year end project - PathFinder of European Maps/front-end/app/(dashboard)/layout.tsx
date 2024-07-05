"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import Navbar from "@/components/ui/navbar";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {}, []);

  if (!authState.isAuthenticated) {
    router.push("/signin");
  }

  return (
    <>
      <div className="w-full flex flex-col h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
}
