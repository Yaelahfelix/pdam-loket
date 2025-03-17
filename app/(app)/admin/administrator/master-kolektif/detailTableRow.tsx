"use client";

import { Kolektif, KolektifPelanggan } from "@/types/kolektif";
import {
  Accordion,
  AccordionItem,
  addToast,
  Alert,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormPelanggan } from "./form-pelanggan";
import { getSession } from "@/lib/session";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import ModalDeleteRowTable from "@/components/modal/deleteRowTable";

export const TableDetail = ({ kolektif }: { kolektif: Kolektif }) => {
  const {
    isOpen: isKolektifOpen,
    onOpen: onKolektifOpen,
    onOpenChange: onKolektifOpenChange,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [editData, setEditData] = useState<KolektifPelanggan>();
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
      .delete("/api/administrator/master-kolektif/pelanggan?id=" + selectedId, {
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
    <div className="p-4">
      <div>
        <h4 className="font-semibold">Detail Data Kolektif Pelanggan</h4>
      </div>
      <Divider className="my-3" />
      <div className="flex gap-3 flex-wrap justify-around">
        {kolektif.pelanggan_array?.map((pelanggan) => (
          <Alert
            color="primary"
            title={pelanggan.no_pelanggan}
            description={pelanggan.nama_pelanggan}
            hideIcon
            className="max-w-fit"
            endContent={
              <div className="flex gap-3 items-center h-full justify-center ml-3">
                <Trash2
                  className="text-red-500 hover:text-red-600 transition-colors w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setSelectedId(pelanggan.id);
                    onDeleteOpen();
                  }}
                />
                {/* <Pencil
                  className="text-yellow-500 hover:text-yellow-600 transition-colors w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setEditData(pelanggan);
                    onKolektifOpen();
                  }}
                /> */}
              </div>
            }
          />
        ))}
      </div>

      {/* <FormPelanggan
        diclosure={{
          isOpen: isKolektifOpen,
          onOpenChange: onKolektifOpenChange,
        }}
      /> */}
      <ModalDeleteRowTable
        isLoading={isLoading}
        onDelete={deleteHandler}
        diclosure={{ isOpen: isDeleteOpen, onOpenChange: onDeleteOpenChange }}
      />
    </div>
  );
};

export const canTableDetail = (kolektif: Kolektif) => {
  return (
    kolektif.pelanggan_array?.length !== 0 && kolektif.pelanggan_array !== null
  );
};
