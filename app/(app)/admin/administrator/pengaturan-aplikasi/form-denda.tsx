"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { DendaSchema, UserSchema } from "@/helpers/schemas";
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
import { Denda } from "@/types/settings";
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

export const FormDenda = ({ data }: { data: Denda }) => {
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const initialValues: Denda = {
    idx: data.idx,
    denda1: data.denda1,
    denda2: data.denda2,
    flagpersen: data.flagpersen,
    tgl1: data.tgl1,
    tgl2: data.tgl2,
  };

  const handleUserSubmit = useCallback(
    async (values: Denda, { setFieldError }: FormikHelpers<Denda>) => {
      setIsLoading(true);
      const session = await getSession();
      axios["put"]("/api/settings/denda", values, {
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
        validationSchema={DendaSchema}
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
                <h3>Setup denda 1</h3>
                <Input
                  variant="bordered"
                  label="Tanggal 1"
                  type="number"
                  value={values.tgl1?.toString() || ""}
                  isInvalid={!!errors.tgl1 && !!touched.tgl1}
                  errorMessage={errors.tgl1}
                  onChange={handleChange("tgl1")}
                />
                <Input
                  variant="bordered"
                  label="Denda 1"
                  type="text"
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(values.denda1 || 0)}
                  isInvalid={!!errors.denda1 && !!touched.denda1}
                  errorMessage={errors.denda1}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFieldValue("denda1", parseInt(value, 10));
                  }}
                />
                <Divider className="my-3" />
                <h3>Setup denda 2</h3>

                <Input
                  variant="bordered"
                  label="Tanggal 2"
                  type="number"
                  value={values.tgl2?.toString() || ""}
                  isInvalid={!!errors.tgl2 && !!touched.tgl2}
                  errorMessage={errors.tgl2}
                  onChange={handleChange("tgl2")}
                />
                <Input
                  variant="bordered"
                  label="Denda 2"
                  type="text"
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(values.denda2 || 0)}
                  isInvalid={!!errors.denda2 && !!touched.denda2}
                  errorMessage={errors.denda2}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFieldValue("denda2", parseInt(value, 10));
                  }}
                />
              </div>
              <div className="mt-5">
                <Button
                  className="w-full"
                  color="primary"
                  onPress={() => handleSubmit()}
                  type="submit"
                  isLoading={isLoading}
                >
                  Edit Denda
                </Button>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
