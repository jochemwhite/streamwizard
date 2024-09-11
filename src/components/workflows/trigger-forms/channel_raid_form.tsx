"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import TwitchSearchBar from "@/components/search-bars/twitch-search-bar";

const formSchema = z.object({
  from_broadcaster_user_id: z.string().min(1, "User ID is required"),
  from_broadcaster_user_login: z.string().min(1, "User login is required"),
  from_broadcaster_user_name: z.string().min(1, "User name is required"),
  to_broadcaster_user_id: z.string().min(1, "User ID is required"),
  to_broadcaster_user_login: z.string().min(1, "User login is required"),
  to_broadcaster_user_name: z.string().min(1, "User name is required"),
  viewers: z.number().int().positive("Viewer count must be a positive integer"),
});

export default function ChannelRaidForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_broadcaster_user_id: "1234",
      from_broadcaster_user_login: "cool_user",
      from_broadcaster_user_name: "Cool_User",
      to_broadcaster_user_id: "1337",
      to_broadcaster_user_login: "cooler_user",
      to_broadcaster_user_name: "Cooler_User",
      viewers: 9001,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log(values);
      // toast({
      //   title: "Form submitted",
      //   description: "The broadcaster information has been updated.",
      // })
    }, 1000);
  }

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
                  <TwitchSearchBar action_label="Select broadcaster" placeholder="Jochemwhite" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="to_broadcaster_user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Broadcaster </FormLabel>
                <FormControl>
                  <Input placeholder="Enter user ID" {...field} />
                </FormControl>
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
          {isLoading ? "Updating..." : "Update Broadcaster Information"}
        </Button>
      </form>
    </Form>
  );
}
