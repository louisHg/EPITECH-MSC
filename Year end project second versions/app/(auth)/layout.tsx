import Navbar from "@/components/ui/navbar";
import Image from "next/image";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-rows-1 grid-cols-1 lg:grid-cols-2 flex-1">
      <div className="">{children}</div>
      <Image
        loading="lazy"
        width={1920}
        height={1080}
        src={"/images/SignIn/bg.jpeg"}
        alt="default profile picture"
        className="hidden lg:block rounded-l-3xl h-full object-cover object-left"
      />
    </section>
  );
}
