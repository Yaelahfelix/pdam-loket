"use client";

import {
  Button,
  Checkbox,
  DateRangePicker,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { FormEditIcon } from "./form-editicon";

function TableFunction({}: {}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex justify-between flex-wrap gap-4 items-center">
      <Button
        color="primary"
        startContent={<AdjustmentsVerticalIcon className="w-5" />}
        onPress={onOpen}
      >
        Edit Sidebar Icon
      </Button>
      <FormEditIcon diclosure={{ isOpen, onOpenChange }} />
    </div>
  );
}

export default TableFunction;
