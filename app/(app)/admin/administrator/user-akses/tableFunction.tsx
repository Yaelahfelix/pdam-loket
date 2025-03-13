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

function TableFunction({
  roles,
  filter,
  limit,
}: {
  roles: Role[];
  filter: {
    is_user_active: boolean | null;
    is_user_ppob: boolean | null;
    is_user_timtagih: boolean | null;
  };
  limit: string;
}) {
  const [query, setQuery] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const updateQuery = useUpdateQuery();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { setRoles } = useRoleStore();

  useEffect(() => {
    if (query) {
      updateQuery({ q: query });
    } else {
      updateQuery({ q: null });
    }
  }, [query]);

  useEffect(() => {
    setRoles(roles);
  }, []);
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
          placeholder="Cari username/nama.."
        />
      </div>
      <div className="flex flex-row gap-3.5 flex-wrap">
        <Popover
          placement="bottom"
          showArrow={true}
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        >
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
              <div className="text-small font-bold text-center">Filter</div>
              <div className="flex flex-col gap-3 my-3">
                <Checkbox
                  isSelected={filter.is_user_active || false}
                  onValueChange={(val) => {
                    updateQuery({
                      is_user_active: val ? "true" : "false",
                      page: 1,
                      limit,
                    });
                  }}
                  size="sm"
                >
                  User Aktif
                </Checkbox>

                <Checkbox
                  isSelected={filter.is_user_ppob || false}
                  onValueChange={(val) => {
                    updateQuery({
                      is_user_ppob: val ? "true" : "false",
                      page: 1,
                      limit,
                    });
                  }}
                  size="sm"
                >
                  User PPOB
                </Checkbox>
                <Checkbox
                  isSelected={filter.is_user_timtagih || false}
                  onValueChange={(val) => {
                    updateQuery({
                      is_user_timtagih: val ? "true" : "false",
                      page: 1,
                      limit,
                    });
                  }}
                  size="sm"
                >
                  User Tim Tagih
                </Checkbox>
              </div>
              <div className="mt-3">
                <Button
                  variant="solid"
                  color="primary"
                  className="w-full"
                  startContent={<RotateCw className="w-5 h-5" />}
                  onPress={() => {
                    updateQuery({
                      is_user_active: null,
                      is_user_ppob: null,
                      is_user_timtagih: null,
                      page: 1,
                      limit,
                    });
                    setIsFilterOpen(false);
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button onPress={onOpen} color="primary">
          Add User
        </Button>
        <Form roles={roles} diclosure={{ isOpen, onOpenChange }}></Form>
        <Button color="primary" startContent={<ExportIcon />}>
          Export to CSV
        </Button>
      </div>
    </div>
  );
}

export default TableFunction;
