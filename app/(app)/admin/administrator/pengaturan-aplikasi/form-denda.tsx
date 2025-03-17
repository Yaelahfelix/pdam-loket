"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { UserSchema } from "@/helpers/schemas";
import { UserFormType } from "@/helpers/types";
import { defaultErrorHandler } from "@/lib/dbQuery/defaultErrorHandler";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
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
  roles,
  isEdit = false,
  user,
  diclosure,
}: {
  roles: Role[];
  isEdit?: boolean;
  user?: User;
  diclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange } = diclosure;
  const Router = useRouter();

  const initialValues: UserFormType = {
    id: user?.id,
    username: user?.username || "",
    password: user?.username ? "Tidak bisa diedit" : "",
    nama: user?.nama || "",
    jabatan: user?.jabatan || "",
    role_id: user?.role_id || undefined,
    is_user_ppob: !!user?.is_user_ppob,
    is_active: !!user?.is_active,
    is_user_timtagih: !!user?.is_user_timtagih,
  };

  const handleUserSubmit = useCallback(
    async (
      values: UserFormType,
      { setFieldError }: FormikHelpers<UserFormType>,
      onClose: () => void
    ) => {
      const session = await getSession();
      const method = isEdit ? "put" : "post";
      axios[method]("/api/administrator/user-akses", values, {
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
                  {isEdit ? "Edit" : "Add"} User {user?.id}
                </ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={UserSchema}
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
                            <Input
                              variant="bordered"
                              label="Nama"
                              type="text"
                              value={values.nama}
                              isInvalid={!!errors.nama && !!touched.nama}
                              errorMessage={errors.nama}
                              onChange={handleChange("nama")}
                            />
                            <Input
                              variant="bordered"
                              label="Jabatan"
                              type="text"
                              value={values.jabatan}
                              isInvalid={!!errors.jabatan && !!touched.jabatan}
                              errorMessage={errors.jabatan}
                              onChange={handleChange("jabatan")}
                            />
                            <Select
                              label="Role"
                              isInvalid={errors?.role_id ? true : false}
                              errorMessage={errors?.role_id}
                              selectedKeys={values.role_id?.toString() || ""}
                              onSelectionChange={(value) => {
                                console.log(value);
                                setFieldValue(
                                  "role_id",
                                  Number(value.currentKey)
                                );
                              }}
                            >
                              {roles.map((role) => (
                                <SelectItem key={role.id.toString()}>
                                  {role.role}
                                </SelectItem>
                              ))}
                            </Select>

                            <Input
                              variant="bordered"
                              label="Username"
                              type="text"
                              isDisabled={isEdit}
                              value={values.username}
                              isInvalid={
                                !!errors.username && !!touched.username
                              }
                              errorMessage={errors.username}
                              onChange={handleChange("username")}
                            />
                            <Input
                              variant="bordered"
                              label="Password"
                              type="password"
                              isDisabled={isEdit}
                              value={values.password}
                              isInvalid={
                                !!errors.password && !!touched.password
                              }
                              errorMessage={errors.password}
                              onChange={handleChange("password")}
                            />

                            <div className="flex justify-between w-full">
                              <Checkbox
                                isSelected={values.is_user_ppob}
                                className=""
                                onChange={() =>
                                  setFieldValue(
                                    "is_user_ppob",
                                    !values.is_user_ppob
                                  )
                                }
                              >
                                PPOB User
                              </Checkbox>
                              <Checkbox
                                value="is_active"
                                isSelected={values.is_active}
                                onChange={() =>
                                  setFieldValue("is_active", !values.is_active)
                                }
                              >
                                Active
                              </Checkbox>
                              <Checkbox
                                value="is_user_timtagih"
                                isSelected={values.is_user_timtagih}
                                onChange={() =>
                                  setFieldValue(
                                    "is_user_timtagih",
                                    !values.is_user_timtagih
                                  )
                                }
                              >
                                Tim Tagih
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
                              {isEdit ? "Edit" : "Add"} User
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
