"use client";

import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import { Chip } from "@heroui/react";
import { Loket } from "@/types/loket";
import { Kolektif } from "@/types/kolektif";

export const columns: ColumnDef<Kolektif>[] = [
  {
    accessorKey: "no_kolektif",
    header: "Nomor Kolektif",
  },
  {
    accessorKey: "nama",
    header: "Nama Kolektif",
  },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions kolektif={row.original} />,
  },
];
