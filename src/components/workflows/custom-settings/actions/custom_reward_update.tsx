import React, { use, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectChannelpoint from "@/components/form-components/select-channelpoint";
import { useEditor } from "@/hooks/UseWorkflowEditor";
import Modal from "@/components/global/modal";
import ChannelpointForm from "@/components/forms/channelpoint-form";

interface ICustomRewardUpdateProps {}

const formSchema = z
  .object({
    id: z.string(),
    title: z.string().max(45).optional(),
    prompt: z.string().max(200).optional(),
    cost: z.string().regex(/^[-+]?(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/, "Invalid cost format"),
    background_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format")
      .optional(),
    is_enabled: z.boolean().optional(),
    is_user_input_required: z.boolean().optional(),
    is_max_per_stream_enabled: z.boolean().optional(),
    max_per_stream: z.number().int().min(1).optional(),
    is_max_per_user_per_stream_enabled: z.boolean().optional(),
    max_per_user_per_stream: z.number().int().min(1).optional(),
    is_global_cooldown_enabled: z.boolean().optional(),
    global_cooldown_seconds: z.number().int().min(1).optional(),
    is_paused: z.boolean().optional(),
    should_redemptions_skip_request_queue: z.boolean().optional(),
  })
  .partial();
// .refine(
//   (data) => {
//     if (data.is_user_input_required && !data.prompt) {
//       return false;
//     }
//     if (data.is_max_per_stream_enabled && !data.max_per_stream) {
//       return false;
//     }
//     if (data.is_max_per_user_per_stream_enabled && !data.max_per_user_per_stream) {
//       return false;
//     }
//     if (data.is_global_cooldown_enabled && !data.global_cooldown_seconds) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Conditional fields validation failed",
//     path: ["body"],
//   }
// );

export default function CustomRewardUpdate({}: ICustomRewardUpdateProps) {
  const { state, dispatch } = useEditor();
  const [modal, setModal] = React.useState(false);

  useEffect(() => {
    // set initial values
    if (state.editor.selectedNode.data.metaData) {
      const { cost, reward_id } = state.editor.selectedNode.data.metaData 
      if (cost) form.setValue("cost", cost);
      if (reward_id) form.setValue("id", reward_id);

      console.log({ cost, reward_id });

    }
  }, [state.editor.selectedNode]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cost: "+10",
      id: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch({
      type: "UPDATE_METADATA",
      payload: {
        id: state.editor.selectedNode.id,
        metadata: {
          reward_id: values.id,
          cost: values.cost,
        },
      },
    });
  }

  return (
    <Form {...form}>
      <Modal open={modal} setModal={() => setModal(false)}>
        <ChannelpointForm setModal={() => setModal(false)} />
      </Modal>
      <form
        onChange={form.handleSubmit(onSubmit, (error) => {
          console.log({ error });
        })}
        className="space-y-8 overflow-scroll"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Reward ID</FormLabel>
              <FormControl>
                <>
                <SelectChannelpoint value={form.watch("id")} onValueChange={field.onChange} />
                <Button type="button" variant="outline" onClick={() => setModal(true)}>New ChannelPoint</Button>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Update Reward Cost</FormLabel>
              <FormControl>
                <Input placeholder="+1000" {...field} />
              </FormControl>
              <FormDescription>Use &quot;+&quot; to increase and &quot;-&quot; to decrease</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}