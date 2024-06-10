import { CustomColorPicker as ColorPicker } from "@/components/global/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertisElementHandler, customSettings } from "@/types/overlay";
import { AlignVerticalJustifyCenter, ChevronsLeftRightIcon, LucideImage } from "lucide-react";

interface Props {
  activeStyle: customSettings;
  handleOnChanges: (e: PropertisElementHandler) => void;
}

export default function DecorationsSettings({ activeStyle, handleOnChanges }: Props) {
  const defaultValueOpacity = [
    typeof activeStyle.opacity === "number" ? activeStyle.opacity : parseFloat((activeStyle.opacity ?? "0").replace("%", "")) ?? 0,
  ];
  const defulValueBorderRaidus = [
    typeof activeStyle.borderRadius === "number" ? activeStyle.borderRadius : parseFloat((activeStyle.borderRadius ?? "0").replace("%", "")) ?? 0,
  ];

  const onChangeColorBg = (color: string) => {
    handleOnChanges({
      target: {
        id: "backgroundColor",
        value: color,
      },
    });
  };

  return (
    <>
      <div>
        <Label className="text-muted-foreground">Opacity</Label>
        <div className="flex items-center justify-end">
          <small className="p-2">{defaultValueOpacity}%</small>
        </div>
        <Slider
          onValueChange={(e) => {
            handleOnChanges({
              target: {
                id: "opacity",
                value: `${e[0]}%`,
              },
            });
          }}
          defaultValue={defaultValueOpacity}
          max={100}
          step={1}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Border Radius</Label>
        <div className="flex items-center justify-end">
          <small>{defulValueBorderRaidus}px</small>
        </div>
        <Slider
          onValueChange={(e) => {
            handleOnChanges({
              target: {
                id: "borderRadius",
                value: `${e[0]}px`,
              },
            });
          }}
          defaultValue={defulValueBorderRaidus}
          max={100}
          step={1}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Background Color</Label>
        <div className="flex border-[1px] rounded-md overflow-clip">
          <ColorPicker color={activeStyle.backgroundColor} onChange={onChangeColorBg}>
            <div
              className="w-12 cursor-pointer"
              style={{
                backgroundColor: activeStyle.backgroundColor,
              }}
            />
          </ColorPicker>
          <Input
            placeholder="#HFI245"
            className="!border-y-0 rounded-none !border-r-0 mr-2"
            id="backgroundColor"
            onChange={handleOnChanges}
            value={activeStyle.backgroundColor}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Background Image</Label>
        <div className="flex border-[1px] rounded-md overflow-clip">
          <div
            className="w-12"
            style={{
              backgroundImage: activeStyle.backgroundImage,
            }}
          />
          <Input
            placeholder="url()"
            className="!border-y-0 rounded-none !border-r-0 mr-2"
            id="backgroundImage"
            onChange={handleOnChanges}
            value={activeStyle.backgroundImage}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Background Video</Label>
        <div className="flex border-[1px] rounded-md overflow-clip">
          <div
            className="w-12"
            style={{
              backgroundImage: activeStyle.backgroundVideo,
            }}
          />
          <Input
            placeholder="url()"
            className="!border-y-0 rounded-none !border-r-0 mr-2"
            id="backgroundVideo"
            onChange={handleOnChanges}
            value={activeStyle.backgroundVideo}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Image Position</Label>
        <Tabs
          onValueChange={(e) => {
            handleOnChanges({
              target: {
                id: "backgroundSize",
                value: e,
              },
            });
          }}
          value={activeStyle.backgroundSize?.toString()}
        >
          <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
            <TabsTrigger value="cover" className="size-10 p-0 data-[state=active]:bg-muted">
              <ChevronsLeftRightIcon size={18} />
            </TabsTrigger>
            <TabsTrigger value="contain" className="size-10 p-0 data-[state=active]:bg-muted">
              <AlignVerticalJustifyCenter size={18} />
            </TabsTrigger>
            <TabsTrigger value="auto" className="size-10 p-0 data-[state=active]:bg-muted">
              <LucideImage size={18} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
