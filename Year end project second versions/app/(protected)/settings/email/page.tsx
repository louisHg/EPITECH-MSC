"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useTransition } from "react";
import { changeEmail } from "@/actions/change-email";
import { ChangeEmailSchema } from "@/schemas";
import { useSession } from "next-auth/react";

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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

interface SettingsEmailProps {}

const SettingsEmail: React.FC<SettingsEmailProps> = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { data: session, update } = useSession();
  const [currentEmail, setCurrentEmail] = useState("");

  const form = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      currentEmail: "",
      newEmail: "",
    },
  });

  const handleClick = async () => {
    await update({ email: "test@test.fr" });
    console.log(session);
  };

  const onSubmit = (values: z.infer<typeof ChangeEmailSchema>): void => {
    setError("");
    setSuccess("");
    startTransition(() => {
      changeEmail(values).then(async (data) => {
        if (data?.error) setError(data.error);
        if (data?.success) {
          setSuccess(data.success);
          await update({ email: data.email });
          form.reset();
          // window.location.reload();
        }
      });
    });
  };

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
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <hr />

          <div className="flex gap-3 md:mt-0 mt-3 justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-500 hover:bg-blue-400"
            >
              Update email
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SettingsEmail;
