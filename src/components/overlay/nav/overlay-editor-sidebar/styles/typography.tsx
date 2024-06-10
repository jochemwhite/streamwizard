import SelectCustomFont from "@/components/Typography/SelectCustomFont";
// import FontUpload from "@/components/global/font-upload";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolTipButton } from "@/components/ui/tooltip-button";
import { PropertisElementHandler, customSettings } from "@/types/overlay";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { useState } from "react";

interface Props {
  activeStyle: customSettings;
  handleOnChanges: (e: PropertisElementHandler) => void;
}

export default function TypographySettings({ activeStyle, handleOnChanges }: Props) {
  const [openFontModal, setOpenFontModal] = useState(false);

  function toggleUploadFontModal() {
    setOpenFontModal(!openFontModal);
  }

  const handleCustomFontChange = ({ name }: { name: string }) => {
    handleOnChanges({
      target: {
        id: "customFont",
        value: name,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Text Align</p>
        <Tabs
          onValueChange={(e) => {
            handleOnChanges({
              target: {
                id: "textAlign",
                value: e,
              },
            });
          }}
          value={activeStyle.textAlign}
        >
          <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
            <ToolTipButton description="Align Left">
              <TabsTrigger value="left" className="size-10 p-0 data-[state=active]:bg-muted">
                <AlignLeft size={18} />
              </TabsTrigger>
            </ToolTipButton>

            <ToolTipButton description="Align Center">
              <TabsTrigger value="center" className="size-10 p-0 data-[state=active]:bg-muted">
                <AlignCenter size={18} />
              </TabsTrigger>
            </ToolTipButton>

            <ToolTipButton description="Align Right">
              <TabsTrigger value="right" className="size-10 p-0 data-[state=active]:bg-muted">
                <AlignRight size={18} />
              </TabsTrigger>
            </ToolTipButton>

  

            <ToolTipButton description="Justify">
              <TabsTrigger value="justify" className="size-10 p-0 data-[state=active]:bg-muted">
                <AlignJustify size={18} />
              </TabsTrigger>
            </ToolTipButton>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Font Family</p>
          <AlertDialog open={openFontModal}>
            <AlertDialogTrigger asChild>
              <button className="text-muted-foreground" onClick={toggleUploadFontModal}>
                Upload Font
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upload Font</AlertDialogTitle>
                {/* <FontUpload toggleModal={toggleUploadFontModal} /> */}
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <SelectCustomFont />
      </div>
      <div className="flex gap-4">
        <div>
          <Label className="text-muted-foreground">Weight</Label>
          <Select
            onValueChange={(e) => {
              handleOnChanges({
                target: {
                  id: "font-weight",
                  value: e,
                },
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Font Weights</SelectLabel>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="lighter">Ligth</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-muted-foreground">Size</Label>
          <Input placeholder="px" id="fontSize" onChange={handleOnChanges} value={activeStyle.fontSize} />
        </div>
      </div>
    </>
  );
}
