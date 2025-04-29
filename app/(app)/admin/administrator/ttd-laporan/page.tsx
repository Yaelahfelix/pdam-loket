"use client";

import React, { useState, useEffect } from "react";
import BreadcrumbsComponent from "./breadcrumbs";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
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
      )}
    </div>
  );
};

export default UserAkses;
