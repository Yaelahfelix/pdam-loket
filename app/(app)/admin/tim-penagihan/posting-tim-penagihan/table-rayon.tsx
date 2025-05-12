"use client";

import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { useLPPRekAirStore } from "@/store/lppRekAir";
import useSWR from "swr";
import fetcher from "@/lib/swr/fetcher";
import { useSearchParams } from "next/navigation";
import {
  addToast,
  Card,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Selection,
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
import { Rayon } from "@/types/plot-tim-tagih";

type Props = {
  data?: Rayon[];
  selectedRayon: string[] | "all" | null;
  handler: (ids: string[] | "all") => void;
};

const TableRayon = ({ data, handler, selectedRayon }: Props) => {
  return (
    <>
      <div>
        <Table
          classNames={{
            wrapper: "max-h-[80vh]",
            td: "first:w-[50px]",
          }}
          isHeaderSticky
          selectedKeys={new Set(selectedRayon)}
          selectionMode="multiple"
          onSelectionChange={(keys) => {
            if (keys === "all") {
              const allKeys = data!.map((item) => String(item.id));
              handler(allKeys);
            } else {
              handler(Array.from(keys) as any);
            }
          }}
        >
          <TableHeader>
            <TableColumn width={100}>Kode</TableColumn>
            <TableColumn width={100}>Nama</TableColumn>
            <TableColumn width={30}>Jumlah</TableColumn>
          </TableHeader>
          <TableBody className="rounded-lg">
            {
              data?.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{data.kode_rayon}</TableCell>
                  <TableCell>{data.nama}</TableCell>
                  <TableCell>{data.jumlah}</TableCell>
                </TableRow>
              )) as any
            }
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TableRayon;
