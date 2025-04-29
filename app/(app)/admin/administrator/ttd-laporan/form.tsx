"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { ComboboxUserParaf } from "@/components/combobox/userparaf";
import LocationInputForm from "@/components/form/Location";
import { DendaSchema, TTDSchema, UserSchema } from "@/helpers/schemas";
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedNameId, setSelectedNameId] = useState<string>("");

  const initialValues: TTDFormType = {
    header1: data.header1,
    header2: data.header2,
    header3: data.header3,
    header4: data.header4,
    id1: data.id1,
    id2: data.id2,
    id3: data.id3,
    id4: data.id4,
    is_id_1: Boolean(data.is_id_1),
    is_id_2: Boolean(data.is_id_2),
    is_id_3: Boolean(data.is_id_3),
    is_id_4: Boolean(data.is_id_4),
    nama1: data.nama1,
    nama2: data.nama2,
    nama3: data.nama3,
    nama4: data.nama4,
  };

  const handleUserSubmit = useCallback(
    async (
      values: TTDFormType,
      { setFieldError }: FormikHelpers<TTDFormType>
    ) => {
      setIsLoading(true);
      const session = await getSession();
      axios["put"](
        "/api/ttd",
        {
          ...values,
          kode: data.kode,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        }
      )
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
    <Card>
      <CardHeader className="justify-center py-5"> {data.namalap}</CardHeader>
      <CardBody>
        <Formik
          initialValues={initialValues}
          validationSchema={TTDSchema}
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
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Edit paraf
                        </ModalHeader>
                        <ModalBody>
                          <ComboboxUserParaf
                            handler={(val, name) => {
                              setFieldValue("pelanggan_id", val);
                              setFieldValue(selectedNameId, name);
                            }}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" onPress={onClose}>
                            Close
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
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

                    <Button
                      variant="bordered"
                      onPress={() => {
                        onOpen();
                        setSelectedId("id1");
                        setSelectedNameId("nama1");
                      }}
                    >
                      <div className="w-full text-left">{values.nama1}</div>
                    </Button>
                    <div className="flex justify-end">
                      <Checkbox
                        isSelected={values.is_id_1}
                        className="flex-row-reverse gap-4"
                        onChange={() =>
                          setFieldValue("is_id_1", !values.is_id_1)
                        }
                      >
                        Tampilkan
                      </Checkbox>
                    </div>
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
                    <Button
                      variant="bordered"
                      onPress={() => {
                        onOpen();
                        setSelectedId("id2");
                        setSelectedNameId("nama2");
                      }}
                    >
                      <div className="w-full text-left">{values.nama2}</div>
                    </Button>
                    <div className="flex justify-end">
                      <Checkbox
                        isSelected={values.is_id_2}
                        className="flex-row-reverse gap-4"
                        onChange={() =>
                          setFieldValue("is_id_2", !values.is_id_2)
                        }
                      >
                        Tampilkan
                      </Checkbox>
                    </div>
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
                    <Button
                      variant="bordered"
                      onPress={() => {
                        onOpen();
                        setSelectedId("id3");
                        setSelectedNameId("nama3");
                      }}
                    >
                      <div className="w-full text-left">{values.nama3}</div>
                    </Button>
                    <div className="flex justify-end">
                      <Checkbox
                        isSelected={values.is_id_3}
                        className="flex-row-reverse gap-4"
                        onChange={() =>
                          setFieldValue("is_id_3", !values.is_id_3)
                        }
                      >
                        Tampilkan
                      </Checkbox>
                    </div>
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
                    <Button
                      variant="bordered"
                      onPress={() => {
                        onOpen();
                        setSelectedId("id4");
                        setSelectedNameId("nama4");
                      }}
                    >
                      <div className="w-full text-left">{values.nama4}</div>
                    </Button>
                    <div className="flex justify-end">
                      <Checkbox
                        isSelected={values.is_id_4}
                        className="flex-row-reverse gap-4"
                        onChange={() =>
                          setFieldValue("is_id_4", !values.is_id_4)
                        }
                      >
                        Tampilkan
                      </Checkbox>
                    </div>
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
