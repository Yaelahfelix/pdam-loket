"use client";

import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { useLPPRekAirStore } from "@/store/lppRekAir";
import useSWR from "swr";
import fetcher from "@/lib/swr/fetcher";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addToast,
  Button,
  Card,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { DRD, TotalDRD } from "@/types/drd";
import { useFilterStore } from "./useFilterStore";
import { DRDNonAir, TotalDRNonAir } from "@/types/lpp-nonair";
import { useLPPNonAirStore } from "@/store/lppNonAir";
import { DataPembayaranRekAir } from "@/types/pembayran-rekair";
import { formatRupiah } from "@/lib/utils";

import { formatPeriode } from "@/lib/formatPeriode";

import { PembatalanNonAir } from "@/types/pembatalan-nonair";
import { KoreksiPembayaran } from "@/types/koreksi-pembayaran";
import { formatDate } from "date-fns";
import { id } from "date-fns/locale";
import { DataRayonPetugas, Rayon } from "@/types/plot-tim-tagih";
import { Trash2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { getSession } from "@/lib/session";
import { ErrorResponse } from "@/types/axios";

type Props = {
  data?: DataRayonPetugas[];
  handler: (ids: string[]) => void;
};

const TableRayonPetugas = ({ data, handler }: Props) => {
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const Router = useRouter();
  return (
    <>
      <div>
        <Table
          classNames={{
            wrapper: "max-h-[80vh]",
            td: "first:w-[50px]",
          }}
        >
          <TableHeader>
            <TableColumn width={100}>Kode Rayon</TableColumn>
            <TableColumn width={100}>Nama Petugas</TableColumn>
            <TableColumn width={30}>Jumlah</TableColumn>
            <TableColumn width={10}>Action</TableColumn>
          </TableHeader>
          <TableBody className="rounded-lg">
            {
              data?.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{data.kode_rayon}</TableCell>
                  <TableCell>{data.nama}</TableCell>
                  <TableCell>{data.jumlah}</TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      color="danger"
                      isLoading={deleteIsLoading}
                      onPress={async () => {
                        const session = await getSession();
                        setDeleteIsLoading(true);
                        axios
                          .delete(
                            "/api/tim-penagihan/plot-tim-tagih?id=" + data.id,
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
                            Router.refresh();
                          })
                          .catch((err: AxiosError<ErrorResponse>) => {
                            addToast({
                              title: "Gagal menghapus data!",
                              description: err.response?.data.message,
                              color: "danger",
                            });
                          })
                          .finally(() => setDeleteIsLoading(false));
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              )) as any
            }
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TableRayonPetugas;
