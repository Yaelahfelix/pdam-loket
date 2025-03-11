import { Accordion, AccordionItem } from "@heroui/react";
import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex gap-2 flex-col">
      <Accordion>
        <AccordionItem
          key={title}
          aria-label={title}
          title={title}
          className="capitalize"
        >
          {children}
        </AccordionItem>
      </Accordion>
    </div>
  );
};
