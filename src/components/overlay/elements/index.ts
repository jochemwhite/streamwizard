import { ElementSidebar } from "@/types/overlay";
import * as BasicElements from "./basicElements";

const allElements = {
  ...BasicElements,
  
};

const elements: ElementSidebar<any>[] = Object.values(allElements).map((element) => {
  return element;
});

export { elements };
