"use client";

import React, { useEffect, useState } from "react";
import {
  addToast,
  Card,
  CardHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { formatRupiah } from "@/lib/utils";

import { formatPeriode } from "@/lib/formatPeriode";

import { KoreksiPembayaran } from "@/types/koreksi-pembayaran";
import { formatDate } from "date-fns";
import { id } from "date-fns/locale";

type Props = {
  data?: KoreksiPembayaran[];
  handler: (ids: string[]) => void;
};

const DataTable = ({ data, handler }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

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
          >
            <TableHeader>
              <TableColumn width={50}>No Pel</TableColumn>
              <TableColumn width={100}>Nama</TableColumn>
              <TableColumn width={50}>Periode</TableColumn>
              <TableColumn width={70}>Tagihan</TableColumn>
              <TableColumn width={70}>Denda</TableColumn>
              <TableColumn width={70}>Materai</TableColumn>
              <TableColumn width={70}>Total</TableColumn>
              <TableColumn width={100}>Kasir</TableColumn>
              <TableColumn width={100}>Loket</TableColumn>
              <TableColumn width={100}>Tgl Bayar</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data, i) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.no_pelanggan}</TableCell>
                    <TableCell>{data.nama}</TableCell>
                    <TableCell>{formatPeriode(data.periode_rek)}</TableCell>
                    <TableCell>{formatRupiah(data.rekair)}</TableCell>
                    <TableCell>{formatRupiah(data.denda)}</TableCell>
                    <TableCell>{formatRupiah(data.meterai)}</TableCell>
                    <TableCell>{formatRupiah(data.total)}</TableCell>
                    <TableCell>{data.kasir}</TableCell>
                    <TableCell>{data.loket}</TableCell>
                    <TableCell>
                      {formatDate(data.tglbayar, "dd MMM yyyy HH:mm:ss", {
                        locale: id,
                      })}
                    </TableCell>
                  </TableRow>
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

export default DataTable;
