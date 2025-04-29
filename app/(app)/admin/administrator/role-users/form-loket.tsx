"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { UserLoketSchema, UserSchema } from "@/helpers/schemas";
import { UserLoketFormType } from "@/helpers/types";
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
import { User, UserLoket } from "@/types/user";
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

export const FormLoket = ({
  loket,
  isEdit = false,
  user,
  data,
  diclosure,
}: {
  loket: Loket[];
  isEdit?: boolean;
  user?: User;
  data?: UserLoket;
  diclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange } = diclosure;
  const Router = useRouter();

  const initialValues: UserLoketFormType = {
    id: data?.id,
    user_id: data?.user_id || user?.id || 0,
    loket_id: data?.loket_id || 0,
    aktif: data?.aktif === undefined ? true : !!data?.aktif,
  };

  const handleUserSubmit = useCallback(
    async (
      values: UserLoketFormType,
      { setFieldError }: FormikHelpers<UserLoketFormType>,
      onClose: () => void
    ) => {
      const session = await getSession();
      const method = isEdit ? "put" : "post";
      axios[method]("/api/administrator/user-akses/loket", values, {
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
            addToast({
              title: "Gagal memperbarui data!",
              description:
                "Loket yang dimasukkan sudah ada di user ini, silahkan coba loket yang lain!",
              color: "danger",
            });
            return setFieldError("loket_id", err.response?.data.message);
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
                  {isEdit ? "Edit" : "Add"} Loket for {user?.nama}
                </ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={UserLoketSchema}
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
                      return (
                        <>
                          <div className="flex flex-col w-full gap-4 mb-4">
                            <Select
                              label="Loket"
                              isInvalid={errors?.loket_id ? true : false}
                              errorMessage={errors?.loket_id}
                              selectedKeys={values?.loket_id?.toString() || ""}
                              onSelectionChange={(value) => {
                                console.log(value);
                                setFieldValue(
                                  "loket_id",
                                  Number(value.currentKey)
                                );
                              }}
                            >
                              {loket.map((loket) => (
                                <SelectItem key={loket.id.toString()}>
                                  {loket.loket}
                                </SelectItem>
                              ))}
                            </Select>
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
