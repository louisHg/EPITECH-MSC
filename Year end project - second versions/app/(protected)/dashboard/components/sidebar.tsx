"use client";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Difficulty } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  difficulties: Difficulty[];
}

const formSchema = z.object({
  location: z.string().min(3),
});
const Sidebar: React.FC<SidebarProps> = ({ difficulties }) => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const [switchMap, setSwitchMap] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    axios
      .get(
        `https://api.tomtom.com/search/2/geocode/${values.location}.json?storeResult=false&language=fr-FR&view=Unified&key=lGFkSLG4XRCdBFsU1nSKIWDFFtnuH2AV`
      )
      .then((res) => {
        let lat = res.data.results[0].position.lat;
        let lon = res.data.results[0].position.lon;

        router.push(`/dashboard?lat=${lat}&lng=${lon}`);
      })
      .catch((err) => console.log(err));
  };

  const handleSwitchMap = () => {
    setSwitchMap(!switchMap);
    if (switchMap) {
      router.push("/dashboard/search");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="h-full w-auto min-w-[300px] max-w-[400px] border-r  md:px-3 md:py-8">
      <div className=" justify-end flex items-center space-x-2 mb-6">
        <Switch
          id="airplane-mode"
          onClick={handleSwitchMap}
          checked={switchMap}
        />
        <Label htmlFor="airplane-mode">
          {switchMap ? "Map mode" : "List mode"}
        </Label>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col w-full"
        >
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search a location</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input placeholder="Location..." {...field} />
                    <Button variant="outline" size="icon" type="submit">
                      <SearchIcon
                        size={40}
                        className="border rounded-lg cursor-pointer"
                      />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default Sidebar;
