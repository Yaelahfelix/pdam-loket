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

type Props = {
  data?: DataKolektif[];
  setData: React.Dispatch<React.SetStateAction<DataKolektif[]>>;
  strictPayment: boolean;
  handler: (ids: string[] | "all") => void;
};

const DataTableKolektif = ({
  data,
  setData,
  strictPayment,
  handler,
}: Props) => {
  return (
    <>
      {data && data.length !== 0 ? (
        <div>
          <Table
            classNames={{
              wrapper: "max-h-[80vh]",
            }}
            selectionMode="multiple"
            onSelectionChange={(keys) => {
              if (keys === "all") {
                const allKeys = data!.map((data) =>
                  data.data.map((item) => String(item.id))
                );
                handler(allKeys as any);
              } else {
                handler(Array.from(keys) as any);
              }
            }}
            isHeaderSticky
          >
            <TableHeader>
              <TableColumn width={10}>No Pel</TableColumn>
              <TableColumn width={120}>Nama</TableColumn>
              <TableColumn width={200}>Alamat</TableColumn>
              <TableColumn width={100}>Periode</TableColumn>
              <TableColumn width={50}>S. Lalu</TableColumn>
              <TableColumn width={50}>S. Skrg</TableColumn>
              <TableColumn width={100}>Pakai</TableColumn>
              <TableColumn width={100}>Tagihan</TableColumn>
              <TableColumn width={100}>Denda</TableColumn>
              <TableColumn width={100}>Materai</TableColumn>
              <TableColumn width={100}>Total</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data1, i) => (
                  <>
                    <TableRow className="border rounded-lg">
                      <TableCell colSpan={11}>
                        <div className="flex justify-between items-center">
                          <p>
                            Kolektif {data1.kolektif.no_kolektif} -{" "}
                            {data1.kolektif.nama}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                    {data1.data.map((data) => {
                      return (
                        <TableRow key={data.id}>
                          <TableCell>{data.no_pelanggan}</TableCell>
                          <TableCell>{data.nama}</TableCell>
                          <TableCell>{data.alamat}</TableCell>
                          <TableCell>
                            {formatPeriode(data.periode_rek)}
                          </TableCell>
                          <TableCell>
                            {data.stanlalu.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell>
                            {data.stanskrg.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell>
                            {data.pakaiskrg.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell>{formatRupiah(data.rekair)}</TableCell>
                          <TableCell>
                            {formatRupiah(Number(data.denda))}
                          </TableCell>
                          <TableCell>{formatRupiah(data.meterai)}</TableCell>
                          <TableCell>
                            {formatRupiah(Number(data.total))}
                          </TableCell>
                        </TableRow>
                      );
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
