import { db } from "@/lib/db";
import Sidebar from "./components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = async ({
  children,
}) => {
  const difficulties = await db.difficulty.findMany();
  return (
    <div className="w-full flex-1 flex border-t ">
      <Sidebar difficulties={difficulties} />
      <div className="w-full h-full hidden md:block">{children}</div>
    </div>
  );
};

export default DashboardLayout;
