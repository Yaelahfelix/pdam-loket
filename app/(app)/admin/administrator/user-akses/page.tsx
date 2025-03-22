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

const UserAkses = () => {
  const searchParams = useSearchParams();

  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 10;
  const query = searchParams.get("q") || "";

  const isUserActive =
    searchParams.get("is_user_active") === "true"
      ? true
      : searchParams.get("is_user_active") === "false"
      ? false
      : null;

  const isUserPPOB =
    searchParams.get("is_user_ppob") === "true"
      ? true
      : searchParams.get("is_user_ppob") === "false"
      ? false
      : null;

  const isUserTimtagih =
    searchParams.get("is_user_timtagih") === "true"
      ? true
      : searchParams.get("is_user_timtagih") === "false"
      ? false
      : null;

  const buildUserAccessUrl = () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (query) {
      params.append("q", query);
    }
    if (isUserActive !== null) {
      params.append("is_user_active", isUserActive ? "1" : "0");
    }
    if (isUserPPOB !== null) {
      params.append("is_user_ppob", isUserPPOB ? "1" : "0");
    }
    if (isUserTimtagih !== null) {
      params.append("is_user_timtagih", isUserTimtagih ? "1" : "0");
    }

    return `${BASEURL}/api/administrator/user-akses?${params.toString()}`;
  };

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(buildUserAccessUrl(), fetcher);

  const {
    data: rolesData,
    error: rolesError,
    isLoading: rolesLoading,
  } = useSWR(`/api/administrator/role`, fetcher);

  const {
    data: loketData,
    error: loketError,
    isLoading: loketLoading,
  } = useSWR(`/api/administrator/user-akses/loket`, fetcher);

  const roles = rolesData?.roles || [];
  const loket = loketData?.data || [];

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">User Akses</h3>

      <TableFunction
        loket={loket}
        roles={roles}
        filter={{
          is_user_active: isUserActive,
          is_user_ppob: isUserPPOB,
          is_user_timtagih: isUserTimtagih,
        }}
        limit={String(limit)}
      />
      {userLoading || rolesLoading || loketLoading ? (
        <div className="p-5 border rounded-lg">
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      ) : userError || rolesError || loketError ? (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          Error loading data
        </div>
      ) : (
        <DataTableClient
          columns={columns}
          data={userData}
          params={Object.fromEntries(searchParams.entries())}
        />
      )}
    </div>
  );
};

export default UserAkses;
