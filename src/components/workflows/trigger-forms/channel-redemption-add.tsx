"use client";
import TwitchSearchBar from "@/components/search-bars/twitch-search-bar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ChannelSearchResult, TwitchChannelPointsReward } from "@/types/API/twitch";
import { WorkflowEditor } from "@/types/workflow";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 } from "uuid";

const formSchema = z.object({
  id: z.string().uuid(),
  broadcaster_user_id: z.string(),
  broadcaster_user_login: z.string(),
  broadcaster_user_name: z.string(),
  user_id: z.string(),
  user_login: z.string(),
  user_name: z.string(),
  status: z.enum(["unfulfilled", "fulfilled"]), // Assuming status could have more values like "fulfilled"
  reward: z.object({
    id: z.string().uuid(),
    title: z.string(),
    cost: z.number(),
  }),
  redeemed_at: z.string().datetime(),
});

interface Props {
  broadcaster_id: string;
  broadcaster_display_name: string;
  handleSubmit: (data: z.infer<typeof formSchema>) => void;
  state?: WorkflowEditor;
  channelpoints?: TwitchChannelPointsReward[];
}

export default function ChannelRedemptionAdd({ broadcaster_id, broadcaster_display_name, handleSubmit, state, channelpoints }: Props) {
  "use no memo";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: v4(),
      user_id: "12826",
      user_login: "twitch",
      user_name: "Twitch",
      broadcaster_user_id: broadcaster_id,
      broadcaster_user_login: broadcaster_display_name.toLowerCase(),
      broadcaster_user_name: broadcaster_display_name,
      status: "unfulfilled",
      redeemed_at: new Date().toISOString(),
    },
  });

  const handleSelect = (data: ChannelSearchResult) => {
    form.setValue("user_id", data.id);
    form.setValue("user_login", data.display_name.toLowerCase());
    form.setValue("user_name", data.display_name);
  };

  // find the trigger and set the form reward values
  useEffect(() => {
    if (state && state.selectedNode && state.selectedNode.data && channelpoints) {
      const reward_id = state.selectedNode.data.metaData?.event_id;

      if (reward_id) {
        const reward = channelpoints.find((reward) => reward.id === reward_id);

        if (reward) {
          form.setValue("reward.id", reward.id);
          form.setValue("reward.title", reward.title);
          form.setValue("reward.cost", reward.cost);
        }
      }
    }
  }, [channelpoints]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (error) => {
          console.log(error);
          console.log(form.getValues());
        })}
        className="space-y-8"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From chatter</FormLabel>
                <FormControl>
                  <TwitchSearchBar onSelect={handleSelect} />
                </FormControl>
                <FormDescription>Who is redeeming the reward?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <div className="space-y-4">
          <TwitchSearchBar disabled placeholder={broadcaster_display_name} />
        </div> */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fulfilled</FormLabel>
              <FormControl>
                <Switch {...field} onCheckedChange={(value) => field.onChange(value ? "fulfilled" : "unfulfilled")} />
              </FormControl>
              <FormDescription>Is the redemption for fulfilled?</FormDescription>
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
