"use client";

import ModalDeleteRowTable from "@/components/modal/deleteRowTable";
import { getSession } from "@/lib/session";
import { ErrorResponse } from "@/types/axios";
import { User, UserLoket } from "@/types/user";
import {
  Accordion,
  AccordionItem,
  addToast,
  Alert,
  Divider,
  useDisclosure,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { Pencil, Trash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormLoket } from "./form-loket";
import { useLoketStore } from "@/store/userloket";
import { Role } from "@/types/role";

export const TableDetail = ({ role }: { role: Role }) => {
  const Router = useRouter();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [editData, setEditData] = useState<UserLoket>();
  const { loket } = useLoketStore();
  const {
    isOpen: isLoketOpen,
    onOpen: onLoketOpen,
    onOpenChange: onLoketOpenChange,
  } = useDisclosure();
  const deleteHandler = async () => {
    setIsLoading(true);
    const session = await getSession();
    axios
      .delete("/api/administrator/role-akses/loket?id=" + selectedId, {
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
        <h4 className="font-semibold">Detail Loket User</h4>
      </div>
      <Divider className="my-3" />
      <Alert
        color="warning"
        title="Petunjuk"
        description="Warna hijau pada kolom loket berarti loket aktif dan warna merah pada kolom loket berarti loket tidak aktif"
      />
      <div className="flex gap-3 flex-wrap justify-around mt-3">
        {/* {user.loket_array?.map((loket) => (
          <Alert
            color={loket.aktif ? "success" : "danger"}
            title={`${loket.loket}`}
            hideIcon
            className="max-w-fit"
            endContent={
              <div className="flex gap-3 items-center h-full justify-center ml-3">
                <Trash2
                  className="text-red-500 hover:text-red-600 transition-colors w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setSelectedId(loket.id);
                    onDeleteOpen();
                  }}
                />
                <Pencil
                  className="text-yellow-500 hover:text-yellow-600 transition-colors w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setEditData(loket);
                    onLoketOpen();
                  }}
                />
              </div>
            }
          />
        ))} */}
      </div>
    </div>
  );
};

export const canTableDetail = (role: Role) => {
  // return user.loket_array?.length !== 0 && user.loket_array !== null;
  return false;
};
