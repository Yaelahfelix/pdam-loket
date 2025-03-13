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
import { getAllRole } from "@/lib/dbQuery/role";
import { canTableDetail, tableDetail } from "./detailTableRow";
import { SegmentPrefixRSCPathnameNormalizer } from "next/dist/server/normalizers/request/segment-prefix-rsc";

const getData = async (
  page: number,
  limit: number,
  filter: {
    is_user_active: boolean | null;
    is_user_ppob: boolean | null;
    is_user_timtagih: boolean | null;
  },

  query?: string
) => {
  let redirectPath;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query) {
    params.append("q", query);
  }
  if (filter.is_user_active !== null) {
    params.append("is_user_active", filter.is_user_active ? "1" : "0");
  }
  if (filter.is_user_ppob !== null) {
    params.append("is_user_ppob", filter.is_user_ppob ? "1" : "0");
  }
  if (filter.is_user_timtagih !== null) {
    params.append("is_user_timtagih", filter.is_user_timtagih ? "1" : "0");
  }
  try {
    const session = await getSession();
    const res = await axios.get(
      BASEURL + `/api/administrator/user-akses?${params.toString()}`,
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

  const isUserActive =
    params.is_user_active === "true"
      ? true
      : params.is_user_active === "false"
      ? false
      : null;

  const isUserPPOB =
    params.is_user_ppob === "true"
      ? true
      : params.is_user_ppob === "false"
      ? false
      : null;

  const isUserTimtagih =
    params.is_user_timtagih === "true"
      ? true
      : params.is_user_timtagih === "false"
      ? false
      : null;

  const data = await getData(
    parseInt(params.page as string) || 1,
    parseInt(params.limit as string) || 10,
    {
      is_user_active: isUserActive,
      is_user_ppob: isUserPPOB,
      is_user_timtagih: isUserTimtagih,
    },
    params.q as string
  );
  const roles = await getAllRole();
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

      <TableFunction
        roles={roles}
        filter={{
          is_user_active: isUserActive,
          is_user_ppob: isUserPPOB,
          is_user_timtagih: isUserTimtagih,
        }}
        limit={(params.limit as string) || "10"}
      />
      <DataTable
        columns={columns}
        data={data.data}
        pagination={data.pagination}
        limitPage={(params.limit as string) || "10"}
        renderRowAccordionContent={tableDetail}
        canExpand={canTableDetail}
      />
      {/* <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper />
      </div> */}
    </div>
  );
};

export default UserAkses;
