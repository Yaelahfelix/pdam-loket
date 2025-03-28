"use client";

import React, { useState, useEffect } from "react";
import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { BASEURL } from "@/constant";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import BreadcrumbsComponent from "./breadcrumbs";
import { id } from "date-fns/locale";
import {
  DekstopSettings,
  Denda,
  PelCoklitSettings,
  PPNSettings,
} from "@/types/settings";
import { FormDenda } from "./form-denda";
import { FormDekstop } from "./form-dekstop";
import { EllipsisVertical, Pencil, Plus, Trash } from "lucide-react";
import { FormPPN } from "./form-ppn";
import PPNActions from "./ppn-actions";
import { FormMaps } from "./form-maps";
import { FormCoklit } from "./form-coklit";
import { format } from "date-fns";

const fetcher = async (url: string) => {
  const session = await (await import("@/lib/session")).getSession();
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${session?.token.value}`,
      },
    })
    .then((response) => response.data)
    .catch(async (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 401) {
        const { deleteSidebar } = await import("@/lib/sidebar");
        const { deleteAuthCookie } = await import("@/actions/auth.action");
        await deleteSidebar();
        await deleteAuthCookie();
        window.location.href = "/login";
      } else {
        window.location.href = "/error";
      }
      throw error;
    });
};

const UserAkses = () => {
  const searchParams = useSearchParams();

  const {
    data: dendaData,
    error: dendaError,
    isLoading: dendaLoading,
  } = useSWR<{ data: Denda }>("/api/settings/denda", fetcher);

  const {
    data: dekstopData,
    error: dekstopError,
    isLoading: dekstopLoading,
  } = useSWR<{ data: DekstopSettings }>("/api/settings/dekstop", fetcher);

  const {
    data: ppnData,
    error: ppnError,
    isLoading: ppnLoading,
  } = useSWR<{ data: PPNSettings[] }>("/api/settings/ppn", fetcher);

  const {
    data: pelCoklitData,
    error: pelCoklitError,
    isLoading: pelCoklitLoading,
  } = useSWR<{ data: PelCoklitSettings[] }>(
    "/api/settings/pel-coklit",
    fetcher
  );

  const {
    isOpen: isPPNOpen,
    onOpen: onPPNOpen,
    onOpenChange: onPPNOpenChange,
  } = useDisclosure();

  const {
    isOpen: isCoklitOpen,
    onOpen: onCoklitOpen,
    onOpenChange: onCoklitOpenChange,
  } = useDisclosure();

  // const {
  //   data: rolesData,
  //   error: rolesError,
  //   isLoading: rolesLoading,
  // } = useSWR(`${BASEURL}/api/administrator/role`, fetcher);

  // const {
  //   data: loketData,
  //   error: loketError,
  //   isLoading: loketLoading,
  // } = useSWR(`${BASEURL}/api/administrator/user-akses/loket`, fetcher);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">Pengaturan Aplikasi</h3>

      {dendaLoading || dekstopLoading || ppnLoading || pelCoklitLoading ? (
        <div className="p-5 border rounded-lg">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      ) : dendaError || dekstopError || ppnError || pelCoklitError ? (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          Error loading data
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <Card className="w-4/12">
              <CardHeader className="justify-center">
                <h1 className="text-center">Pengaturan Denda</h1>
              </CardHeader>
              <CardBody>
                <div>
                  <FormDenda data={dendaData!.data} />
                </div>
              </CardBody>
            </Card>
            <Card className="w-8/12 justify-between flex flex-col">
              <CardHeader className="justify-center">
                <h1 className="text-center">Pengaturan Dekstop</h1>
              </CardHeader>
              <CardBody className=" ">
                <div className="w-full ">
                  <FormDekstop data={dekstopData!.data} />
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="flex flex-col gap-5">
            <Card className="">
              <CardHeader className="justify-center">
                <h1 className="text-center">Setelan Default Maps</h1>
              </CardHeader>
              <CardBody className=" ">
                <div className="w-full ">
                  <FormMaps />
                </div>
              </CardBody>
            </Card>
            <Card className="">
              <CardBody className="flex flex-row divide-x">
                <div className="w-6/12 p-5 flex flex-col gap-5">
                  <h1 className="text-center">Pengaturan PPN</h1>
                  <Table>
                    <TableHeader>
                      <TableColumn>Jumlah</TableColumn>
                      <TableColumn>Mulai Tanggal</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {
                        ppnData?.data.map((data, i) => {
                          return (
                            <>
                              <TableRow key={i}>
                                <TableCell>{data.jml}</TableCell>
                                <TableCell>
                                  {format(
                                    new Date(data.mulaitgl),
                                    "dd MMM yyyy",
                                    { locale: id }
                                  )}
                                </TableCell>
                                <TableCell>
                                  <PPNActions data={data} />
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        }) as any
                      }
                    </TableBody>
                  </Table>
                  <Button
                    startContent={<Plus />}
                    color="primary"
                    onPress={onPPNOpen}
                  >
                    Tambah PPN
                  </Button>
                  <FormPPN
                    diclosure={{
                      isOpen: isPPNOpen,
                      onOpenChange: onPPNOpenChange,
                    }}
                  />
                </div>
                <div className="w-6/12 p-5 flex flex-col gap-5">
                  <FormCoklit
                    diclosure={{
                      isOpen: isCoklitOpen,
                      onOpenChange: onCoklitOpenChange,
                    }}
                  />
                  <h1 className="text-center">Pelanggan Coklit</h1>
                  <Table>
                    <TableHeader>
                      <TableColumn>No</TableColumn>
                      <TableColumn>No Pelanggan</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {
                        pelCoklitData?.data.map((data, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell>{data.no_pelanggan}</TableCell>
                            </TableRow>
                          );
                        }) as any
                      }
                    </TableBody>
                  </Table>
                  <Button
                    startContent={<Plus />}
                    color="primary"
                    onPress={onCoklitOpen}
                  >
                    Tambah Pelanggan Coklit
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAkses;
