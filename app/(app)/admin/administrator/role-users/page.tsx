"use client";

import React, { useState, useEffect } from "react";
import { columns } from "./columns";
import { BASEURL } from "@/constant";
import BreadcrumbsComponent from "./breadcrumbs";
import DataTableClient from "./data-table";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { ErrorResponse } from "@/types/axios";
import { Skeleton } from "@heroui/react";
import fetcher from "@/lib/swr/fetcher";
import TableFunction from "./tableFunction";

const UserAkses = () => {
  const { data, error, isLoading } = useSWR(
    `${BASEURL}/api/administrator/role-users`,
    fetcher
  );

  const searchParams = useSearchParams();
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">Role Users</h3>
      <TableFunction />
      {isLoading ? (
        <div className="p-5 border rounded-lg">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      ) : error ? (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          Error loading data
        </div>
      ) : (
        <DataTableClient
          columns={columns}
          data={data}
          params={Object.fromEntries(searchParams.entries())}
        />
      )}
    </div>
  );
};

export default UserAkses;
