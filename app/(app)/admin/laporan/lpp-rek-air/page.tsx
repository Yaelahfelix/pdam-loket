"use client";

import React, { useState, useEffect } from "react";
import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { BASEURL } from "@/constant";
import DataTableClient from "./data-table";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import { Skeleton } from "@heroui/react";
import fetcher from "@/lib/swr/fetcher";
import TableFunction from "./tableFunction";
import BreadcrumbsComponent from "./breadcrumbs";
import { useInitFilterStore } from "./useFilterStore";

export interface FilterData {
  golongan: Golongan[];
  user: User[];
  kecamatan: User[];
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
interface Golongan {
  id: number;
  kode_golongan: string;
  nama: string;
}

const UserAkses = () => {
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>({
    golongan: [],
    user: [],
    kecamatan: [],
    loket: [],
  });
  const getFilterData = async () => {
    setFilterLoading(true);

    try {
      const [golonganResponse, userResponse, kecamatanResponse, loketResponse] =
        await Promise.all([
          fetcher("/api/info/golongan"),
          fetcher("/api/info/user"),
          fetcher("/api/info/kecamatan"),
          fetcher("/api/info/loket"),
        ]);

      setFilterData({
        golongan: golonganResponse.data,
        user: userResponse.data,
        kecamatan: kecamatanResponse.data,
        loket: loketResponse.data,
      });
    } catch (error) {
    } finally {
      setFilterLoading(false);
    }
  };
  useInitFilterStore();
  useEffect(() => {
    getFilterData();
  }, []);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">LPP Rek Air</h3>

      <TableFunction filter={filterData} />
      <DataTableClient filterLoading={filterLoading} />
    </div>
  );
};

export default UserAkses;
