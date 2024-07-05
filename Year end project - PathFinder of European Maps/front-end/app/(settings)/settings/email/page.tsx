"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";

interface SettingsEmailProps {}

const formSchema = z.object({
  currentEmail: z.string(),
  newEmail: z.string(),
});

const SettingsEmail: React.FC<SettingsEmailProps> = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentEmail: "",
      newEmail: "",
    },
  });

  const user = useAuth();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <h2 className="text-3xl font-semibold mb-4">Email</h2>
      <p className="mb-6">Please enter your new email.</p>
      <hr className="mb-6" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col w-full"
        >
          <FormField
            control={form.control}
            name="currentEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="on"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="on"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <hr />
          <div className="flex gap-3 md:mt-0 mt-3 justify-end">
            <Button className="bg-white hover:bg-gray-100 text-black border">
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-400">
              Update email
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SettingsEmail;
