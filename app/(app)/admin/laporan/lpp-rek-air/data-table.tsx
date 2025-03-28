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
import { DRD, TotalDRD } from "@/types/drd";
import { useFilterStore } from "./useFilterStore";

type Props = {};

const DataTableClient = () => {
  const searchParams = useSearchParams();
  const tgl1 = searchParams.get("tgl1");
  const tgl2 = searchParams.get("tgl2");
  const { drd, setDrd } = useLPPRekAirStore();
  const { kasir, loket, golongan, kecamatan } = useFilterStore();
  const extraQuery = new URLSearchParams({
    ...(kasir ? { user_id: kasir } : {}),
    ...(loket ? { loket_id: loket } : {}),
    ...(golongan ? { gol_id: golongan } : {}),
    ...(kecamatan ? { kec_id: kecamatan } : {}),
  }).toString();
  const query = extraQuery ? `&${extraQuery}` : "";
  const { data, error, isLoading } = useSWR<{ data: DRD[]; total: TotalDRD }>(
    tgl1 && tgl2
      ? `/api/laporan/lpp-rekair?tgl1=${tgl1}&tgl2=${tgl2}${query}`
      : null,
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
          {data ? (
            <div>
              <Table
                classNames={{
                  wrapper: "max-h-[80vh]",
                }}
                isHeaderSticky
              >
                <TableHeader>
                  <TableColumn width={10}>No</TableColumn>
                  <TableColumn width={120}>Periode</TableColumn>
                  <TableColumn width={150}>No Pelanggan</TableColumn>
                  <TableColumn width={270}>Nama</TableColumn>
                  <TableColumn width={50}>Kode Gol</TableColumn>
                  <TableColumn width={150}>Rek Air</TableColumn>
                  <TableColumn width={100}>Meterai</TableColumn>
                  <TableColumn width={100}>Denda</TableColumn>
                  <TableColumn width={120}>Admin PPOB</TableColumn>
                  <TableColumn width={150}>Total</TableColumn>
                </TableHeader>
                <TableBody items={data.data}>
                  {
                    data?.data.map((data, i) => (
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
                    )) as any
                  }
                </TableBody>
              </Table>
              <Table hideHeader>
                <TableHeader className="sticky top-0">
                  <TableColumn width={10}>No</TableColumn>
                  <TableColumn width={120}>Periode</TableColumn>
                  <TableColumn width={150}>No Pelanggan</TableColumn>
                  <TableColumn width={270}>Nama</TableColumn>
                  <TableColumn width={50}>Kode Gol</TableColumn>
                  <TableColumn width={150}>Rek Air</TableColumn>
                  <TableColumn width={100}>Meterai</TableColumn>
                  <TableColumn width={100}>Denda</TableColumn>
                  <TableColumn width={120}>Admin PPOB</TableColumn>
                  <TableColumn width={150}>Total</TableColumn>
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
            <Card>
              <CardHeader className="p-5 justify-center items-center flex flex-row">
                <div className="text-center">Tidak ada data</div>
              </CardHeader>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default DataTableClient;
