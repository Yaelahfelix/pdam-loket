"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { ComboboxPelanggan } from "@/components/combobox/pelanggan";
import { MasterKolektifSchema } from "@/helpers/schemas";
import { KolektifFormType, KolektifPelangganFormType } from "@/helpers/types";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
import { Kolektif, KolektifPelanggan } from "@/types/kolektif";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { FileArchive, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

export const FormPelanggan = ({
  isEdit = false,
  kolektif_id,
  data,
  diclosure,
}: {
  isEdit?: boolean;
  kolektif_id?: number;
  data?: KolektifPelanggan;
  diclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange } = diclosure;
  const Router = useRouter();
  const initialValues: KolektifPelangganFormType = {
    kolektif_id: data?.kolektif_id || kolektif_id || 0,
    no_pelanggan: "",
  };

  const handleSubmit = useCallback(
    async (
      values: KolektifPelangganFormType,
      { setFieldError }: FormikHelpers<KolektifPelangganFormType>,
      onClose: () => void
    ) => {
      if (values.no_pelanggan === "" || !values.no_pelanggan) {
        return addToast({
          title: "Gagal memperbarui data!",
          color: "danger",
          description: "Kamu belum memilih pelanggan!",
        });
      }
      setIsLoading(true);
      const session = await getSession();
      axios["put"]("/api/administrator/master-kolektif/pelanggan", values, {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      })
        .then((res) => {
          addToast({ color: "success", title: res.data.message });
          onClose();
          Router.refresh();
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
          if (err.status === 409) {
            return addToast({
              title: "Gagal memperbarui data!",
              color: "danger",
              description: err.response?.data.message,
            });
          }

          addToast({
            title: "Gagal memperbarui data!",
            ...errToast_INTERNALSERVER,
          });
          addToast({
            title: "Gagal memperbarui data!",
            ...errToast_INTERNALSERVER,
          });
        })
        .finally(() => setIsLoading(false));
    },
    []
  );
  return (
    <div>
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {isEdit ? "Edit" : "Add"} Pelanggan
                </ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) =>
                      handleSubmit(values, actions, onClose)
                    }
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleSubmit,
                      setFieldValue,
                    }) => {
                      return (
                        <>
                          <div className="flex flex-col w-full gap-4 mb-4">
                            <ComboboxPelanggan
                              handler={(value) => {
                                setFieldValue("no_pelanggan", value);
                              }}
                            />
                          </div>
                          <div className="flex justify-end gap-5 pb-5">
                            <Button
                              color="danger"
                              variant="flat"
                              onPress={onClose}
                            >
                              Close
                            </Button>
                            <Button
                              color="primary"
                              onPress={() => handleSubmit()}
                              type="submit"
                              isLoading={isLoading}
                              isDisabled={
                                values.no_pelanggan === "" ||
                                !values.no_pelanggan
                              }
                            >
                              {isEdit ? "Edit" : "Add"} Pelanggan
                            </Button>
                          </div>
                        </>
                      );
                    }}
                  </Formik>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
