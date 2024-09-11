"use client";
import { useTwitchProvider } from "@/hooks/useTwitchProvider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  value?: string | null;
  onValueChange: (value: string) => void;
}

export default function SelectBroadcaster({ value, onValueChange }: Props) {
  const { channelPoints } = useTwitchProvider();

  return (
    <Select onValueChange={onValueChange} value={value ? value : ""}>
      <SelectTrigger>
        <SelectValue placeholder="Select a channelpoint" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Broadcaster</SelectLabel>
          {channelPoints?.map((point) => (
            <SelectItem key={point.id} value={point.id}>
              {point.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
