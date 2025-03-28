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
import { columns } from "./columns";

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
  const [filterData, setFilterData] = useState<FilterData>({
    golongan: [],
    user: [],
    kecamatan: [],
    loket: [],
  });
  const getFilterData = async () => {
    const { data: golongan } = await fetcher("/api/info/golongan");
    const { data: user } = await fetcher("/api/info/user");
    const { data: kecamatan } = await fetcher("/api/info/kecamatan");
    const { data: loket } = await fetcher("/api/info/loket");

    setFilterData({
      golongan,
      user,
      kecamatan,
      loket,
    });
  };
  useEffect(() => {
    getFilterData();
  }, []);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">LPP Rek Air</h3>

      <TableFunction filter={filterData} />
      <DataTableClient />
    </div>
  );
};

export default UserAkses;
