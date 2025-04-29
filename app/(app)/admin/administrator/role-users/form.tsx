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
import { Role, RoleDetailResponse } from "@/types/role";
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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";

export const Form = ({
  id,
  diclosure,
}: {
  id: number;
  diclosure: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange } = diclosure;
  const Router = useRouter();
  const [data, setData] = useState<RoleDetailResponse | undefined>();

  useEffect(() => {
    const getData = async () => {
      const session = await getSession();
      axios
        .get("/api/administrator/role-users/" + id, {
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

  return (
    <div>
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
          size="5xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Menu Permissions
                </ModalHeader>
                <ModalBody className="max-h-[50vh] overflow-auto">
                  {data ? (
                    <Table>
                      <TableHeader>
                        <TableColumn>No</TableColumn>
                        <TableColumn>Nama Menu</TableColumn>
                        <TableColumn>Izin</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {
                          data?.menus.map((menu, i) => {
                            let menuAktif = menu.aktif;
                            return (
                              <TableRow key={menu.menu_id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>
                                  {menu.group_name} - {menu.menu_name}
                                </TableCell>
                                <TableCell>
                                  <Checkbox
                                    defaultSelected={menuAktif}
                                    onValueChange={async (boolean) => {
                                      const session = await getSession();
                                      axios
                                        .put(
                                          "/api/administrator/role-users",
                                          {
                                            id: menu.id,
                                            role_id: data.role_id,
                                            menu_id: boolean
                                              ? menu.menu_id
                                              : null,
                                          },
                                          {
                                            headers: {
                                              Authorization: `Bearer ${session?.token.value}`,
                                            },
                                          }
                                        )
                                        .then((res) => {
                                          addToast({
                                            color: "success",
                                            title: res.data.message,
                                          });
                                        })
                                        .catch(
                                          async (
                                            err: AxiosError<ErrorResponse>
                                          ) => {
                                            if (err.status === 401) {
                                              await deleteAuthCookie();
                                              await deleteSidebar();
                                              addToast({
                                                title:
                                                  "Gagal memperbarui data!",
                                                ...errToast_UNAUTHORIZED,
                                              });
                                              return Router.replace("/login");
                                            }
                                            if (err.status !== 500) {
                                              addToast({
                                                title:
                                                  "Gagal memperbarui data!",
                                                description:
                                                  err.response?.data.message,
                                              });
                                            }
                                            addToast({
                                              title: "Gagal memperbarui data!",
                                              ...errToast_INTERNALSERVER,
                                            });
                                          }
                                        );
                                    }}
                                  ></Checkbox>
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
