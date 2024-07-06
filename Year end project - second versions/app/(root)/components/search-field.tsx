"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SearchField: React.FC = () => {
  const [location, setLocation] = useState("");

  const router = useRouter();

  const submitSearch = () => {
    axios
      .get(
        `https://api.tomtom.com/search/2/geocode/${location}.json?storeResult=false&language=fr-FR&view=Unified&key=lGFkSLG4XRCdBFsU1nSKIWDFFtnuH2AV`
      )
      .then((res) => {
        let lat = res.data.results[0].position.lat;
        let lon = res.data.results[0].position.lon;
        router.push(`/dashboard?lat=${lat}&lng=${lon}`);
      })
      .catch((err) => console.log(err));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      submitSearch();
    }
  };

  return (
    <section className="container">
      <div className="px-16 py-6 mx-auto max-w-3xl w-[95%] translate-y-[-50%] bg-white rounded-lg shadow-xl">
        <h1 className="lg:text-4xl text-lg font-semibold mb-6 text-center">
          Explore the World Your Way
        </h1>
        <div className="flex w-full items-center border rounded-md overflow-hidden">
          <Input
            placeholder="Where are you going ?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={submitSearch}
            className="border-l border-t-0 border-r-0 border-b-0 rounded-none"
          >
            <Search className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SearchField;
