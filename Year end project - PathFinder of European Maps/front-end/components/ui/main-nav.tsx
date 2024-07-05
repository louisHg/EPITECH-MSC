import Link from "next/link";
import { useAuth } from "@/hooks/auth";

const MainNav: React.FC = () => {
  const { authState } = useAuth();
  const routes = [
    {
      href: `/`,
      label: "My Trips",
      authenticated: true,
    },
  ];
  return (
    <nav className="flex gap-5 h-full items-center">
      {routes.map((route, index) => (
        <Link
          key={index}
          href={route.href}
          className={`hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer ${
            !(route.authenticated && authState.isAuthenticated)
              ? "hidden"
              : "visible"
          }`}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
