"use client";

import { useSearchParams } from "next/navigation";
import TravelList from "./components/travel-list";

const SearchPage: React.FC = () => {
  const params = useSearchParams();
  const page = parseInt(params.get("page") ?? "0");
  return (
    <div className="w-full h-full flex flex-col gap-y-4 p-4">
      <TravelList page={page} />
    </div>
  );
};

export default SearchPage;
