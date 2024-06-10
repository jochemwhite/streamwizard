import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PropertisElementHandler, customSettings } from "@/types/overlay";
import FlexSettings from "./flex-settings";
import GridSettings from "./grid-settings";


interface Props {
  activeStyle: customSettings;
  handleOnChanges: (e: PropertisElementHandler) => void;
}

export default function DisplaySettings({ activeStyle, handleOnChanges }: Props) {
  // This function is used to handle the display change
  function handleDisplayChange(value: string) {
    handleOnChanges({
      target: {
        id: "display",
        value,
      },
    });
  }

  return (
    <>
      <RadioGroup value={activeStyle.display ? activeStyle.display : "block"} className="flex pb-4" onValueChange={handleDisplayChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="block" id="block" />
          <Label htmlFor="display-block">Block</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="flex" id="display-flex" />
          <Label htmlFor="display-flex">Flex</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="grid" id="display-flex" />
          <Label htmlFor="display-flex">Grid</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="none" id="display-none" />
          <Label htmlFor="display-none">None</Label>
        </div>
      </RadioGroup>

      {activeStyle.display === "flex" && (
        <FlexSettings activeStyle={activeStyle} handleOnChanges={handleOnChanges} />
      )}

      {activeStyle.display === "grid" && (
        <GridSettings activeStyle={activeStyle} handleOnChanges={handleOnChanges} />
      )}
      
    </>
  );
}


