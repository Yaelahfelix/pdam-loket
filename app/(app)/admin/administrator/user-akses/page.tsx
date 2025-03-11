import Link from "next/link";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import axios, { AxiosError } from "axios";
import { BASEURL } from "@/constant";
import { getSession } from "@/lib/session";
import { deleteSidebar } from "@/lib/settings";
import { deleteAuthCookie } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import TableFunction from "./tableFunction";

const getData = async (page: number, limit: number) => {
  try {
    const session = await getSession();
    const res = await axios.get(
      BASEURL + `/api/administrator/user-akses?page=${page}&limit=${limit}`,
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
        deleteSidebar();
        deleteAuthCookie();
        return redirect("/login");
      }
    }
    return redirect("/error");
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
    parseInt(params.limit as string) || 10
  );
  console.log(data.data.pagination);
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex gap-2">
        <li className="flex gap-2">
          <Link href={"/admin"}>
            <span>Dashboard</span>
          </Link>
          <span>/</span>
        </li>

        <li className="flex gap-2">
          <span>Administrator</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>User Akses</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">User Akses</h3>

      <TableFunction />
      <DataTable
        columns={columns}
        data={data.data}
        pagination={data.pagination}
        url="/admin/administrator/user-akses"
        limitPage={(params.limit as string) || "10"}
      />
      {/* <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper />
      </div> */}
    </div>
  );
};

export default UserAkses;
