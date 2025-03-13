"use client";

import { UserSchema } from "@/helpers/schemas";
import { UserFormType } from "@/helpers/types";
import { defaultErrorHandler } from "@/lib/dbQuery/defaultErrorHandler";
import { getSession } from "@/lib/session";
import { ErrorResponse } from "@/types/axios";
import { Role } from "@/types/role";
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
import { Formik, FormikHelpers } from "formik";
import React, { useCallback, useState } from "react";

export const Create = ({ roles }: { roles: Role[] }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: UserFormType = {
    username: "",
    password: "",
    nama: "",
    jabatan: "",
    role_id: 0,
    is_user_ppob: false,
    is_active: false,
    is_user_timtagih: false,
  };

  const handleUserSubmit = useCallback(
    async (
      values: UserFormType,
      { setFieldError }: FormikHelpers<UserFormType>,
      onClose: () => void
    ) => {
      setIsLoading(true);
      const session = await getSession();
      axios
        .post("/api/administrator/user-akses", values, {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        })
        .then((res) => {
          addToast({ color: "success", title: "Berhasil menambahkan data" });
          onClose();
        })
        .catch((err: AxiosError<ErrorResponse>) => {
          if (err.status === 409) {
            return setFieldError("username", "Username already exists");
          }
          defaultErrorHandler(err, false);
        })
        .finally(() => setIsLoading(false));
    },
    []
  );
  return (
    <div>
      <>
        <Button onPress={onOpen} color="primary">
          Add User
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add User
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
                    }) => (
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
                            onChange={(value) =>
                              setFieldValue("role_id", value.target.value)
                            }
                          >
                            {roles.map((role) => (
                              <SelectItem key={role.id}>{role.role}</SelectItem>
                            ))}
                          </Select>
                          <Input
                            variant="bordered"
                            label="Username"
                            type="text"
                            value={values.username}
                            isInvalid={!!errors.username && !!touched.username}
                            errorMessage={errors.username}
                            onChange={handleChange("username")}
                          />
                          <Input
                            variant="bordered"
                            label="Password"
                            type="password"
                            value={values.password}
                            isInvalid={!!errors.password && !!touched.password}
                            errorMessage={errors.password}
                            onChange={handleChange("password")}
                          />
                          <CheckboxGroup label="User Permissions" className="">
                            <div className="flex justify-between w-full">
                              <Checkbox
                                value="is_user_ppob"
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
                          </CheckboxGroup>
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
                          >
                            Add User
                          </Button>
                        </div>
                      </>
                    )}
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
