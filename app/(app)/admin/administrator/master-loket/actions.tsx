import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { Form } from "./form";
import { Role } from "@/types/role";
import { useRoleStore } from "@/store/role";
import { User } from "@/types/user";
import ModalDeleteRowTable from "@/components/modal/deleteRowTable";
import axios, { AxiosError } from "axios";
import { getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import { Loket } from "@/types/loket";

type Props = { loket: Loket };

function Actions({ loket }: Props) {
  const { roles } = useRoleStore();
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const deleteHandler = async () => {
    setIsLoading(true);
    const session = await getSession();
    axios
      .delete("/api/administrator/master-loket?id=" + loket.id, {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      })
      .then((res) => {
        addToast({ color: "success", title: res.data.message });
        onDeleteClose();
        Router.refresh();
      })
      .catch((err: AxiosError<ErrorResponse>) => {
        addToast({
          title: "Gagal menghapus data!",
          description: err.response?.data.message,
          color: "danger",
        });
      })
      .finally(() => setIsLoading(false));
  };
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
          <DropdownItem
            key="edit"
            startContent={<Trash className="w-4 h-4" />}
            onPress={onDeleteOpen}
            color="danger"
          >
            Hapus
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Form
        data={loket}
        isEdit={true}
        diclosure={{ isOpen: isEditOpen, onOpenChange: onEditOpenChange }}
      />
      <ModalDeleteRowTable
        isLoading={isLoading}
        onDelete={deleteHandler}
        diclosure={{ isOpen: isDeleteOpen, onOpenChange: onDeleteOpenChange }}
      />
    </>
  );
}

export default Actions;
