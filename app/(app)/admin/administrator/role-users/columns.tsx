"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Role } from "@/types/role";
import Actions from "./actions";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "role",
    header: "Nama Role",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions role={row.original} />,
  },
];
