"use client";

import TwitchSearchBar from "@/components/search-bars/twitch-search-bar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChannelSearchResult } from "@/types/API/twitch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import axios from "axios";
import { env } from "@/lib/env";
const formSchema = z.object({
  from_broadcaster_user_id: z.string().min(1, "User ID is required"),
  from_broadcaster_user_login: z.string().min(1, "User login is required"),
  from_broadcaster_user_name: z.string().min(1, "User name is required"),
  to_broadcaster_user_id: z.string().min(1, "User ID is required"),
  to_broadcaster_user_login: z.string().min(1, "User login is required"),
  to_broadcaster_user_name: z.string().min(1, "User name is required"),
  viewers: z.number().int().positive("Viewer count must be a positive integer"),
});

interface Props {
  broadcaster_id: string;
  broadcaster_display_name: string;
  JWT: string
}

export default function ChannelRaidForm({ broadcaster_id, broadcaster_display_name, JWT }: Props) {
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_broadcaster_user_id: "12826",
      from_broadcaster_user_login: "twitch",
      from_broadcaster_user_name: "Twitch",
      to_broadcaster_user_id: broadcaster_id,
      to_broadcaster_user_login: broadcaster_display_name.toLowerCase(),
      to_broadcaster_user_name: broadcaster_display_name,
      viewers: 50,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL!}/workflow/test`, values, {
        headers: {
          supabasejwt: JWT,
        },
      });
    }, {
      loading: "Testing workflow ...",
      success: "Raided stream",
      error: "Error raiding stream",
    });
  }

  const handleSelect = (data: ChannelSearchResult) => {
    form.setValue("to_broadcaster_user_id", data.id);
    form.setValue("to_broadcaster_user_login", data.display_name.toLowerCase());
    form.setValue("to_broadcaster_user_name", data.display_name);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="from_broadcaster_user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Broadcaster</FormLabel>
                <FormControl>
                  <TwitchSearchBar onSelect={handleSelect} />
                </FormControl>
                <FormDescription>Who is raiding the stream.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            disabled
            name="to_broadcaster_user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Broadcaster </FormLabel>
                <FormControl>
                  <TwitchSearchBar disabled placeholder={broadcaster_display_name} />
                </FormControl>
                <FormDescription>Who is getting the raid.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="viewers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Viewers</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter viewer count" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
              </FormControl>
              <FormDescription>Enter the number of viewers</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          Test Workflow
        </Button>
      </form>
    </Form>
  );
}
