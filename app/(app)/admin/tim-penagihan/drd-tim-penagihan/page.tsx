"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import useSWR, { mutate } from "swr";
import {
  addToast,
  Button,
  Card,
  CardBody,
  Divider,
  Radio,
  RadioGroup,
  Skeleton,
  toast,
  useToast,
} from "@heroui/react";
import fetcher from "@/lib/swr/fetcher";
import BreadcrumbsComponent from "./breadcrumbs";
import { DataRayonPetugas, Rayon } from "@/types/plot-tim-tagih";
import TableRayon from "./data-table";
import {
  CalendarArrowUp,
  CircleCheckBig,
  CornerDownLeft,
  FileText,
  RefreshCcw,
} from "lucide-react";
import { ComboboxPetugas } from "./petugas-combobox";
import TableRayonPetugas from "./table-rayon-petugas";
import { getSession } from "@/lib/session";
import MonthPicker from "@/components/ui/monthPicker";
import Filter from "./filter";
import { format } from "date-fns";
import { ErrorResponse } from "@/types/axios";
import { DRDTimPenagihan } from "@/types/drd-tim-penagihan";
import DataTable from "./data-table";
import { TTD } from "@/types/ttd";
import { DekstopSettings } from "@/types/settings";
import PDFCetak from "./pdfPage";
import PDFCetakSisa from "./pdfPageSisa";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import * as XLSX from "xlsx";
import { ExportIcon } from "@/components/icons/accounts/export-icon";

export interface FilterData {
  user: User[];
  loket: Loket[];
}
interface Loket {
  id: number;
  kodeloket: string;
  loket: string;
  aktif: number;
}
interface User {
  id: number;
  nama: string;
}

const DRDTimTagih = () => {
  const [tglPeriode, setTglPeriode] = useState(new Date());
  const [isSearchingPeriode, setIsSearchingPeriode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoadingPeriode, setIsLoadingPeriode] = useState(false);
  const periodeHandler = async () => {
    setIsLoadingPeriode(true);
    const session = await getSession();
    const res = axios
      .get(
        "/api/tim-penagihan/drd-tim-penagihan/cek-periode?periode=" +
          format(tglPeriode, "yyyyMM"),
        {
          headers: {
            Authorization: `Bearer ${session?.token.value}`,
          },
        }
      )
      .then((response) => {
        setIsSearchingPeriode(false);
      })
      .catch(async (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          const { deleteSidebar } = await import("@/lib/sidebar");
          const { deleteAuthCookie } = await import("@/actions/auth.action");
          await deleteSidebar();
          await deleteAuthCookie();
          window.location.href = "/login";
        } else {
          addToast({
            title: "Terjadi kesalahan!",
            description: error.response?.data.message,
            color: "danger",
          });
        }
      })
      .finally(() => setIsLoadingPeriode(false));
  };
  const [filter, setFilter] = useState("");
  const [data, setData] = useState<DRDTimPenagihan[]>([]);
  const [dekstop, setDekstop] = useState<DekstopSettings>();
  const [signatureData, setSignatureData] = useState<TTD>();

  useEffect(() => {
    fetcher("/api/settings/dekstop").then((res) => {
      setDekstop(res.data);
      fetcher("/api/ttd/info").then((res) => {
        setSignatureData(res.data);
      });
    });
  }, []);

  const fetchData = async (filters: any) => {
    setLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("periode", format(tglPeriode, "yyyyMM"));

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });

      // Add order
      // queryParams.append("orderBy", orderField);
      // queryParams.append("orderDir", orderDirection);

      // Make API request
      fetcher(
        `/api/tim-penagihan/drd-tim-penagihan?${queryParams.toString()}`
      ).then((res) => {
        console.log(res);
        setData(res.data);
        setFilter(res.filter);
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const exportExcelHandler = () => {
    if (data.length === 0) return;

    const exportData = data.map((data) => ({
      "No Samb": data.no_pelanggan,
      Nama: data.nama,
      Alamat: data.alamat,
      "Kode Gol": data.kode_golongan,
      Rayon: data.rayon,
      "Tim Tagih": data.timtagih,
      Lbr: data.jmlrek,
      Tagihan: data.ttltagihan,
      "Lbr Lunas": data.lbrlunas,
      "Tagihan Lunas": data.ttltagihanlunas,
      "Lbr Sisa": data.sisarek,
      "Sisa Tagihan": data.sisatagihan,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Tagihan");

    const colWidths = [
      { wch: 12 }, // No Samb
      { wch: 20 }, // Nama
      { wch: 30 }, // Alamat
      { wch: 10 }, // Kode Gol
      { wch: 12 }, // Rayon
      { wch: 10 }, // Tim Tagih
      { wch: 6 }, // Lbr
      { wch: 15 }, // Tagihan
      { wch: 10 }, // Lbr Lunas
      { wch: 15 }, // Tagihan Lunas
      { wch: 10 }, // Lbr Sisa
      { wch: 15 }, // Sisa Tagihan
    ];
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, "data_tagihan.xlsx");
  };
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">DRD Tim Penagihan</h3>
        <div>
          <p>Periode</p>
          <div className="flex gap-5 mb-5">
            <MonthPicker
              currentMonth={tglPeriode}
              isDisabled={!isSearchingPeriode || isLoadingPeriode}
              onMonthChange={(val) => {
                setTglPeriode(val);
              }}
            />
            {isSearchingPeriode ? (
              <Button onPress={periodeHandler} isLoading={isLoadingPeriode}>
                Set
              </Button>
            ) : (
              <Button
                onPress={() => {
                  setData([]);
                  setFilter("");
                  setIsSearchingPeriode(true);
                }}
              >
                Ganti Periode
              </Button>
            )}
          </div>
          <RadioGroup
            label="Pilih Data"
            orientation="horizontal"
            isDisabled={!isSearchingPeriode || isLoadingPeriode}
            defaultValue={"1"}
          >
            <Radio value="1">Bulan 1</Radio>
            <Radio value="2">Bulan 2</Radio>
          </RadioGroup>
        </div>
      </div>
      {!isSearchingPeriode && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={80} className="px-3">
            <div className="flex flex-col gap-5">
              <div className="flex-row-reverse justify-start gap-5 flex w-full">
                <Button
                  onPress={exportExcelHandler}
                  color="success"
                  startContent={<FileText />}
                >
                  Export ke excel
                </Button>
                <PDFCetak
                  alamat1={dekstop?.alamat1}
                  alamat2={dekstop?.alamat2}
                  footer={dekstop?.footerkota}
                  headerlap1={dekstop?.headerlap1}
                  headerlap2={dekstop?.headerlap2}
                  filter={filter}
                  isLoading={false}
                  data={data}
                  signatureData={signatureData}
                />
                <PDFCetakSisa
                  alamat1={dekstop?.alamat1}
                  alamat2={dekstop?.alamat2}
                  footer={dekstop?.footerkota}
                  headerlap1={dekstop?.headerlap1}
                  headerlap2={dekstop?.headerlap2}
                  filter={filter}
                  isLoading={false}
                  data={data}
                  signatureData={signatureData}
                />
              </div>
              <DataTable handler={() => {}} data={data} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} className="px-3">
            <Card className="">
              <CardBody>
                <Filter
                  setIsLoading={setLoading}
                  isLoading={loading}
                  beforeFilter={() => {
                    setData([]);
                    setFilter("");
                  }}
                  onFilter={(filter) => {
                    setLoading(true);
                    fetchData(filter);
                  }}
                  onReset={() => {}}
                  periodData={format(tglPeriode, "yyyyMM")}
                />
              </CardBody>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default DRDTimTagih;
