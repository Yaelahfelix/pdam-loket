"use client";

import React, { useEffect } from "react";
import useSWR from "swr";
import fetcher from "@/lib/swr/fetcher";
import { useSearchParams } from "next/navigation";
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
  DataKolektif,
  TagihanBlmLunasInfoPel,
  TagihanSdhLunasInfoPel,
  TotalTagihan,
} from "@/types/info-pelanggan";
import { useInfoPelStore } from "@/store/infopel";
import { format } from "date-fns";
import { formatRupiah } from "@/lib/utils";
import { KolektifTable, PelangganTable } from "./table-comp";

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
      total: string;
    }[];
    dataKolektif: DataKolektif;
    totalBlmLunas: string;
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
    if (kolektifData) {
      setData({
        kolektifBlmLunas: kolektifData.kolektifBlmLunas,
        totalBlmLunas: kolektifData.totalBlmLunas,
        dataKolektif: kolektifData.dataKolektif,
      });
    }
  }, [pelangganData, kolektifData]);

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
          {(pelangganData &&
            (pelangganData?.tagihanSdhLunas.length !== 0 ||
              pelangganData?.tagihanBlmLunas.length !== 0)) ||
          (kolektifData && kolektifData?.kolektifBlmLunas.length !== 0) ? (
            <>
              {pelangganData && (
                <PelangganTable pelangganData={pelangganData} />
              )}
              {kolektifData && <KolektifTable kolektifData={kolektifData} />}
            </>
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
