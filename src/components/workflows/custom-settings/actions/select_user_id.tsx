"use client";
import usePlaceholders from "@/hooks/workflow/usePlaceholders";
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditor } from "@/hooks/UseWorkflowEditor";

export default function Select_user_id() {
  const { placeholders } = usePlaceholders();
  const { state, dispatch } = useEditor();
  const { user_id } = state.editor.selectedNode?.data.metaData as { user_id: string };

  const allowedOptions = ["broadcaster_user_id", "user_id", "broadcaster_id", "from_broadcaster_user_id", "to_broadcaster_user_id"];

  // Include node_id and filter options
  const optionsState: Record<string, { node_id: string; options: string[] }> = placeholders.reduce((acc, placeholder) => {
    const filteredOptions = placeholder.options.filter((option) => allowedOptions.includes(option));
    if (filteredOptions.length > 0) {
      acc[placeholder.label] = {
        node_id: placeholder.node_id, // Include node_id
        options: filteredOptions, // Filtered options
      };
    }
    return acc;
  }, {} as Record<string, { node_id: string; options: string[] }>);

  const handleSelect = (value: string) => {
    if (!state.editor.selectedNode) return;

    dispatch({
      type: "UPDATE_METADATA",
      payload: {
        id: state.editor.selectedNode.id,
        metadata: {
          user_id: value,
        },
      },
    });
  };

  return (
    <Select onValueChange={handleSelect} value={user_id ?? undefined}>
      <SelectTrigger>
        <SelectValue placeholder="Select user id" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(optionsState).map(([label, { node_id, options }]) => (
          <SelectGroup key={label}>
            <SelectLabel className="font-bold">{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={`${node_id}:${option}`} value={`${node_id}:${option}`}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
