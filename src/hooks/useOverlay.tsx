'use client'
import { useContext } from 'react';
import { CommandContext } from '@/providers/commands-provider'; 
import type {CommandContextType} from "@/providers/commands-provider";
import { OverlayContext, OverlayContextType } from '@/providers/overlay-provider';

function UseOverlay(): OverlayContextType {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error("UseOverlay must be used within a UseOverlay");
  }
  return context;
}

export default UseOverlay;
