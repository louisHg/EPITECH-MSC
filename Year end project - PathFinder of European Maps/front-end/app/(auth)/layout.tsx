"use client";

import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté
    if (authState.isAuthenticated) {
      // Redirigez l'utilisateur vers la page d'accueil s'il est connecté
      router.push("/");
    }
  }, [authState, router]);

  return (
    <>
      <div className="flex w-full h-screen">
        <div className="w-full md:w-1/2  h-full">{children}</div>
        <div
          className="hidden md:block w-1/2  h-full bg-cover bg-center rounded-l-3xl"
          style={{
            backgroundImage: 'url("/images/SignIn/bg.jpeg")',
          }}
        ></div>
      </div>
    </>
  );
}
