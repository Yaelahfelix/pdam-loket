"use client";

import {
  Button,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { Role } from "@/types/role";
import useUpdateQuery from "@/components/hooks/useUpdateQuery";
import { RotateCw } from "lucide-react";
import { Form } from "./form";
import { useRoleStore } from "@/store/role";
import { useDebounce } from "use-debounce";

function TableFunction({ limit }: { limit: string }) {
  const [query, setQuery] = useState("");
  const [qDebounce] = useDebounce(query, 300);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const updateQuery = useUpdateQuery();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { setRoles } = useRoleStore();

  useEffect(() => {
    if (qDebounce) {
      updateQuery({ q: qDebounce });
    } else {
      updateQuery({ q: null });
    }
  }, [qDebounce]);

  return (
    <div className="flex justify-between flex-wrap gap-4 items-center">
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        <Input
          value={query}
          onValueChange={setQuery}
          classNames={{
            input: "w-full",
            mainWrapper: "w-full",
          }}
          placeholder="Cari loket..."
        />
      </div>
      <div className="flex flex-row gap-3.5 flex-wrap">
        <Button onPress={onOpen} color="primary">
          Add Loket
        </Button>
        <Form diclosure={{ isOpen, onOpenChange }}></Form>
      </div>
    </div>
  );
}

export default TableFunction;
