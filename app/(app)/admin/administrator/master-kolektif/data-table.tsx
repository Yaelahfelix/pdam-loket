"use client";

import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { canTableDetail, TableDetail } from "./detailTableRow";
import { Kolektif } from "@/types/kolektif";

type Props = {
  columns: ColumnDef<Kolektif>[];
  data: any;
  params: any;
};

const DataTableClient = ({ columns, data, params }: Props) => {
  return (
    <DataTable
      columns={columns}
      data={data.data}
      pagination={data.pagination}
      limitPage={(params.limit as string) || "10"}
      renderRowAccordionContent={(kolektif) => (
        <TableDetail kolektif={kolektif} />
      )}
      canExpand={canTableDetail}
    />
  );
};

export default DataTableClient;
