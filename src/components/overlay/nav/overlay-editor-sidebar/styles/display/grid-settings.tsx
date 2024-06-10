import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PropertisElementHandler, customSettings } from "@/types/pageEditor";
import { useEffect, useState } from "react";

interface Props {
  activeStyle: customSettings;
  handleOnChanges: (e: PropertisElementHandler) => void;
}

const regex = /repeat\((\d+),/;

function extractRepeatValue(cssValue: string | undefined | null): number {
  if (!cssValue) {
    return 1;
  }

  const regex = /repeat\((\d+),/;

  // Attempt to match the regex pattern in the input string
  const match = cssValue.match(regex);

  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  return 1;
}

export default function GridSettings({ activeStyle, handleOnChanges }: Props) {
  const [maxElements, setMaxElements] = useState<number>(1);

  const handleMaxElementsChange = (value: number) => {
    handleOnChanges({
      target: {
        id: "gridTemplateColumns",
        value: `repeat(${value}, minmax(0, 1fr))`,
      },
    });
  };

  const handleGridGapChange = (value: number) => {
    handleOnChanges({
      target: {
        id: "gap",
        value: `${value}px`,
      },
    });
  };

  useEffect(() => {
    console.log(activeStyle);
  }, [activeStyle]);


  useEffect(() => {
    console.log(activeStyle.gridTemplateColumns);

    setMaxElements(extractRepeatValue(activeStyle.gridTemplateColumns?.toString()));
  }, [activeStyle.gridTemplateColumns]);

  return (
    <>
      <Label className="text-muted-foreground">Max elements in a row</Label>
      <div className="mt-2 flex">
        <Slider onValueChange={(value) => handleMaxElementsChange(value[0])} value={[maxElements]} max={12} min={1} />
        <span className="ml-2">
          <Input className="w-12 h-8" value={maxElements} />
        </span>
      </div>
      <Label className="text-muted-foreground">Grid Gap</Label>
      <div className="mt-2 flex">
        <Slider onValueChange={(value) => handleGridGapChange(value[0])} value={[activeStyle.gap ? parseInt(activeStyle.gap.toString().replace("px", ""), 10) : 0]} max={100} min={1} />
        <span className="ml-2">
          <Input className="w-12 h-8" value={activeStyle.gap} />
        </span>
      </div>
    </>
  );
}
