import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/ui/navbar";
import { ToasterProvider } from "@/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrackFinder",
  description: "Front-end of TrackFinder",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>
        <html lang="en">
          <body
            suppressHydrationWarning={true}
            className={inter.className + "dark:bg-black"}
          >
            <ToasterProvider />
            <main className="min-h-screen layout-container">
              <Navbar />
              {children}
            </main>
          </body>
        </html>
      </SessionProvider>
    </>
  );
}
