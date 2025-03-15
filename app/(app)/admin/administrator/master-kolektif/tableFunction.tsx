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
import useUpdateQuery from "@/components/hooks/useUpdateQuery";
import { Form } from "./form";

function TableFunction({ limit }: { limit: string }) {
  const [query, setQuery] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const updateQuery = useUpdateQuery();

  useEffect(() => {
    if (query) {
      updateQuery({ q: query });
    } else {
      updateQuery({ q: null });
    }
  }, [query]);

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
          placeholder="Cari no/nama kolektif..."
        />
      </div>
      <div className="flex flex-row gap-3.5 flex-wrap">
        <Button onPress={onOpen} color="primary">
          Add Kolektif
        </Button>
        <Form diclosure={{ isOpen, onOpenChange }}></Form>
      </div>
    </div>
  );
}

export default TableFunction;
