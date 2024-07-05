import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/providers/toast-provider";
import { AuthProvider } from "@/hooks/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrackFinder",
  description: "Front-end of TrackFinder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body className={inter.className + "dark:bg-black"}>
          <AuthProvider>
            <ToasterProvider />
            {children}
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
