"use client";

import React, { useState, useEffect } from "react";
import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { BASEURL } from "@/constant";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import {
  Button,
  CalendarDate,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  DatePicker,
  Select,
  SelectItem,
  Skeleton,
  Tab,
  Tabs,
} from "@heroui/react";
import fetcher from "@/lib/swr/fetcher";
import BreadcrumbsComponent from "./breadcrumbs";
import { useInitFilterStore } from "./useFilterStore";
import { ComboboxPelanggan } from "@/components/combobox/pelanggan";
import { getLocalTimeZone, today } from "@internationalized/date";
import { format } from "date-fns";
import { KoreksiPembayaran } from "@/types/koreksi-pembayaran";
import DataTable from "./data-table";
import KoreksiHandler from "./koreksiHandler";

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

const UserAkses = () => {
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>({
    user: [],
    loket: [],
  });
  const [tgl, setTgl] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [selectedFilter, setSelectedFilter] = useState("");
  const [resTipeFilter, setResTipeFilter] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorTunggal, setErrorTunggal] = useState<any>(null);
  const [selectedNopel, setSelectedNopel] = useState("");
  const [selectedKasir, setSelectedKasir] = useState("");
  const [selectedLoket, setSelectedLoket] = useState("");
  const [data, setData] = useState<KoreksiPembayaran[]>([]);
  const [selectedData, setSelectedData] = useState<KoreksiPembayaran[]>([]);

  console.log(selectedKasir);
  const getFilterData = async () => {
    setFilterLoading(true);

    try {
      const [userResponse, loketResponse] = await Promise.all([
        fetcher("/api/info/user"),
        fetcher("/api/info/loket"),
      ]);

      setFilterData({
        user: userResponse.data,
        loket: loketResponse.data,
      });
    } catch (error) {
    } finally {
      setFilterLoading(false);
    }
  };
  useEffect(() => {
    getFilterData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const formattedDate = format(tgl?.toDate("Asia/Jakarta"), "yyyy-MM-dd");

    const kasirid = Array.from(selectedKasir)[0];
    const loketid = Array.from(selectedLoket)[0];
    try {
      const url = `/api/koreksi-pembayaran?tglbayar=${formattedDate}&filter=${selectedFilter}&kasir_id=${kasirid}&loket_id=${loketid}&nopel=${selectedNopel}`;
      const response = await fetcher(url);

      setErrorTunggal(null);
      setData(response.data);
      setResTipeFilter(response.tipeFilter);
    } catch (error) {
      setErrorTunggal(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">Koreksi Pembayaran Rekening Air</h3>
      <Card>
        <CardHeader className="justify-center">
          Pengaturan pencarian data
        </CardHeader>
        <CardBody className="flex gap-5 flex-row items-center justify-center">
          <DatePicker
            className="w-full max-w-xs"
            variant="bordered"
            label="Tanggal"
            value={tgl}
            onChange={(tgl) => {
              if (!tgl) return;
              setTgl(tgl);
            }}
          />
          <div className="p-5 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col max-w-sm">
            <Checkbox
              isSelected={isFilter}
              className="mb-3"
              onValueChange={(val) => {
                setIsFilter(val);
                if (val) {
                  setSelectedFilter("nopel");
                } else {
                  setSelectedNopel("");
                  setSelectedFilter("");
                }
              }}
            >
              Aktifkan Filter
            </Checkbox>
            <Tabs
              aria-label="Filter"
              selectedKey={selectedFilter}
              onSelectionChange={(val) => {
                setSelectedFilter(val.toString());
                setSelectedNopel("");
                setSelectedKasir("");
                setSelectedLoket("");
              }}
              isDisabled={!isFilter}
            >
              <Tab key="nopel" title="No Pelanggan">
                <div className="max-w-xs">
                  <ComboboxPelanggan
                    handler={(val) => {
                      setSelectedNopel(val);
                    }}
                  />
                </div>
              </Tab>
              <Tab key="kasir" title="Kasir">
                <Select
                  className="max-w-xs"
                  label="Pilih kasir"
                  selectedKeys={selectedKasir}
                  onSelectionChange={(val) => {
                    setSelectedKasir(val as any);
                  }}
                >
                  {filterData.user.map((data) => (
                    <SelectItem key={data.id}>{data.nama}</SelectItem>
                  ))}
                </Select>
              </Tab>
              <Tab key="loket" title="Loket">
                <Select
                  className="max-w-xs"
                  label="Pilih loket"
                  selectedKeys={selectedLoket}
                  onSelectionChange={(val) => {
                    setSelectedLoket(val as any);
                  }}
                >
                  {filterData.loket.map((data) => (
                    <SelectItem key={data.id}>{data.loket}</SelectItem>
                  ))}
                </Select>
              </Tab>
            </Tabs>
          </div>
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            className="w-full"
            isLoading={isLoading}
            onPress={getData}
          >
            Cari Data
          </Button>
        </CardFooter>
      </Card>

      <DataTable
        data={data}
        handler={(ids) => {
          const filteredData = data.filter((item) =>
            ids.includes(String(item.id))
          );

          setSelectedData(filteredData);
        }}
      />

      <div></div>
      <KoreksiHandler
        tipeFilter={resTipeFilter}
        filter={filterData}
        defaultKasir={selectedKasir}
        data={selectedData}
        defaultLoket={selectedLoket}
      />
    </div>
  );
};

export default UserAkses;
