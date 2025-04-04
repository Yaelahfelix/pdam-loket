"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { ComboboxUserParaf } from "@/components/combobox/userparaf";
import LocationInputForm from "@/components/form/Location";
import { DendaSchema, UserSchema } from "@/helpers/schemas";
import { TTDFormType, UserFormType } from "@/helpers/types";
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
import { TTD } from "@/types/ttd";
import { User } from "@/types/user";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
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

export const FormTTD = ({ data }: { data: TTD }) => {
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const initialValues: TTDFormType = {
    header1: data.header1,
    header2: data.header2,
    header3: data.header3,
    header4: data.header4,
    id1: data.id1,
    id2: data.id2,
    id3: data.id3,
    id4: data.id4,
  };

  const handleUserSubmit = useCallback(
    async (
      values: TTDFormType,
      { setFieldError }: FormikHelpers<TTDFormType>
    ) => {
      //   setIsLoading(true);
      //   const session = await getSession();
      //   axios["put"]("/api/settings/denda", values, {
      //     headers: {
      //       Authorization: `Bearer ${session?.token.value}`,
      //     },
      //   })
      //     .then((res) => {
      //       addToast({ color: "success", title: res.data.message });
      //       Router.refresh();
      //     })
      //     .catch(async (err: AxiosError<ErrorResponse>) => {
      //       if (err.status === 401) {
      //         await deleteAuthCookie();
      //         await deleteSidebar();
      //         addToast({
      //           title: "Gagal memperbarui data!",
      //           ...errToast_UNAUTHORIZED,
      //         });
      //         return Router.replace("/login");
      //       }
      //       if (err.status !== 500) {
      //         return addToast({
      //           title: "Gagal memperbarui data!",
      //           description: err.response?.data.message,
      //           color: "danger",
      //         });
      //       }
      //       addToast({
      //         title: "Gagal memperbarui data!",
      //         ...errToast_INTERNALSERVER,
      //       });
      //     })
      //     .finally(() => setIsLoading(false));
      console.log(values);
    },
    []
  );
  return (
    <Card>
      <CardHeader className="justify-center py-5"> {data.namalap}</CardHeader>
      <CardBody>
        <Formik
          initialValues={initialValues}
          //   validationSchema={DendaSchema}
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
                <div className="flex flex-wrap w-full mb-4 ">
                  <div className="w-6/12 flex flex-col border-r border-b gap-5 p-5">
                    <h1 className="text-center text-lg font-bold">Header 1</h1>
                    <Input
                      variant="bordered"
                      label="Deskripsi"
                      type="text"
                      value={values.header1}
                      isInvalid={!!errors.header1 && !!touched.header1}
                      errorMessage={errors.header1}
                      onChange={handleChange("header1")}
                    />
                    <ComboboxUserParaf
                      handler={(val) => {
                        setFieldValue("id1", val);
                      }}
                      defaultValue={String(data.id1)}
                    />
                  </div>
                  <div className="w-6/12 flex flex-col  border-b gap-5 p-5">
                    <h1 className="text-center text-lg font-bold">Header 2</h1>
                    <Input
                      variant="bordered"
                      label="Deskripsi"
                      type="text"
                      value={values.header2}
                      isInvalid={!!errors.header2 && !!touched.header2}
                      errorMessage={errors.header2}
                      onChange={handleChange("header2")}
                    />
                    <ComboboxUserParaf
                      handler={(val) => {
                        setFieldValue("id2", val);
                      }}
                      defaultValue={String(data.id2)}
                    />
                  </div>
                  <div className="w-6/12 flex flex-col  border-r  gap-5 p-5">
                    <h1 className="text-center text-lg font-bold">Header 3</h1>
                    <Input
                      variant="bordered"
                      label="Deskripsi"
                      type="text"
                      value={values.header3}
                      isInvalid={!!errors.header3 && !!touched.header3}
                      errorMessage={errors.header3}
                      onChange={handleChange("header3")}
                    />
                    <ComboboxUserParaf
                      handler={(val) => {
                        setFieldValue("id3", val);
                      }}
                      defaultValue={String(data.id3)}
                    />
                  </div>
                  <div className="w-6/12 flex flex-col gap-5 p-5">
                    <h1 className="text-center text-lg font-bold">Header 4</h1>
                    <Input
                      variant="bordered"
                      label="Deskripsi"
                      type="text"
                      value={values.header4}
                      isInvalid={!!errors.header4 && !!touched.header4}
                      errorMessage={errors.header4}
                      onChange={handleChange("header4")}
                    />
                    <ComboboxUserParaf
                      handler={(val) => {
                        setFieldValue("id4", val);
                      }}
                      defaultValue={String(data.id4)}
                    />
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
                    Simpan
                  </Button>
                </div>
              </>
            );
          }}
        </Formik>
      </CardBody>
    </Card>
  );
};
