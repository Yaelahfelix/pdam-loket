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
import { useRoleStore } from "@/store/role";
import { User } from "@/types/user";
import ModalDeleteRowTable from "@/components/modal/deleteRowTable";
import axios, { AxiosError } from "axios";
import { getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import { FormLoket } from "./form-loket";
import { Loket } from "@/types/loket";
import { useLoketStore } from "@/store/userloket";

type Props = { user: User };

function Actions({ user }: Props) {
  const { roles } = useRoleStore();
  const { loket } = useLoketStore();
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

  const {
    isOpen: isLoketOpen,
    onOpen: onLoketOpen,
    onOpenChange: onLoketOpenChange,
  } = useDisclosure();

  const deleteHandler = async () => {
    setIsLoading(true);
    const session = await getSession();
    axios
      .delete("/api/administrator/user-akses?id=" + user.id, {
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
            key="tambah_loket"
            startContent={<Plus className="w-4 h-4" />}
            onPress={onLoketOpen}
          >
            Tambah Loket
          </DropdownItem>
          <DropdownItem
            key="edit"
            startContent={<Pencil className="w-4 h-4" />}
            onPress={onEditOpen}
          >
            Edit
          </DropdownItem>
          <DropdownItem
            key="hapus"
            startContent={<Trash className="w-4 h-4" />}
            onPress={onDeleteOpen}
            color="danger"
          >
            Hapus
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <FormLoket
        diclosure={{ isOpen: isLoketOpen, onOpenChange: onLoketOpenChange }}
        loket={loket}
        user={user}
      />
      <Form
        user={user}
        isEdit={true}
        roles={roles}
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
