"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { MasterLoketSchema, UserSchema } from "@/helpers/schemas";
import { LoketFormType } from "@/helpers/types";
import { defaultErrorHandler } from "@/lib/dbQuery/defaultErrorHandler";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
import { Loket } from "@/types/loket";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import {
  addToast,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useState } from "react";

export const Form = ({
  isEdit = false,
  data,
  diclosure,
}: {
  isEdit?: boolean;
  data?: Loket;
  diclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange } = diclosure;
  const Router = useRouter();

  const initialValues: LoketFormType = {
    id: data?.id,
    kodeloket: data?.kodeloket || "",
    loket: data?.loket || "",
    aktif: !!data?.aktif,
  };

  const handleUserSubmit = useCallback(
    async (
      values: LoketFormType,
      { setFieldError }: FormikHelpers<LoketFormType>,
      onClose: () => void
    ) => {
      setIsLoading(true);
      const session = await getSession();
      const method = isEdit ? "put" : "post";
      axios[method]("/api/administrator/master-loket", values, {
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
                  {isEdit ? "Edit" : "Add"} Loket
                </ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={MasterLoketSchema}
                    onSubmit={(values, actions) =>
                      handleUserSubmit(values, actions, onClose)
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
                              label="Kode Loket"
                              type="text"
                              value={values.kodeloket}
                              isInvalid={
                                !!errors.kodeloket && !!touched.kodeloket
                              }
                              errorMessage={errors.kodeloket}
                              onChange={handleChange("kodeloket")}
                            />
                            <Input
                              variant="bordered"
                              label="Nama Loket"
                              type="text"
                              value={values.loket}
                              isInvalid={!!errors.loket && !!touched.loket}
                              errorMessage={errors.loket}
                              onChange={handleChange("loket")}
                            />

                            <div className="flex justify-end">
                              <Checkbox
                                isSelected={values.aktif}
                                className="flex-row-reverse gap-4"
                                onChange={() =>
                                  setFieldValue("aktif", !values.aktif)
                                }
                              >
                                Aktif
                              </Checkbox>
                            </div>
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
                              {isEdit ? "Edit" : "Add"} Loket
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
