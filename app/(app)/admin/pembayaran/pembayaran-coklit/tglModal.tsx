import { deleteAuthCookie } from "@/actions/auth.action";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  handler: (val: boolean) => void;
};

const TglModal = ({ isOpen, onOpenChange, handler }: Props) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();
  const submitHandler = async (onClose: () => void) => {
    setIsLoading(true);
    setError("");
    const session = await getSession();
    axios["post"](
      "/api/settings/pass-admin",
      {
        password: value,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      }
    )
      .then((res) => {
        if (res.data.isValid) {
          addToast({ color: "success", title: "Berhasil membuka akses!" });
          handler(true);
          onClose();
        } else {
          setError("Password salah!");
          addToast({
            color: "danger",
            title: "Gagal membuka akses!",
            description: "Password tidak sesuai!",
          });
        }
      })
      .catch(async (err: AxiosError<ErrorResponse>) => {
        if (err.status === 401) {
          await deleteAuthCookie();
          await deleteSidebar();
          addToast({
            title: "Gagal memperbarui data!",
            ...errToast_UNAUTHORIZED,
          });
          return Router.replace("/login");
        }
        if (err.status !== 500) {
          return addToast({
            title: "Gagal memperbarui data!",
            description: err.response?.data.message,
            color: "danger",
          });
        }
        addToast({
          title: "Gagal memperbarui data!",
          ...errToast_INTERNALSERVER,
        });
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Masukkan password admin
            </ModalHeader>
            <ModalBody>
              <Input
                variant="bordered"
                label="Password Admin"
                type="text"
                value={value}
                isInvalid={!!error}
                errorMessage={error}
                isDisabled={isLoading}
                onValueChange={(val) => setValue(val)}
                description="Masukkan password admin untuk membuka akses ngedit tanggal"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose} variant="light">
                Tutup
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  submitHandler(onClose);
                }}
                isDisabled={isLoading}
              >
                Buka Akses
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TglModal;
