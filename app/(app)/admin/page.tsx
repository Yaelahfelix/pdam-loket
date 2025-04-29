"use client";

import { PieChartComp } from "@/components/pie-chart";
import { Card, CardBody, Divider, Skeleton } from "@heroui/react";
import React from "react";
import CardStatus from "./card";
import useSWR from "swr";
import fetcher from "@/lib/swr/fetcher";
import { BacameterResponse, DashboardResponse } from "@/app/api/dashboard/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils";
import { formatDate } from "date-fns";
import { id } from "date-fns/locale";

const Home = () => {
  const classNames = React.useMemo(
    () => ({
      wrapper: ["rounded-t-none"],
    }),
    []
  );

  const { data, error, isLoading } = useSWR<DashboardResponse>(
    `/api/dashboard`,
    fetcher
  );

  const {
    data: dataBacameter,
    error: errorBacameter,
    isLoading: isLoadingBacameter,
  } = useSWR<BacameterResponse>(`/api/dashboard/drd`, fetcher);

  console.log(dataBacameter);

  return (
    <div className="p-20">
      <div className="flex justify-between">
        <div className="w-4/12">
          <h1 className="text-3xl">Selamat Datang di Dashboard</h1>
          <h1 className="text-5xl mt-3 font-bold">Loket PDAM</h1>
        </div>
      </div>
      <Divider className="my-5" />
      {!isLoading && !isLoadingBacameter ? (
        <>
          <div className="flex gap-5 justify-between flex-col">
            <div className="flex-grow flex flex-row gap-5">
              <CardStatus
                title="Jumlah Penerimaan Uang"
                value={parseInt(data?.total.penerimaanUang || "0")}
              />
              <CardStatus
                title="Jumlah Piutang"
                value={data?.total.piutang || 0}
              />
              <CardStatus
                title="Jumlah DRD Berjalan"
                value={dataBacameter ? dataBacameter?.total.jumlahdrd : 0}
              />
              <CardStatus
                title="Jumlah Pelanggan Baru"
                value={data?.total.pelangganBaru || 0}
              />
            </div>

            <div className="gap-5 flex ">
              <div className="w-6/12">
                <PieChartComp
                  data={
                    dataBacameter
                      ? [
                          {
                            jenis: "Belum Baca",
                            total: String(dataBacameter.total.belumbaca),
                            totalINT: String(dataBacameter.total.belumbaca),
                          },
                          {
                            jenis: "Sudah Baca",
                            total: String(dataBacameter.total.sudahbaca),
                            totalINT: String(dataBacameter.total.sudahbaca),
                          },
                        ]
                      : [
                          {
                            jenis: "Tidak ada data",
                            total: "0",
                            totalINT: "0",
                          },
                        ]
                  }
                  title="Status Pembacaan Meter"
                  description="Berdasarkan Total Belum & Sudah Baca"
                  footerText={`Total Belum & Sudah Baca: ${
                    dataBacameter
                      ? (
                          dataBacameter?.total.belumbaca +
                          dataBacameter?.total.sudahbaca
                        ).toLocaleString("id-ID")
                      : "-"
                  }`}
                />
              </div>
              <div className="w-6/12">
                <PieChartComp
                  data={[
                    {
                      jenis: "Belum Lunas",
                      total: data?.total.efesiensi.jumlahBelumLunas || "0",
                      totalINT: data?.total.efesiensi.jumlahBelumLunas || "0",
                    },
                    {
                      jenis: "Sudah Lunas",
                      total: data?.total.efesiensi.jumlahLunas || "0",
                      totalINT: data?.total.efesiensi.jumlahLunas || "0",
                    },
                  ]}
                  title="Efesiensi Penagihan"
                  description="Berdasarkan Total Rekening"
                  footerText={`Total Rekening: ${
                    data
                      ? (
                          parseInt(data?.total.efesiensi.jumlahBelumLunas) +
                          parseInt(data?.total.efesiensi.jumlahLunas)
                        ).toLocaleString("id-ID")
                      : "-"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-5 mt-5">
            <div className="w-6/12">
              <h3 className="text-center font-bold">Tabel Piutang</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Golongan</TableHead>
                    <TableHead>Kode Gol</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.piutang.map((data, i) => (
                    <TableRow key={i}>
                      <TableCell>{data.golongan}</TableCell>
                      <TableCell>{data.kodegol}</TableCell>
                      <TableCell>
                        {formatRupiah(parseInt(data.total))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="w-6/12">
              <h3 className="text-center font-bold">Tabel DRD</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Petugas Plot</TableHead>
                    <TableHead>Jumlah DRD</TableHead>
                    <TableHead>Belum Baca</TableHead>
                    <TableHead>Sudah Baca</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataBacameter?.data.map((data, i) => (
                    <TableRow key={i}>
                      <TableCell>{data.petugas_plot}</TableCell>
                      <TableCell>
                        {parseInt(data.jumlahdrd).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {parseInt(data.belumbaca).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {parseInt(data.sudahbaca).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-center font-bold">Tabel Pelanggan Baru</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No Pelanggan</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Tgl Pasang</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.pelBaru.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell>{data.nopel}</TableCell>
                    <TableCell>{data.nama}</TableCell>
                    <TableCell>{data.alamat}</TableCell>
                    <TableCell>
                      {formatDate(data.tglPasang, "dd MMM yyyy", {
                        locale: id,
                      })}
                    </TableCell>
                    <TableCell>{formatRupiah(data.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <>
          <Skeleton className="w-full" />
        </>
      )}
    </div>
  );
};

export default Home;
