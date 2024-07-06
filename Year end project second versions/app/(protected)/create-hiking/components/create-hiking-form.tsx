"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateHikingSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { set, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Difficulty } from "@prisma/client";
import PreviewMap from "./preview-map";
import { DownloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { createHiking } from "@/actions/create-hiking";

const parseGPX = (gpxContent: string): [number, number][] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxContent, "text/xml");

  const trackpoints = xmlDoc.querySelectorAll("trkpt");

  const points: [number, number][] = Array.from(trackpoints).map((point) => {
    const lat = parseFloat(point.getAttribute("lat")!);
    const lon = parseFloat(point.getAttribute("lon")!);
    return [lat, lon];
  });

  return points;
};

interface CreateHikingFormProps {
  difficulties: Difficulty[];
}

const CreateHikingForm: React.FC<CreateHikingFormProps> = ({
  difficulties,
}) => {
  const [gpxContent, setGpxContent] = useState<string>("");
  const [pointsList, setPointsList] = useState<[number, number][]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    50.63129, 3.06275,
  ]);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateHikingSchema>>({
    resolver: zodResolver(CreateHikingSchema),
    defaultValues: {
      title: "",
      description: "",
      difficultyId: "",
      travelPoints: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateHikingSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await createHiking(values);

      if (result?.error) {
        setError(result.error);
        return;
      }
      toast.success("Created successfully!");

      router.push(`/travel/${result.hiking?.id}`);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Récupérer le fichier depuis l'événement

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setGpxContent(content);

        const points = parseGPX(content);
        setPointsList(points);

        setMapCenter(points[0]);

        form.setValue("travelPoints", points);
      };

      reader.readAsText(file);
    }
  };

  const clearForm = () => {
    form.reset();
    setGpxContent("");
    setPointsList([]);
    setMapCenter([50.63129, 3.06275]);
    form.setValue("travelPoints", []);
    form.setValue("difficultyId", "");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col w-full"
      >
        <div className="flex w-full gap-x-3 border-b py-6">
          <div className="flex-1 border-r pr-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title..."
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description..."
                      disabled={isPending}
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficultyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a difficulty"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficulties.map((difficulty) => (
                          <SelectItem
                            key={difficulty.id}
                            value={difficulty.id.toString()}
                          >
                            {difficulty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1 flex flex-col gap-y-6 pl-6">
            <PreviewMap points={pointsList} mapCenter={mapCenter} />
            <div className="flex gap-x-3 self-end">
              <div className="flex flex-row-reverse w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">.gpx</Label>
                <Input
                  id="picture"
                  accept=".gpx"
                  type="file"
                  className="cursor-pointer"
                  onChange={handleFileUpload}
                />
              </div>{" "}
              <Button
                type="button"
                variant="destructive"
                className="flex gap-x-2 w-fit"
                onClick={clearForm}
              >
                <TrashIcon width={20} height={20} />
                Clear
              </Button>
            </div>
          </div>
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 hover:bg-blue-400 w-fit self-end"
        >
          Create
        </Button>
      </form>
    </Form>
  );
};

export default CreateHikingForm;
