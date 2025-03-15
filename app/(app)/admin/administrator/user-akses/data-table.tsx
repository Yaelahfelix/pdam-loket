"use client";

import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { canTableDetail, TableDetail } from "./detailTableRow";

type Props = {
  columns: ColumnDef<User>[];
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
      renderRowAccordionContent={(user) => <TableDetail user={user} />}
      canExpand={canTableDetail}
    />
  );
};

export default DataTableClient;
