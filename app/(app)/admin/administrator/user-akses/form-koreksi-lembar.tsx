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

interface Value {
  min_l: number;
  max_l: number;
}
export const FormKoreksiLembar = ({
  isEdit = false,
  user,
  diclosure,
}: {
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

  const initialValues: Value = {
    min_l: user?.min_l || 0,
    max_l: user?.max_l || 0,
  };

  const handleUserSubmit = useCallback(
    async (
      values: Value,
      { setFieldError }: FormikHelpers<Value>,
      onClose: () => void
    ) => {
      const session = await getSession();
      setIsLoading(true);
      axios["post"](
        "/api/administrator/user-akses/koreksi",
        {
          min_l: values.min_l,
          max_l: values.max_l,
          user_id: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        }
      )
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
                  Edit Plot Tim Tagih
                </ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={initialValues}
                    // validationSchema={UserLoketSchema}
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
                              type="number"
                              variant="bordered"
                              label="Min Lembar"
                              value={String(values.min_l)}
                              onChange={handleChange("min_l")}
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                            <Input
                              type="number"
                              variant="bordered"
                              label="Max Lembar"
                              value={String(values.max_l)}
                              onChange={handleChange("max_l")}
                              inputMode="numeric"
                              pattern="[0-9]*"
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
                              Simpan Plot
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
