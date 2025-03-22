"use client";

import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { columns } from "./columns";
import { useLPPRekAirStore } from "@/store/lppRekAir";
import useSWR from "swr";
import fetcher from "@/lib/swr/fetcher";
import { useSearchParams } from "next/navigation";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { DRD, TotalDRD } from "@/types/drd";

type Props = {};

const DataTableClient = () => {
  const searchParams = useSearchParams();
  const tgl1 = searchParams.get("tgl1");
  const tgl2 = searchParams.get("tgl2");
  const { drd, setDrd } = useLPPRekAirStore();
  const { data, error, isLoading } = useSWR<{ data: DRD[]; total: TotalDRD }>(
    tgl1 && tgl2 ? `/api/laporan/lpp-rekair?tgl1=${tgl1}&tgl2=${tgl2}` : null,
    fetcher
  );

  useEffect(() => {
    setDrd(data);
  }, [data]);

  return (
    <>
      {isLoading ? (
        <div className="p-5 border rounded-lg">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      ) : error ? (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          Error loading data
        </div>
      ) : (
        <>
          {data?.data.length !== 0 ? (
            <div>
              <Table
                classNames={{
                  table: "w-full table-fixed", // Make sure the table uses fixed layout
                  tbody: "max-h-[80vh] overflow-y-auto block",
                  thead: "block table-fixed w-full items-center", // Make header match the body width
                  tr: "flex w-full", // Use flex for rows
                  th: "flex-1 flex items-center justify-start",
                  td: "flex-1", // Make body cells flex
                }}
              >
                <TableHeader className="sticky top-0">
                  <TableColumn>No</TableColumn>
                  <TableColumn>Periode</TableColumn>
                  <TableColumn>No Pelanggan</TableColumn>
                  <TableColumn>Nama</TableColumn>
                  <TableColumn>Kode Gol</TableColumn>
                  <TableColumn>Rek Air</TableColumn>
                  <TableColumn>Meterai</TableColumn>
                  <TableColumn>Denda</TableColumn>
                  <TableColumn>Admin PPOB</TableColumn>
                  <TableColumn>Total</TableColumn>
                </TableHeader>
                <TableBody>
                  {
                    data?.data.map((data, i) => {
                      return (
                        <>
                          <TableRow key={i}>
                            <TableCell>{data.no}</TableCell>
                            <TableCell>{data.periodestr}</TableCell>
                            <TableCell>{data.no_pelanggan}</TableCell>
                            <TableCell>{data.nama}</TableCell>
                            <TableCell>{data.kodegol}</TableCell>
                            <TableCell>{data.rekair}</TableCell>
                            <TableCell>{data.meterai}</TableCell>
                            <TableCell>{data.denda}</TableCell>
                            <TableCell>{data.admin_ppob}</TableCell>
                            <TableCell>{data.total}</TableCell>
                          </TableRow>
                        </>
                      );
                    }) as any
                  }
                </TableBody>
              </Table>
              <Table hideHeader aria-label="Table footer with totals">
                <TableHeader className="sticky top-0">
                  <TableColumn>No</TableColumn>
                  <TableColumn>Periode</TableColumn>
                  <TableColumn>No Pelanggan</TableColumn>
                  <TableColumn>Nama</TableColumn>
                  <TableColumn>Kode Gol</TableColumn>
                  <TableColumn>Rek Air</TableColumn>
                  <TableColumn>Meterai</TableColumn>
                  <TableColumn>Denda</TableColumn>
                  <TableColumn>Admin PPOB</TableColumn>
                  <TableColumn>Total</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-bold bg-default-100">
                    <TableCell colSpan={5}>Total</TableCell>
                    <TableCell>{data?.total.rekair}</TableCell>
                    <TableCell>{data?.total.meterai}</TableCell>
                    <TableCell>{data?.total.denda}</TableCell>
                    <TableCell>{data?.total.admin_ppob}</TableCell>
                    <TableCell>{data?.total.keseluruhan}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div>Tidak ada data</div>
          )}
        </>
      )}
    </>
  );
};

export default DataTableClient;
