"use client";

import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { useLPPRekAirStore } from "@/store/lppRekAir";
import useSWR from "swr";
import fetcher from "@/lib/swr/fetcher";
import { useSearchParams } from "next/navigation";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { DataKolektif, Kolektif } from "./page";
import { formatPeriode } from "@/lib/formatPeriode";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Props = {
  data?: DataKolektif[];
  handler: (ids: string[]) => void;
};

const DataTableKolektif = ({ data, handler }: Props) => {
  return (
    <>
      {data && data.length !== 0 ? (
        <div>
          <Table
            classNames={{
              wrapper: "max-h-[80vh]",
              td: "first:w-[50px]",
            }}
            isHeaderSticky
            selectionMode="multiple"
            onSelectionChange={(val) => {
              handler(Array.from(val) as any);
            }}
            disabledKeys={["dis"]}
          >
            <TableHeader>
              <TableColumn width={200}>No Pel</TableColumn>
              <TableColumn width={120}>Nama</TableColumn>
              <TableColumn width={100}>Periode</TableColumn>
              <TableColumn width={100}>Tagihan</TableColumn>
              <TableColumn width={100}>Denda</TableColumn>
              <TableColumn width={100}>Materai</TableColumn>
              <TableColumn width={100}>Total</TableColumn>
              <TableColumn width={100}>Kasir</TableColumn>
              <TableColumn width={100}>Loket</TableColumn>
              <TableColumn width={100}>Tgl Bayar</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data1, i) => (
                  <>
                    {data1.data.map((main) => {
                      return main.data.map((data) => {
                        return (
                          <TableRow key={data.id}>
                            <TableCell>
                              <div
                                style={{ backgroundColor: main.color }}
                                className="rounded-lg shadow p-1 text-center"
                              >
                                {data1.kolektif.nama} - {data.no_pelanggan}
                              </div>
                            </TableCell>
                            <TableCell>{data.nama}</TableCell>
                            <TableCell>
                              {formatPeriode(data.periode_rek)}
                            </TableCell>
                            <TableCell>
                              {formatRupiah(Number(data.harga_air))}
                            </TableCell>
                            <TableCell>
                              {formatRupiah(Number(data.denda))}
                            </TableCell>
                            <TableCell>{formatRupiah(data.meterai)}</TableCell>
                            <TableCell>
                              {formatRupiah(Number(data.denda))}
                            </TableCell>
                            <TableCell>{data.kasir}</TableCell>
                            <TableCell>{data.loket}</TableCell>
                            <TableCell>
                              {format(data.tglbayar, "dd MMM yyyy HH:mm:ss", {
                                locale: id,
                              })}
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })}
                  </>
                )) as any
              }
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardHeader className="p-5 justify-center items-center flex flex-row">
            <div className="text-center">Tidak ada data</div>
          </CardHeader>
        </Card>
      )}
    </>
  );
};

export default DataTableKolektif;
