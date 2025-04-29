"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import Actions from "./actions";
import { Chip } from "@heroui/react";

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
    cell: ({ row }) =>
      !!row.original.is_user_ppob ? (
        <Chip color="success">Yes</Chip>
      ) : (
        <Chip color="danger">No</Chip>
      ),
  },
  {
    accessorKey: "is_user_timtagih",
    header: "User Tim Tagih",
    cell: ({ row }) =>
      !!row.original.is_user_timtagih ? (
        <Chip color="success">Yes</Chip>
      ) : (
        <Chip color="danger">No</Chip>
      ),
  },
  {
    accessorKey: "min_l",
    header: "Min Lembar",
    cell: ({ row }) => (row.original.min_l ? row.original.min_l : 0),
  },
  {
    accessorKey: "max_l",
    header: "Max Lembar",
    cell: ({ row }) => (row.original.max_l ? row.original.max_l : 0),
  },

  {
    accessorKey: "is_active",
    header: "User Aktif",
    cell: ({ row }) =>
      !!row.original.is_active ? (
        <Chip color="success">Yes</Chip>
      ) : (
        <Chip color="danger">No</Chip>
      ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions user={row.original} />,
  },
];
