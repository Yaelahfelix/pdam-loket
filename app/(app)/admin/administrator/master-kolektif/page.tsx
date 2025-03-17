import Link from "next/link";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import axios, { AxiosError } from "axios";
import { BASEURL } from "@/constant";
import { getSession } from "@/lib/session";
import { deleteAuthCookie } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import TableFunction from "./tableFunction";
import BreadcrumbsComponent from "./breadcrumbs";
import { canTableDetail } from "./detailTableRow";
import { deleteSidebar } from "@/lib/sidebar";
import DataTableClient from "./data-table";

const getData = async (page: number, limit: number, query?: string) => {
  let redirectPath;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query) {
    params.append("q", query);
  }

  try {
    const session = await getSession();
    const res = await axios.get(
      BASEURL + `/api/administrator/master-kolektif?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.status === 401) {
        await deleteSidebar();
        await deleteAuthCookie();
        redirectPath = "/login";
      }
    }
    redirectPath = "/error";
  } finally {
    if (redirectPath) {
      return redirect(redirectPath);
    }
  }
};

const UserAkses = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  const data = await getData(
    parseInt(params.page as string) || 1,
    parseInt(params.limit as string) || 10,
    params.q as string
  );
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />

      <h3 className="text-xl font-semibold">Master Kolektif</h3>

      <TableFunction limit={(params.limit as string) || "10"} />
      <DataTableClient columns={columns} data={data} params={params} />
    </div>
  );
};

export default UserAkses;
