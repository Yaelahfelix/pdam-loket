import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { EllipsisVertical, Pencil, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import { Form } from "./form";
import { Role } from "@/types/role";

import { useRouter } from "next/navigation";

type Props = { role: Role };

function Actions({ role }: Props) {
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <EllipsisVertical className="w-4 h-4" />
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions">
          <DropdownItem
            key="edit"
            startContent={<Pencil className="w-4 h-4" />}
            onPress={onEditOpen}
          >
            Edit
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Form
        id={role.id}
        diclosure={{ isOpen: isEditOpen, onOpenChange: onEditOpenChange }}
      />
    </>
  );
}

export default Actions;
