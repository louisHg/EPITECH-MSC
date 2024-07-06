import Link from "next/link";

const MainNav: React.FC = () => {
  const routes = [
    {
      href: `/`,
      label: "Home",
    },
    { href: "/", label: "My trips" },
  ];
  return (
    <nav className="flex gap-5 h-full items-center">
      {routes.map((route, index) => (
        <Link
          key={index}
          href={route.href}
          className={`hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer whitespace-nowrap`}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
