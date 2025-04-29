"use client";
import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { formatRupiah } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { ComboboxPembayaranNonAir } from "@/types/pembayaran-nonair";

type Props = {
  data?: ComboboxPembayaranNonAir[];
  handler: (ids: string[]) => void;
};

const DataTable = ({ data, handler }: Props) => {
  return (
    <>
      {data && data.length !== 0 ? (
        <div>
          <Table
            classNames={{
              td: "first:w-[50px]",
              wrapper: "max-h-[80vh]",
            }}
            isHeaderSticky
            selectionMode="multiple"
            onSelectionChange={(val) => {
              handler(Array.from(val) as any);
            }}
          >
            <TableHeader>
              <TableColumn width={10}>No Bayar</TableColumn>
              <TableColumn width={120}>Jenis</TableColumn>
              <TableColumn width={200}>Nama</TableColumn>
              <TableColumn width={100}>Alamat</TableColumn>
              <TableColumn width={50}>Jumlah</TableColumn>
              <TableColumn width={50}>PPN</TableColumn>
              <TableColumn width={50}>Total</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data, i) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.no_pembayaran}</TableCell>
                    <TableCell>{data.jenisnonair || "-"}</TableCell>

                    <TableCell>{data.nama}</TableCell>
                    <TableCell>{data.alamat}</TableCell>
                    <TableCell>{formatRupiah(data.jumlah)}</TableCell>
                    <TableCell>{formatRupiah(data.ppn)}</TableCell>
                    <TableCell>{formatRupiah(data.total)}</TableCell>
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
