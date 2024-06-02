import * as React from "react";

import { Slider } from "@/components/ui/slider";

export interface InputProps {
  label: string;
  onChange: (value: number) => void;
  value: number;
  minValue?: number;
  maxValue?: number;
}

const CustomSlider = React.forwardRef<HTMLInputElement, InputProps>(({ label, onChange, value, maxValue, minValue }, ref) => {
  const [inputValue, setInputValue] = React.useState<number | string>(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value === "" || +value === 0) {
      setInputValue("");
      onChange(0);
    }

    onChange(+value);
    setInputValue(value);
  };

  return (
    <div>
      <div className="flex justify-between">
        <label>{label}</label>
        <input
          type="number"
          pattern="\d*"
          value={inputValue}
          onChange={handleInputChange}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-1 bg-transparent border rounded"
          style={{ width: `${inputValue.toString().length + 1}ch` }}
        />
      </div>
      <div className="mt-2">
        <Slider
          value={[+value!]}
          onValueChange={(value) => {
            onChange(value[0]);
            setInputValue(value[0]);
          }}
          min={minValue}
          max={maxValue}
        />
      </div>
    </div>
  );
});
CustomSlider.displayName = "Input";

export { CustomSlider };
