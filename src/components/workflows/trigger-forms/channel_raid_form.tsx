"use client";
import TwitchSearchBar from "@/components/search-bars/twitch-search-bar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChannelSearchResult } from "@/types/API/twitch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  handleSubmit: (data: z.infer<typeof formSchema>) => void;
}

export default function ChannelRaidForm({ broadcaster_id, broadcaster_display_name, handleSubmit }: Props) {
  "use no memo";

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

  const handleSelect = (data: ChannelSearchResult) => {
    form.setValue("from_broadcaster_user_id", data.id);
    form.setValue("from_broadcaster_user_login", data.display_name.toLowerCase());
    form.setValue("from_broadcaster_user_name", data.display_name);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (error) => {
          console.log(error);
        })}
        className="space-y-8"
      >
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
          <TwitchSearchBar disabled placeholder={broadcaster_display_name} />
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
        <Button type="submit" className="w-full">
          Test Workflow
        </Button>
      </form>
    </Form>
  );
}
