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
import { TagihanPelcoklit } from "@/types/pelCoklit";
import { formatPeriode } from "@/lib/formatPeriode";

type Props = {
  data?: TagihanPelcoklit[];
};

const DataTable = ({ data }: Props) => {
  return (
    <>
      {data && data.length !== 0 ? (
        <div>
          <Table
            classNames={{
              wrapper: "max-h-[80vh]",
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
              <TableColumn width={50}>Pakai</TableColumn>
              <TableColumn width={50}>Tagihan</TableColumn>
              <TableColumn width={50}>Denda</TableColumn>
              <TableColumn width={50}>Materai</TableColumn>
              <TableColumn width={50}>Total</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data, i) =>
                  data.tagihan.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell>{data.no_pelanggan}</TableCell>
                      <TableCell>{data.nama}</TableCell>

                      <TableCell>{data.alamat}</TableCell>
                      <TableCell>{formatPeriode(data.periode_rek)}</TableCell>

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
                        {formatRupiah(
                          Number(data.denda1) + Number(data.denda2)
                        )}
                      </TableCell>
                      <TableCell>{formatRupiah(data.materai)}</TableCell>
                      <TableCell>
                        {formatRupiah(Number(data.totalrek))}
                      </TableCell>
                    </TableRow>
                  ))
                ) as any
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
