"use client";

import Link from "next/link";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import axios, { AxiosError } from "axios";
import { BASEURL } from "@/constant";
import { getSession } from "@/lib/session";
import { deleteAuthCookie } from "@/actions/auth.action";
import { redirect, useSearchParams } from "next/navigation";
import TableFunction from "./tableFunction";
import BreadcrumbsComponent from "./breadcrumbs";
import { deleteSidebar } from "@/lib/sidebar";
import useSWR from "swr";
import fetcher from "@/lib/swr/fetcher";
import { Skeleton } from "@heroui/react";

const LoketAkses = ({}: {}) => {
  const searchParams = useSearchParams();

  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 10;
  const query = searchParams.get("q") || "";
  const buildUserAccessUrl = () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (query) {
      params.append("q", query);
    }
    return `${BASEURL}/api/administrator/master-loket?${params.toString()}`;
  };

  const { data, error, isLoading } = useSWR(buildUserAccessUrl(), fetcher);
  console.log(data);
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />

      <h3 className="text-xl font-semibold">Master Loket</h3>

      <TableFunction limit={(String(limit) as string) || "10"} />
      {isLoading ? (
        <div className="p-5 border rounded-lg">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      ) : error ? (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          Error loading data
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data.data}
            pagination={data.pagination}
            limitPage={String(limit) || "10"}
          />
        </>
      )}
    </div>
  );
};

export default LoketAkses;
