"use client";

import { deleteAuthCookie } from "@/actions/auth.action";
import { UserLoketSchema, UserSchema } from "@/helpers/schemas";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ErrorResponse } from "@/types/axios";
import { Loket } from "@/types/loket";
import { Role } from "@/types/role";
import { MenuDetail, MenuGroup, SidebarIcon } from "@/types/settings";
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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import {
  Home,
  Settings,
  User,
  CreditCard,
  FileText,
  Clipboard,
  BarChart,
  Users,
  Calendar,
  DollarSign,
  Printer,
  FileCheck,
  Bell,
  Trash,
  Flag,
  LifeBuoy,
  Database,
  Server,
  ShieldCheck,
} from "lucide-react";

import axios, { AxiosError } from "axios";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import IconSelector from "./icon-selector";

export const FormEditIcon = ({
  diclosure,
}: {
  diclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange } = diclosure;
  const Router = useRouter();
  const [data, setData] = useState<SidebarIcon[]>([]);

  useEffect(() => {
    const getData = async () => {
      const session = await getSession();
      axios
        .get("/api/administrator/role-users/sidebar", {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        })
        .then((res) => {
          setData(res.data.data);
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
        });
    };
    isOpen && getData();
  }, [isOpen]);

  const handleIconSelect = async (menuId: string, iconName: string) => {
    const session = await getSession();
    axios
      .put(
        "/api/administrator/role-users/sidebar",
        {
          id: menuId,
          icon: iconName,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        }
      )
      .then((res) => {
        addToast({ color: "success", title: res.data.message });
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
      });
  };
  // const handleUserSubmit = useCallback(
  //   async (
  //     values: UserLoketFormType,
  //     { setFieldError }: FormikHelpers<UserLoketFormType>,
  //     onClose: () => void
  //   ) => {
  //     const session = await getSession();
  //     const method = isEdit ? "put" : "post";
  //     axios[method]("/api/administrator/user-akses/loket", values, {
  //       headers: {
  //         Authorization: `Bearer ${session?.token.value}`,
  //       },
  //     })
  //       .then((res) => {
  //         addToast({ color: "success", title: res.data.message });
  //         onClose();
  //         Router.refresh();
  //       })
  //       .catch(async (err: AxiosError<ErrorResponse>) => {
  //         if (err.status === 401) {
  //           await deleteAuthCookie();
  //           await deleteSidebar();
  //           addToast({
  //             title: "Gagal memperbarui data!",
  //             ...errToast_UNAUTHORIZED,
  //           });
  //           return Router.replace("/login");
  //         }
  //         if (err.status === 409) {
  //           addToast({
  //             title: "Gagal memperbarui data!",
  //             description:
  //               "Loket yang dimasukkan sudah ada di user ini, silahkan coba loket yang lain!",
  //             color: "danger",
  //           });
  //           return setFieldError("loket_id", err.response?.data.message);
  //         }
  //         addToast({
  //           title: "Gagal memperbarui data!",
  //           ...errToast_INTERNALSERVER,
  //         });
  //       })
  //       .finally(() => setIsLoading(false));
  //   },
  //   []
  // );
  return (
    <div>
      <>
        <Modal
          size="5xl"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Menu Permissions
                </ModalHeader>
                <ModalBody className="max-h-[50vh] overflow-auto">
                  {data.length !== 0 ? (
                    <Table>
                      <TableHeader>
                        <TableColumn>No</TableColumn>
                        <TableColumn>Nama Menu</TableColumn>
                        <TableColumn>Icon</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {
                          data?.map((menu, i) => {
                            return (
                              <TableRow key={menu.id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{menu.namamenu}</TableCell>
                                <TableCell>
                                  <IconSelector
                                    menu={menu}
                                    // @ts-ignore
                                    onIconSelect={handleIconSelect}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          }) as any
                        }
                      </TableBody>
                    </Table>
                  ) : (
                    <Skeleton className="h-56 w-full rounded-lg" />
                  )}
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
      </>
    </div>
  );
};
