"use client";

import React, { useEffect } from "react";
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
import { DRDNonAir, TotalDRNonAir } from "@/types/lpp-nonair";
import { useLPPNonAirStore } from "@/store/lppNonAir";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Props = { filterLoading: boolean };

const DataTableClient = ({ filterLoading }: Props) => {
  const searchParams = useSearchParams();
  const tgl1 = searchParams.get("tgl1");
  const tgl2 = searchParams.get("tgl2");
  const { drd, setDrd } = useLPPNonAirStore();
  const { kasir, kasirName, loket, loketName, jenis, jenisName } =
    useFilterStore();
  const extraQuery = new URLSearchParams({
    ...(kasir ? { user_id: kasir, user_name: kasirName } : {}),
    ...(loket ? { loket_id: loket, loket_name: loketName } : {}),
    ...(jenis ? { jenis_id: jenis, jenis_name: jenisName } : {}),
  }).toString();
  const query = extraQuery ? `&${extraQuery}` : "";
  const { data, error, isLoading } = useSWR<{
    data: DRDNonAir[];
    total: TotalDRNonAir;
  }>(
    tgl1 && tgl2
      ? `/api/laporan/lpp-nonair?tgl1=${tgl1}&tgl2=${tgl2}${query}`
      : null,
    fetcher
  );

  useEffect(() => {
    setDrd(data);
  }, [data]);

  return (
    <>
      {isLoading || filterLoading ? (
        <div className="p-5 border rounded-lg">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      ) : error ? (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          Error loading data
        </div>
      ) : (
        <>
          {data && data?.data.length !== 0 ? (
            <div>
              <Table
                classNames={{
                  wrapper: "max-h-[80vh]",
                }}
                isHeaderSticky
              >
                <TableHeader>
                  <TableColumn width={10}>No</TableColumn>
                  <TableColumn width={120}>Tgl Bayar</TableColumn>
                  <TableColumn width={150}>Jenis</TableColumn>
                  <TableColumn width={270}>Nama</TableColumn>
                  <TableColumn width={50}>Jumlah</TableColumn>
                  <TableColumn width={150}>PPN</TableColumn>
                  <TableColumn width={100}>Total</TableColumn>
                  <TableColumn width={100}>Kasir</TableColumn>
                  <TableColumn width={120}>Loket</TableColumn>
                </TableHeader>
                <TableBody items={data.data}>
                  {
                    data?.data.map((data, i) => (
                      <TableRow key={i}>
                        <TableCell>{data.no}</TableCell>
                        <TableCell>
                          {format(new Date(data.tglbayar), "d MMMM yyyy", {
                            locale: id,
                          })}
                        </TableCell>
                        <TableCell>{data.jenisnonair}</TableCell>
                        <TableCell>{data.nama}</TableCell>
                        <TableCell>{data.jumlah}</TableCell>
                        <TableCell>{data.ppn}</TableCell>
                        <TableCell>{data.total}</TableCell>
                        <TableCell>{data.kasir}</TableCell>
                        <TableCell>{data.nama_loket}</TableCell>
                      </TableRow>
                    )) as any
                  }
                </TableBody>
              </Table>
              <Table hideHeader>
                <TableHeader className="sticky top-0">
                  <TableColumn width={10}>No</TableColumn>
                  <TableColumn width={120}>Tgl Bayar</TableColumn>
                  <TableColumn width={150}>Jenis</TableColumn>
                  <TableColumn width={270}>Nama</TableColumn>
                  <TableColumn width={50}>Jumlah</TableColumn>
                  <TableColumn width={150}>PPN</TableColumn>
                  <TableColumn width={100}>Total</TableColumn>
                  <TableColumn width={100}>Kasir</TableColumn>
                  <TableColumn width={120}>Loket</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-bold bg-default-100">
                    <TableCell colSpan={8}>Total</TableCell>

                    <TableCell className="text-right">
                      {data?.total.keseluruhan}
                    </TableCell>
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
