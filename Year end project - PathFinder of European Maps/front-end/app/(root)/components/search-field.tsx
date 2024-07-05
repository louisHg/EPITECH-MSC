import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchField: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 px-16 py-6 items-center translate-y-[-50%] md:w-[800px] shadow-xl bg-white  rounded-lg h-auto">
      <h1 className="text-4xl font-semibold">Explore the World Your Way</h1>
      <div className="flex w-full items-center">
        <Input placeholder="Where are you going ?" />
        <Button variant="outline" size="icon">
          <Search className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        </Button>
      </div>
    </div>
  );
};

export default SearchField;
