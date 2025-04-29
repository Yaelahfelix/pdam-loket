"use client";

import React, { useEffect, useState } from "react";

import {
  addToast,
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

import { formatPeriode } from "@/lib/formatPeriode";
import { PembatalanRekAir } from "@/types/pembatalan-rekair";

type Props = {
  data?: PembatalanRekAir[];
  setData: React.Dispatch<React.SetStateAction<PembatalanRekAir[]>>;
  strictPayment: boolean;
  handler: (ids: string[] | "all") => void;
};

const DataTableTunggal = ({ data, setData, strictPayment, handler }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

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
              <TableColumn width={10}>No Pel</TableColumn>
              <TableColumn width={120}>Nama</TableColumn>
              <TableColumn width={100}>Periode</TableColumn>
              <TableColumn width={50}>Tagihan</TableColumn>
              <TableColumn width={50}>Denda</TableColumn>
              <TableColumn width={100}>Materai</TableColumn>
              <TableColumn width={100}>Total</TableColumn>
              <TableColumn width={100}>Kasir</TableColumn>
              <TableColumn width={100}>Loket</TableColumn>
              <TableColumn width={100}>Tgl Bayar</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data, i) => (
                  <TableRow key={data.id}>
                    <TableCell>
                      <div
                        // @ts-ignore
                        style={{ backgroundColor: data.color }}
                        className="rounded-lg shadow p-1 text-center"
                      >
                        {data.no_pelanggan}
                      </div>
                    </TableCell>
                    <TableCell>{data.nama}</TableCell>
                    <TableCell>{formatPeriode(data.periode_rek)}</TableCell>
                    <TableCell>{formatRupiah(data.rekair)}</TableCell>
                    <TableCell>{formatRupiah(Number(data.denda))}</TableCell>
                    <TableCell>{formatRupiah(data.meterai)}</TableCell>
                    <TableCell>{formatRupiah(Number(data.total))}</TableCell>

                    <TableCell>{data.kasir}</TableCell>
                    <TableCell>{data.loket}</TableCell>
                    <TableCell>{data.tglbayar}</TableCell>
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
