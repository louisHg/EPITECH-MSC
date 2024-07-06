"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useTransition } from "react";

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
import { ResetPasswordSchema } from "@/schemas";
import { resetPassword } from "@/actions/auth/reset-password";

interface SettingsPasswordProps {}

const SettingsPassword: React.FC<SettingsPasswordProps> = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      resetPassword(values).then((data) => {
        if (data?.error) setError(data.error);
        if (data?.success) {
          setSuccess(data.success);
          form.reset();
        }
      });
    });
  };

  return (
    <>
      <h2 className="text-3xl font-semibold mb-4">Password</h2>
      <p className="mb-6">
        Please enter your current password to change your password.
      </p>
      <hr className="mb-6" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col w-full"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
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
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="flex gap-3 md:mt-0 mt-3 justify-end">
            <Button className="bg-white hover:bg-gray-100 text-black border">
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-400">
              Update password
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SettingsPassword;
