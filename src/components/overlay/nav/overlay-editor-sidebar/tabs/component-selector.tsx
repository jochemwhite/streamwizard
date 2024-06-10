import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { elements } from "@/components/overlay/elements";
import PlaceHolder from "@/components/overlay/elements/placeholder";
import { ElementSidebar } from "@/types/overlay";

export default function ComponentsTab() {
  const elementsByGroup = elements.reduce((acc: { [key: string]: ElementSidebar<any>[] }, element) => {
    const { group } = element;

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(element);
    return acc;
  }, {});

  return (
    <Accordion type="multiple" className="w-full">
      {Object.entries(elementsByGroup).map(([groupName, elements]) => (
        <AccordionItem key={groupName} value={groupName} className="px-6 py-0 border-y-[1px]">
          <AccordionTrigger className="!no-underline capitalize">{groupName}</AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2">
            {elements.map((element, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <PlaceHolder Type={element.type} Icon={element.icon} />
                <span className="text-muted-foreground">{element.name}</span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
