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
  DatePicker,
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
import { toDate, toZonedTime } from "date-fns-tz";
import { parseDate, parseZonedDateTime } from "@internationalized/date";
import { format } from "date-fns";
import { ComboboxPelanggan } from "@/components/combobox/pelanggan";

interface Form {
  no_pelanggan: string;
}
export const FormCoklit = ({
  isEdit = false,
  data,
  diclosure,
}: {
  isEdit?: boolean;
  data?: Form;
  diclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange } = diclosure;
  const Router = useRouter();

  const initialValues: Form = {
    no_pelanggan: "",
  };

  const handleUserSubmit = useCallback(
    async (
      values: Form,
      { setFieldError }: FormikHelpers<Form>,
      onClose: () => void
    ) => {
      setIsLoading(true);
      const session = await getSession();
      const method = isEdit ? "put" : "post";
      axios[method]("/api/settings/pel-coklit", values, {
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
                  Add Pelanggan Coklit
                </ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={initialValues}
                    // validationSchema={UserSchema}
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
                            <ComboboxPelanggan
                              handler={(value) =>
                                setFieldValue("no_pelanggan", value)
                              }
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
                              {isEdit ? "Edit" : "Add"} Coklit
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
