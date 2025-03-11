"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, Select, SelectItem } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { PaginationResultType } from "@/types/pagination";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationResultType;
  url: string;
  limitPage: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  url,
  limitPage,
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState<number>(
    pagination.currentPage
  );
  const [limit, setLimit] = useState(limitPage);
  const [hasMounted, sethasMounted] = useState(false);
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  useEffect(() => {
    if (!hasMounted) {
      sethasMounted(true);
      return;
    }

    router.replace(`${url}?page=${currentPage}&limit=${limit}`);
  }, [currentPage, limit]);

  return (
    <div className="">
      <Table className="rounded-md border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex gap-5 justify-end items-center dark:bg-stone-900 bg-slate-100 rounded-b-lg py-3 px-5">
        <Select
          className="max-w-36"
          label="Limit per page"
          required
          value={limit}
          onChange={(val) => setLimit(val.target.value)}
          defaultSelectedKeys={[limit]}
          disallowEmptySelection
        >
          <SelectItem key={"10"}>10</SelectItem>
          <SelectItem key={"25"}>25</SelectItem>
          <SelectItem key={"50"}>50</SelectItem>
          <SelectItem key={"100"}>100</SelectItem>
        </Select>
        <Pagination
          showControls
          initialPage={1}
          total={pagination.totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
