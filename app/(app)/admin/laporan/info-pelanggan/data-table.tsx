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
import { id } from "date-fns/locale";
import {
  Card,
  CardHeader,
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { DRD, TotalDRD } from "@/types/drd";
import {
  TagihanBlmLunasInfoPel,
  TagihanSdhLunasInfoPel,
  TotalTagihan,
} from "@/types/info-pelanggan";
import { useInfoPelStore } from "@/store/infopel";
import { format } from "date-fns";
import { formatRupiah } from "@/lib/utils";

type Props = {};

const DataTableClient = () => {
  const searchParams = useSearchParams();
  const noPelanggan = searchParams.get("no-pelanggan");
  const noKolektif = searchParams.get("kolektif_id");
  const { setData } = useInfoPelStore();
  const {
    data: pelangganData,
    error: pelangganError,
    isLoading: pelangganLoading,
  } = useSWR<{
    tagihanBlmLunas: TagihanBlmLunasInfoPel[];
    tagihanSdhLunas: TagihanSdhLunasInfoPel[];
    total: TotalTagihan;
  }>(
    noPelanggan
      ? `/api/laporan/info-pelanggan/by-pelanggan?no-pelanggan=${noPelanggan}`
      : null,
    fetcher
  );

  const {
    data: kolektifData,
    error: kolektifError,
    isLoading: kolektifLoading,
  } = useSWR<{
    kolektifBlmLunas: {
      tagihanBlmLunas: TagihanBlmLunasInfoPel[];
    }[];
  }>(
    noKolektif
      ? `/api/laporan/info-pelanggan/by-kolektif?kolektif_id=${noKolektif}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (pelangganData) {
      console.log(pelangganData);
      setData({
        tagihanBlmLunas: pelangganData!.tagihanBlmLunas,
        tagihanSdhLunas: pelangganData!.tagihanSdhLunas,
        total: pelangganData!.total,
      });
    }
  }, [pelangganData]);

  console.log(kolektifData);

  return (
    <>
      {pelangganLoading || kolektifLoading ? (
        <div className="p-5 border rounded-lg">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      ) : pelangganError || kolektifError ? (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          Error loading data
        </div>
      ) : (
        <>
          {pelangganData || kolektifData ? (
            <div>
              <Table
                classNames={{
                  table: "w-full table-fixed",
                  tbody: "max-h-[80vh] overflow-y-auto block",
                  thead: "block table-fixed w-full items-center",
                  tr: "flex w-full",
                  th: "flex-1 flex items-center justify-start",
                  td: "flex-1",
                }}
              >
                <TableHeader className="sticky top-0">
                  <TableColumn width={100}>Lunas</TableColumn>
                  <TableColumn width={150}>Kasir</TableColumn>
                  <TableColumn width={100}>Loket</TableColumn>
                  <TableColumn width={150}>Tgl Bayar</TableColumn>
                  <TableColumn width={120}>Periode</TableColumn>
                  <TableColumn width={100}>S. Lalu</TableColumn>
                  <TableColumn width={100}>S. Skrg</TableColumn>
                  <TableColumn width={100}>Pakai</TableColumn>
                  <TableColumn width={120}>Tagihan</TableColumn>
                  <TableColumn width={100}>Denda</TableColumn>
                  <TableColumn width={100}>Materai</TableColumn>
                  <TableColumn width={150}>Total</TableColumn>
                </TableHeader>
                <TableBody>
                  {pelangganData &&
                    (pelangganData?.tagihanBlmLunas.map((data, i) => {
                      return (
                        <>
                          <TableRow key={i}>
                            <TableCell>
                              <Checkbox isDisabled />
                            </TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{data.periode_rek}</TableCell>
                            <TableCell>{data.stanlalu}</TableCell>
                            <TableCell>{data.stanskrg}</TableCell>
                            <TableCell>{data.pakaiskrg}</TableCell>
                            <TableCell>{formatRupiah(data.rekair)}</TableCell>
                            <TableCell>
                              {formatRupiah(Number(data.denda1))}
                            </TableCell>
                            <TableCell>{formatRupiah(data.materai)}</TableCell>
                            <TableCell>
                              {formatRupiah(Number(data.totalrek))}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    }) as any)}
                  {kolektifData &&
                    kolektifData?.kolektifBlmLunas.map((tagihan, i) => {
                      return tagihan.tagihanBlmLunas.map((data, i) => {
                        return (
                          <>
                            <TableRow key={i}>
                              <TableCell>
                                <Checkbox isDisabled />
                              </TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>{data.periode_rek}</TableCell>
                              <TableCell>{data.stanlalu}</TableCell>
                              <TableCell>{data.stanskrg}</TableCell>
                              <TableCell>{data.pakaiskrg}</TableCell>
                              <TableCell>{formatRupiah(data.rekair)}</TableCell>
                              <TableCell>
                                {formatRupiah(Number(data.denda1))}
                              </TableCell>
                              <TableCell>
                                {formatRupiah(data.materai)}
                              </TableCell>
                              <TableCell>
                                {formatRupiah(Number(data.totalrek))}
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      }) as any;
                    })}
                  {pelangganData &&
                    (pelangganData?.tagihanSdhLunas.map((data, i) => {
                      return (
                        <>
                          <TableRow key={i}>
                            <TableCell>
                              <Checkbox
                                isSelected={true}
                                defaultSelected={true}
                                isDisabled
                                color="success"
                              />
                            </TableCell>
                            <TableCell>{data.kasir}</TableCell>
                            <TableCell>{data.loket}</TableCell>
                            <TableCell>
                              {format(
                                new Date(data.tglbayar),
                                "dd MMM yyyy HH:mm:ss",
                                { locale: id }
                              )}
                            </TableCell>
                            <TableCell>{data.periode_rek}</TableCell>
                            <TableCell>{data.stanlalu}</TableCell>
                            <TableCell>{data.stanskrg}</TableCell>
                            <TableCell>{data.pakaiskrg}</TableCell>

                            <TableCell>{formatRupiah(data.rekair)}</TableCell>
                            <TableCell>
                              {formatRupiah(Number(data.denda))}
                            </TableCell>
                            <TableCell>{formatRupiah(data.meterai)}</TableCell>
                            <TableCell>
                              {formatRupiah(Number(data.total))}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    }) as any)}
                </TableBody>
              </Table>
              {/* <Table hideHeader aria-label="Table footer with totals">
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
              </Table> */}
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
