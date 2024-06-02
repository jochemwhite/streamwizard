"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOverlay, updateOverlay } from "@/actions/supabase/table-overlays";

import { overlayResolutions } from "@/lib/constant";
import { overlaySchema } from "@/schemas/overlay-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  setModal: (value: boolean) => void;
  overlay?: any;
}

export default function OverlayForm({ setModal, overlay }: Props) {
  const [overlayResolution, setOverlayResolution] = useState<string>("1080P");

  const form = useForm<z.infer<typeof overlaySchema>>({
    resolver: zodResolver(overlaySchema),
    defaultValues: {
      name: overlay?.name || "",
      width: overlay?.width || 1920,
      height: overlay?.height || 1080,
    },
  });

  async function onSubmit(values: z.infer<typeof overlaySchema>) {
    if (overlay) {
      await updateOverlay({ id: overlay.id, ...values });
    } else {
      await createOverlay(values);
    }

    setModal(false);
  }

  const handleOverlayResolution = (value: string) => {
    console.log(`value`, value);

    setOverlayResolution(value);
    const resolution = overlayResolutions.find((resolution) => resolution.name === value);
    if (resolution && resolution.width && resolution.height) {
      form.setValue("width", resolution.width);
      form.setValue("height", resolution.height);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (e) => {
          console.log(`error`, e);
        })}
        className="space-y-8"
      >
        <div className="flex flex-col">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Overlay Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your overlay name here..." {...field} />
                </FormControl>
                <FormDescription>Name of your overlay.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4">
            <Select value={overlayResolution} onValueChange={handleOverlayResolution}>
              <SelectTrigger>
                <SelectValue placeholder="Select a resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Overlay resolution*</SelectLabel>
                  {overlayResolutions.map((resolution, index) => (
                    <SelectItem key={index} value={resolution.name}>
                      {resolution.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {overlayResolution === "custom" && (
            <div className="flex flex-row justify-between mt-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input placeholder="1920" type="number" {...field} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormDescription>Width of the overlay.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input placeholder="1080" type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormDescription>Height of the overlay.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
