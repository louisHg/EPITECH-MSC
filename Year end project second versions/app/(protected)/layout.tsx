import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AuthProviders } from "@/providers/auth-provider";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user) {
    session.user = {
      id: session?.user?.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  if (session) {
    return (
      <>
        <AuthProviders session={session}>
          <div className="w-full flex flex-col flex-grow-0">{children}</div>
        </AuthProviders>
      </>
    );
  } else {
    return <div className="w-full flex flex-col h-screen">{children}</div>;
  }
}
