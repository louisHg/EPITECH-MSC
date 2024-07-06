"use client";

import { Hiking } from "@prisma/client";
import { StarIcon } from "lucide-react";
import React, { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateCommentSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createComment } from "@/actions/comment/create-comment";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TravelCommentsForm {
  hiking: Hiking;
  travelId: string;
}

const TravelCommentsForm: React.FC<TravelCommentsForm> = ({
  hiking,
  travelId,
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState<number>(1);
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      travelId: travelId,
      title: "",
      rating: 1,
      description: "",
    },
  });

  const handleStarsClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const onSubmit = async (values: z.infer<typeof CreateCommentSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await createComment(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      form.reset();
      toast.success("Comment created successfully");
      setRating(1);
      router.refresh();
    });
  };

  return (
    <section className="md:px-20">
      <h2 className="font-semibold text-2xl mb-6 ">Leave a comment</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a title..."
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
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Rating</FormLabel>
                <FormControl>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        fill={index < rating ? "#ffd700" : "#d3d3d3"}
                        strokeWidth="0"
                        className="cursor-pointer"
                        onClick={() => {
                          handleStarsClick(index + 1);
                          field.onChange(index + 1);
                        }}
                      />
                    ))}
                  </div>
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
                <FormLabel className="text-lg">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a desctiption..."
                    disabled={isPending}
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-400 mt-2 w-20"
          >
            Send
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default TravelCommentsForm;
