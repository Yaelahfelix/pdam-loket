"use client";

import React, { useEffect, useState } from "react";

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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { formatRupiah } from "@/lib/utils";

import { PembatalanNonAir } from "@/types/pembatalan-nonair";

type Props = {
  data?: PembatalanNonAir[];
  setData: React.Dispatch<React.SetStateAction<PembatalanNonAir[]>>;
  strictPayment: boolean;
};

const DataTableTunggal = ({ data, setData, strictPayment }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {data && data.length !== 0 ? (
        <div>
          <Table
            classNames={{
              wrapper: "max-h-[80vh]",
            }}
            isHeaderSticky
            color="warning"
            selectionMode="single"
            onSelectionChange={(val) => {
              setIsOpen(true);
              console.log(Array.from(val));
            }}
          >
            <TableHeader>
              <TableColumn width={120}>No Bayar</TableColumn>
              <TableColumn width={10}>Jenis</TableColumn>
              <TableColumn width={100}>Nama</TableColumn>
              <TableColumn width={100}>Alamat</TableColumn>
              <TableColumn width={50}>Jumlah</TableColumn>
              <TableColumn width={100}>PPN</TableColumn>
              <TableColumn width={100}>Total</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data, i) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.nobayar}</TableCell>
                    <TableCell>{data.jenisnonair}</TableCell>
                    <TableCell>{data.nama}</TableCell>
                    <TableCell>{data.alamat}</TableCell>
                    <TableCell>{formatRupiah(Number(data.jumlah))}</TableCell>
                    <TableCell>{formatRupiah(data.ppn)}</TableCell>
                    <TableCell>{formatRupiah(Number(data.total))}</TableCell>
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

export default DataTableTunggal;
