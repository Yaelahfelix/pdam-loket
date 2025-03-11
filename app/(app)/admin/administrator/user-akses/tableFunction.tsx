import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import React from "react";
import { Create } from "./create";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";

function TableFunction() {
  return (
    <div className="flex justify-between flex-wrap gap-4 items-center">
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        <Input
          classNames={{
            input: "w-full",
            mainWrapper: "w-full",
          }}
          placeholder="Cari"
        />
      </div>
      <div className="flex flex-row gap-3.5 flex-wrap">
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button
              color="primary"
              startContent={<AdjustmentsVerticalIcon className="w-5" />}
            >
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">Popover Content</div>
              <div className="text-tiny">This is the popover content</div>
            </div>
          </PopoverContent>
        </Popover>
        <Create />
        <Button color="primary" startContent={<ExportIcon />}>
          Export to CSV
        </Button>
      </div>
    </div>
  );
}

export default TableFunction;
