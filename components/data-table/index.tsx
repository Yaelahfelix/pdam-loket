"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowData,
  ExpandedState,
  getExpandedRowModel,
  Row,
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
import { useEffect, useState } from "react";
import { PaginationResultType } from "@/types/pagination";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import useUpdateQuery from "@/components/hooks/useUpdateQuery";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    getRowCanExpand: (row: Row<TData>) => boolean;
    renderRowAccordionContent: (row: Row<TData>) => React.ReactNode;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationResultType;
  limitPage: string;
  renderRowAccordionContent?: (row: TData) => React.ReactNode;
  canExpand?: (row: TData) => boolean;
  disabledPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  limitPage,
  renderRowAccordionContent,
  canExpand = () => false,
  disabledPagination = false,
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState<number>(
    pagination?.currentPage || 0
  );
  const [limit, setLimit] = useState(limitPage);
  const [hasMounted, sethasMounted] = useState(false);
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  useEffect(() => {
    setExpanded({});
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    state: {
      sorting,
      expanded,
    },
    meta: {
      getRowCanExpand: (row) => canExpand(row.original),
      renderRowAccordionContent: (row) =>
        renderRowAccordionContent!(row.original),
    },
  });

  const updateQuery = useUpdateQuery();
  useEffect(() => {
    if (!hasMounted) {
      sethasMounted(true);
      return;
    }

    updateQuery({ page: currentPage, limit });
  }, [currentPage, limit, router]);

  useEffect(() => {
    setCurrentPage(pagination?.currentPage || 0);
  }, [pagination?.currentPage]);

  const handleRowClick = (row: Row<TData>) => {
    if (canExpand(row.original)) {
      setExpanded((prev: any) => ({
        ...prev,
        [row.id]: !prev[row.id],
      }));
    }
  };

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
              <>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    canExpand(row.original)
                      ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      : ""
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id}>
                      {index === 0 && canExpand(row.original) && (
                        <span className="inline-block mr-2">
                          {row.getIsExpanded() ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                      )}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="p-0">
                      <div className="px-4 py-2 bg-gray-50 dark:bg-stone-900">
                        {table.options.meta?.renderRowAccordionContent(row)}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
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
      {!disabledPagination && (
        <div className="flex gap-5 justify-end items-center dark:bg-stone-900 bg-slate-100 rounded-b-lg py-3 px-5">
          <Select
            className="max-w-36"
            label="Limit per page"
            required
            value={limit}
            onChange={(val) => {
              setLimit(val.target.value);
              setCurrentPage(1);
            }}
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
            total={pagination?.totalPages || 0}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
