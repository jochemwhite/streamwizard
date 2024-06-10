"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ReactNode, useEffect, useState } from "react";
import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";

type Props = {
  color?: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

export const CustomColorPicker = ({ onChange, color, children }: Props) => {
  const [colorValue, setColorValue] = useState<string | undefined>(color);

  const handleChange = (value: string) => {
    setColorValue(value);
  };

  useEffect(() => {
    if(colorValue === undefined) return;
    onChange(colorValue);
  }, [colorValue]);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <ColorPicker value={colorValue} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  );
};
