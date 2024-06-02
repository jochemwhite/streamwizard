"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OverlayTable } from "@/types/database";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import OverlayForm from "@/components/forms/overlay-form";
import Modal from "../global/modal";
import Link from "next/link";

interface Props {
  overlay: OverlayTable;
}

export default function OverlayCard({ overlay }: Props) {
  const [showModal, setShowModal] = React.useState(false);

  const setModal = (value: boolean) => setShowModal(value);

  const handleURL = () => {
    navigator.clipboard.writeText(`http://localhost:3000/overlay/${overlay.user_id}/${overlay.id}`);
    toast.info("URL copied to clipboard");
  };

  const handleProperties = () => {
    setModal(true);
  };

  const handleCopyID = () => {
    navigator.clipboard.writeText(overlay.id);
    toast.info("ID copied to clipboard");
  };

  return (
    <div>
      <Modal setModal={setModal} open={showModal}>
        <OverlayForm overlay={overlay} setModal={setModal} />
      </Modal>

      <Card key={overlay.id} className="w-96 ">
        <CardHeader>
          <img src="/mowtje.png" alt="" />
        </CardHeader>
        <CardContent>
          <CardDescription>
            <CardTitle>{overlay.name}</CardTitle>
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-right">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleURL}>Copy URL</DropdownMenuItem>
              <DropdownMenuItem onClick={handleProperties}>Properties</DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyID}>Copy ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete Overlay</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={`/dashboard/overlays/edit?overlay_id=${overlay.id}`}>
            {/* <Button variant="outline">View</Button> */}
            <Button variant="outline">Edit</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
