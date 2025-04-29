import {
  addToast,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { FormPPN } from "./form-ppn";
import { PPNSettings } from "@/types/settings";
import ModalDeleteRowTable from "@/components/modal/deleteRowTable";
import { getSession } from "@/lib/session";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/axios";

type Props = { data: PPNSettings };

const PPNActions = ({ data }: Props) => {
  const {
    onOpen: onPPNEditOpen,
    onOpenChange: onPPNEditOpenChange,
    isOpen: onPPNEditIsOpen,
  } = useDisclosure();

  const Router = useRouter();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);

  const deleteHandler = async () => {
    setIsLoading(true);
    const session = await getSession();
    axios
      .delete("/api/settings/ppn?id=" + data.id, {
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
            onPress={onPPNEditOpen}
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
      <FormPPN
        diclosure={{
          isOpen: onPPNEditIsOpen,
          onOpenChange: onPPNEditOpenChange,
        }}
        isEdit={true}
        data={data}
      />
      <ModalDeleteRowTable
        isLoading={isLoading}
        onDelete={deleteHandler}
        diclosure={{ isOpen: isDeleteOpen, onOpenChange: onDeleteOpenChange }}
      />
    </>
  );
};

export default PPNActions;
