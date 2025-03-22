"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import {
  DendaSchema,
  DesktopSettingsSchema,
  UserSchema,
} from "@/helpers/schemas";
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
import { DekstopSettings, Denda } from "@/types/settings";
import { User } from "@/types/user";
import {
  addToast,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
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

export const FormDekstop = ({ data }: { data: DekstopSettings }) => {
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const initialValues: DekstopSettings = {
    idx: data.idx,
    mundurtglbyr: data.mundurtglbyr,
    alamat1: data.alamat1,
    alamat2: data.alamat2,
    footerkota: data.footerkota,
    headerlap1: data.headerlap1,
    headerlap2: data.headerlap2,
    information: data.information,
    stricpayment: !!data.stricpayment,
  };
  const handleUserSubmit = useCallback(
    async (
      values: DekstopSettings,
      { setFieldError }: FormikHelpers<DekstopSettings>
    ) => {
      setIsLoading(true);
      const session = await getSession();
      axios["put"]("/api/settings/dekstop", values, {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      })
        .then((res) => {
          addToast({ color: "success", title: res.data.message });
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
    },
    []
  );
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={DesktopSettingsSchema}
        onSubmit={(values, actions) => handleUserSubmit(values, actions)}
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
                  label="Header 1"
                  type="text"
                  value={values.headerlap1}
                  isInvalid={!!errors.headerlap1 && !!touched.headerlap1}
                  errorMessage={errors.headerlap1}
                  onChange={handleChange("headerlap1")}
                />
                <Input
                  variant="bordered"
                  label="Header 2"
                  type="text"
                  value={values.headerlap2}
                  isInvalid={!!errors.headerlap2 && !!touched.headerlap2}
                  errorMessage={errors.headerlap2}
                  onChange={handleChange("headerlap2")}
                />
                <Divider className="my-1" />
                <Input
                  variant="bordered"
                  label="Alamat 1"
                  type="text"
                  value={values.alamat1}
                  isInvalid={!!errors.alamat1 && !!touched.alamat1}
                  errorMessage={errors.alamat1}
                  onChange={handleChange("alamat1")}
                />

                <Input
                  variant="bordered"
                  label="Alamat 2"
                  type="text"
                  value={values.alamat2}
                  isInvalid={!!errors.alamat2 && !!touched.alamat2}
                  errorMessage={errors.alamat2}
                  onChange={handleChange("alamat2")}
                />
                <Input
                  variant="bordered"
                  label="Footer"
                  type="text"
                  value={values.footerkota}
                  isInvalid={!!errors.footerkota && !!touched.footerkota}
                  errorMessage={errors.footerkota}
                  onChange={handleChange("footerkota")}
                />
                <div className="flex justify-end">
                  <Checkbox
                    isSelected={values.stricpayment}
                    className="flex-row-reverse gap-4"
                    onChange={() =>
                      setFieldValue("stricpayment", !values.stricpayment)
                    }
                  >
                    Tidak bisa memilih lembar tagihan saat pembayaran
                  </Checkbox>
                </div>
              </div>
              <div className="mt-5">
                <Button
                  className="w-full"
                  color="primary"
                  onPress={() => handleSubmit()}
                  type="submit"
                  isLoading={isLoading}
                >
                  Edit Pengaturan
                </Button>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
