"use client";

import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  CUDataPembayaranRekAir,
  DataPembayaranRekAir,
} from "@/types/pembayran-rekair";
import { formatRupiah } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { formatPeriode } from "@/lib/formatPeriode";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Props = {
  data?: CUDataPembayaranRekAir[];
  setData: React.Dispatch<React.SetStateAction<CUDataPembayaranRekAir[]>>;
  strictPayment: boolean;
  handler: (ids: string[]) => void;
};

const DataTableTunggal = ({ data, setData, strictPayment, handler }: Props) => {
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
              <TableColumn width={10}>No Pel</TableColumn>
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
                    <TableCell>
                      {formatRupiah(Number(data.harga_air))}
                    </TableCell>
                    <TableCell>{formatRupiah(Number(data.denda))}</TableCell>
                    <TableCell>{formatRupiah(data.meterai)}</TableCell>
                    <TableCell>{formatRupiah(Number(data.denda))}</TableCell>
                    <TableCell>{data.kasir}</TableCell>
                    <TableCell>{data.loket}</TableCell>
                    <TableCell>
                      {format(data.tglbayar, "dd MMM yyyy HH:mm:ss", {
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

export default DataTableTunggal;
