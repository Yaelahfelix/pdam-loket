"use client";

import React, { useState, useEffect } from "react";
import { columns } from "./columns";
import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { BASEURL } from "@/constant";
import TableFunction from "./tableFunction";
import BreadcrumbsComponent from "./breadcrumbs";
import DataTableClient from "./data-table";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import { Skeleton } from "@heroui/react";
import fetcher from "@/lib/swr/fetcher";
import { TTD } from "@/types/ttd";
import { FormTTD } from "./form";

const UserAkses = () => {
  const searchParams = useSearchParams();
  const { data, error, isLoading } = useSWR<{ data: TTD[] }>(
    `/api/ttd`,
    fetcher
  );

  console.log(data);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">TTD Laporan</h3>

      {/* <TableFunction
        loket={loket}
        roles={roles}
        filter={{
          is_user_active: isUserActive,
          is_user_ppob: isUserPPOB,
          is_user_timtagih: isUserTimtagih,
        }}
        limit={String(limit)}
      /> */}
      {isLoading ? (
        <div className="p-5 border rounded-lg">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      ) : error ? (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          Error loading data
        </div>
      ) : (
        <div className="flex  gap-5 justify-center flex-wrap flex-row w-full ">
          {data!.data.map((data) => (
            <div className="w-[45%]">
              <FormTTD data={data} />
            </div>
          ))}
        </div>
        // <DataTableClient
        //   columns={columns}
        //   data={userData}
        //   params={Object.fromEntries(searchParams.entries())}
        // />
      )}
    </div>
  );
};

export default UserAkses;
