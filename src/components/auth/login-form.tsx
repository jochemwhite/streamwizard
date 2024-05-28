"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SocialIcon from '@/components/global/icons';
import TwitchLogin from "@/components/auth/TwitchLogin";
import { Input } from "../ui/input";
import { loginSchema } from "@/schemas/login";
import { Button } from "../ui/button";
import LoadingSpinner from "../global/loading";

interface UserAuthFormProps {
  redirect: string | null;
}

export function UserAuthForm({ redirect }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    toast.info("Please use the Twitch login");
  }

  return (
    <div className={cn("grid gap-6")}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (error) => {
            console.error(error);
          })}
        >
          <div className="grid gap-2">
            <div className="grid gap-1">
              <div>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Title</FormLabel> */}
                      <FormControl className="w-96">
                        <Input
                          id="email"
                          placeholder="user@example.net"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-2">
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Title</FormLabel> */}
                      <FormControl className="w-96">
                        <Input
                          id="password"
                          placeholder="********"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="password"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button disabled={isLoading}>
              {isLoading && <LoadingSpinner />}
              Sign In with Email
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <TwitchLogin redirect={redirect} />
    </div>
  );
}
