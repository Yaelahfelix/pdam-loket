"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LPPRekAirType } from "./type";
import { User } from "@/types/user";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
  },
  {
    accessorKey: "is_user_ppob",
    header: "User PPOB",
  },
  {
    accessorKey: "is_user_timtagih",
    header: "User Tim Tagih",
  },
  {
    accessorKey: "is_active",
    header: "User Aktif",
  },
];
