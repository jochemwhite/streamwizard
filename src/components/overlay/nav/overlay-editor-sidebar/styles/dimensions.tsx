import React from "react";

import SelectCustomFont from "@/components/Typography/SelectCustomFont";
import { CustomColorPicker as ColorPicker } from "@/components/global/color-picker";
import FontUpload from "@/components/global/font-upload";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useStyles from "@/hooks/useStyles";
import { PropertisElementHandler, Styles, customSettings } from "@/types/pageEditor";
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  Columns,
  LucideImage,
  Rows,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import useEditor from "@/hooks/useEditor";

interface Props {
  activeStyle: customSettings;
  handleOnChanges: (e: PropertisElementHandler) => void;
}

export default function DimensionsSettings({ activeStyle, handleOnChanges }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Height</Label>
              <Input id="height" placeholder="px" onChange={handleOnChanges} value={activeStyle.height} />
            </div>
            <div>
              <Label className="text-muted-foreground">Width</Label>
              <Input placeholder="px" id="width" onChange={handleOnChanges} value={activeStyle.width} />
            </div>
          </div>
        </div>
        <p>Margin px</p>
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Top</Label>
              <Input id="marginTop" placeholder="px" onChange={handleOnChanges} value={activeStyle.marginTop || ""} />
            </div>
            <div>
              <Label className="text-muted-foreground">Bottom</Label>
              <Input id="marginBottom" placeholder="px" onChange={handleOnChanges} value={activeStyle.marginBottom} />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Left</Label>
              <Input id="marginLeft" placeholder="px" onChange={handleOnChanges} value={activeStyle.marginLeft} />
            </div>
            <div>
              <Label className="text-muted-foreground">Right</Label>
              <Input id="marginRight" placeholder="px" onChange={handleOnChanges} value={activeStyle.marginRight || ""} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p>Padding px</p>
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Top</Label>
              <Input placeholder="px" id="paddingTop" onChange={handleOnChanges} value={activeStyle.paddingTop} />
            </div>
            <div>
              <Label className="text-muted-foreground">Bottom</Label>
              <Input placeholder="px" id="paddingBottom" onChange={handleOnChanges} value={activeStyle.paddingBottom} />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Left</Label>
              <Input placeholder="px" id="paddingLeft" onChange={handleOnChanges} value={activeStyle.paddingLeft} />
            </div>
            <div>
              <Label className="text-muted-foreground">Left</Label>
              <Input placeholder="px" id="paddingRight" onChange={handleOnChanges} value={activeStyle.paddingRight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
