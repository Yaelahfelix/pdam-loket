"use client";

import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { canTableDetail, TableDetail } from "./detailTableRow";
import { Role } from "@/types/role";

type Props = {
  columns: ColumnDef<Role>[];
  data: any;
  params: any;
};

const DataTableClient = ({ columns, data, params }: Props) => {
  return (
    <DataTable
      columns={columns}
      data={data.data}
      limitPage={(params.limit as string) || "10"}
      renderRowAccordionContent={(role) => <TableDetail role={role} />}
      canExpand={canTableDetail}
      disabledPagination={true}
    />
  );
};

export default DataTableClient;
