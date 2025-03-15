"use client";

import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import { Chip } from "@heroui/react";
import { Loket } from "@/types/loket";

export const columns: ColumnDef<Loket>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "kodeloket",
    header: "Kode Loket",
  },
  {
    accessorKey: "loket",
    header: "Nama Loket",
  },

  {
    accessorKey: "aktif",
    header: "Aktif",
    cell: ({ row }) =>
      !!row.original.aktif ? (
        <Chip color="success">Yes</Chip>
      ) : (
        <Chip color="danger">No</Chip>
      ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions loket={row.original} />,
  },
];
