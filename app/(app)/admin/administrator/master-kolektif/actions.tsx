import {
  addToast,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { EllipsisVertical, Pencil, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import { Form } from "./form";
import ModalDeleteRowTable from "@/components/modal/deleteRowTable";
import axios, { AxiosError } from "axios";
import { getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import { Kolektif } from "@/types/kolektif";
import { FormPelanggan } from "./form-pelanggan";

type Props = { kolektif: Kolektif };

function Actions({ kolektif }: Props) {
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
    isOpen: isKolektifOpen,
    onOpen: onKolektifOpen,
    onOpenChange: onKolektifOpenChange,
  } = useDisclosure();

  const deleteHandler = async () => {
    setIsLoading(true);
    const session = await getSession();
    axios
      .delete("/api/administrator/master-kolektif?id=" + kolektif.id, {
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
            key="add_pelanggan"
            startContent={<Plus className="w-4 h-4" />}
            onPress={onKolektifOpen}
          >
            Tambah Pelanggan
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
      <Form
        data={kolektif}
        isEdit={true}
        diclosure={{ isOpen: isEditOpen, onOpenChange: onEditOpenChange }}
      />
      <FormPelanggan
        kolektif_id={kolektif.id}
        diclosure={{
          isOpen: isKolektifOpen,
          onOpenChange: onKolektifOpenChange,
        }}
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
