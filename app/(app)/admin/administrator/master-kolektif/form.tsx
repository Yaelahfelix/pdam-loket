"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { MasterKolektifSchema } from "@/helpers/schemas";
import { KolektifFormType } from "@/helpers/types";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
import { Kolektif } from "@/types/kolektif";
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

export const Form = ({
  isEdit = false,
  data,
  diclosure,
}: {
  isEdit?: boolean;
  data?: Kolektif;
  diclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange } = diclosure;
  const [noKolektif, setNoKolektif] = useState("");
  const Router = useRouter();

  const initialValues: KolektifFormType = {
    id: data?.id,
    no_kolektif: data?.no_kolektif || noKolektif,
    nama: data?.nama || "",
    telp: data?.telp || "",
  };

  const getNoKolektif = async () => {
    const session = await getSession();
    const res = await axios.get(
      "/api/administrator/master-kolektif/generate-no-kolektif",
      {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      }
    );
    const noKolektif = res.data.data.nomor_kolektif;
    setNoKolektif(noKolektif);
  };
  useEffect(() => {
    if (!isEdit) {
      getNoKolektif();
    }
  }, []);

  const handleSubmit = useCallback(
    async (
      values: KolektifFormType,
      { setFieldError }: FormikHelpers<KolektifFormType>,
      onClose: () => void
    ) => {
      setIsLoading(true);
      const session = await getSession();
      const method = isEdit ? "put" : "post";
      axios[method]("/api/administrator/master-kolektif", values, {
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
          if (err.status !== 500) {
            return setFieldError("username", err.response?.data.message);
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
                  {isEdit ? "Edit" : "Add"} Kolektif
                </ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={MasterKolektifSchema}
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
                      console.log(errors);
                      return (
                        <>
                          <div className="flex flex-col w-full gap-4 mb-4">
                            <Input
                              variant="bordered"
                              label="Nomor Kolektif"
                              type="text"
                              isRequired
                              disabled
                              value={values.no_kolektif}
                              isInvalid={
                                !!errors.no_kolektif && !!touched.no_kolektif
                              }
                              errorMessage={errors.no_kolektif}
                              onChange={handleChange("no_kolektif")}
                              endContent={
                                <Button
                                  color="primary"
                                  isLoading={isLoading}
                                  isDisabled={isEdit}
                                  onPress={async () => {
                                    try {
                                      setIsLoading(true);
                                      await getNoKolektif();
                                      addToast({
                                        title:
                                          "Berhasil memperbarui nomor kolektif",
                                        color: "success",
                                      });
                                    } catch (err) {
                                      addToast({
                                        title:
                                          "Gagal mendapatkan nomor kolektif",
                                        color: "danger",
                                      });
                                    } finally {
                                      setIsLoading(false);
                                    }
                                  }}
                                >
                                  <RotateCw className="w-5 h-5" />
                                </Button>
                              }
                            />
                            <Input
                              variant="bordered"
                              label="Nama Kolektif"
                              type="text"
                              isRequired
                              value={values.nama}
                              isInvalid={!!errors.nama && !!touched.nama}
                              errorMessage={errors.nama}
                              onChange={handleChange("nama")}
                            />
                            <Input
                              variant="bordered"
                              label="No Telp"
                              type="text"
                              value={values.telp}
                              isInvalid={!!errors.telp && !!touched.telp}
                              errorMessage={errors.telp}
                              onChange={handleChange("telp")}
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
                            >
                              {isEdit ? "Edit" : "Add"} Kolektif
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
