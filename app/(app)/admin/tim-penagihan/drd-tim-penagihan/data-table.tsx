"use client";

import { Rayon } from "@/types/plot-tim-tagih";
import { DRDTimPenagihan } from "@/types/drd-tim-penagihan"; // Make sure you import your type
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { formatRupiah } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type ColumnVisibility = {
  key: keyof DRDTimPenagihan;
  label: string;
  visible: boolean;
};

type Props = {
  data?: DRDTimPenagihan[];
  handler: (ids: string[] | "all") => void;
};

const DataTable = ({ data, handler }: Props) => {
  // Define all possible columns with their initial visibility
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility[]>([
    { key: "nama", label: "Nama", visible: true },
    { key: "alamat", label: "alamat", visible: true },
    { key: "kode_golongan", label: "kode Gol", visible: true },
    { key: "rayon", label: "Rayon", visible: true },
    { key: "no_pelanggan", label: "No Samb", visible: true },
    { key: "periodetag", label: "Periode Tag", visible: false },
    { key: "no_hp", label: "no_hp", visible: false },
    { key: "timtagih", label: "Tim Tagih", visible: false },
    { key: "latitude", label: "latitude", visible: false },
    { key: "longitude", label: "longitude", visible: false },
    { key: "lbrlunas", label: "Lbr Lunas", visible: true },
    { key: "ttltagihanlunas", label: "Tagihan Lunas", visible: true },
    { key: "userlunas", label: "userlunas", visible: false },
    { key: "denda", label: "denda", visible: false },
    { key: "rekair", label: "rekair", visible: false },
    { key: "angsuran", label: "angsuran", visible: false },
    { key: "minper", label: "minper", visible: false },
    { key: "maxper", label: "maxper", visible: false },
    { key: "dendalunas", label: "dendalunas", visible: false },
    { key: "rekairlunas", label: "rekairlunas", visible: false },
    { key: "angsuranlunas", label: "angsuranlunas", visible: false },
    { key: "sisatagihan", label: "Sisa Tagihan", visible: true },
    { key: "tglbayar", label: "Tgl Bayar", visible: true },
  ]);

  // Handle column visibility toggle
  const toggleColumnVisibility = (index: number) => {
    const newColumnVisibility = [...columnVisibility];
    newColumnVisibility[index].visible = !newColumnVisibility[index].visible;
    setColumnVisibility(newColumnVisibility);
  };

  // Check/uncheck all columns
  const toggleAllColumns = (checked: boolean) => {
    setColumnVisibility(
      columnVisibility.map((col) => ({ ...col, visible: checked }))
    );
  };

  // Calculate totals for numeric columns
  const calculateTotals = () => {
    const totals: Record<string, number> = {};

    // Define which columns should be summed
    const summableColumns = [
      "lbrlunas",
      "ttltagihanlunas",
      "sisatagihan",
      "denda",
      "dendalunas",
      "rekairlunas",
      "rekair",
      "angsuran",
      "dendalunas",
      "rekairlunas",
      "angsuranlunas",
    ];

    // Initialize totals object
    summableColumns.forEach((col) => {
      totals[col] = 0;
    });

    // Sum values from each row
    data?.forEach((item) => {
      summableColumns.forEach((col) => {
        // Check if the item has a value for this column
        //@ts-ignore
        if (item[col] !== undefined && item[col] !== null) {
          // Convert to number if needed (assuming values could be strings)
          const numValue =
            //@ts-ignore
            typeof item[col] === "string"
              ? //@ts-ignore
                parseFloat(item[col].replace(/[^\d.-]/g, ""))
              : //@ts-ignore
                Number(item[col]);

          // Add to total if it's a valid number
          if (!isNaN(numValue)) {
            totals[col] += numValue;
          }
        }
      });
    });

    return totals;
  };

  const totals = calculateTotals();

  // Get visible columns
  const visibleColumns = columnVisibility.filter((col) => col.visible);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Data Tagihan</h2>

        <Popover>
          <PopoverTrigger>
            <Button variant="flat">Pilih Kolom</Button>
          </PopoverTrigger>
          <PopoverContent aria-label="Column Selection" className="w-64 p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 mb-2 border-b pb-2">
                <Checkbox
                  isSelected={columnVisibility.every((col) => col.visible)}
                  isIndeterminate={
                    columnVisibility.some((col) => col.visible) &&
                    !columnVisibility.every((col) => col.visible)
                  }
                  onChange={(e) => toggleAllColumns(e.target.checked)}
                >
                  (All)
                </Checkbox>
                <Checkbox className="ml-4" isSelected={false}>
                  (Sorted)
                </Checkbox>
              </div>

              {columnVisibility.map((col, index) => (
                <div key={String(col.key)} className="flex items-center">
                  <Checkbox
                    isSelected={col.visible}
                    onChange={() => toggleColumnVisibility(index)}
                  >
                    {col.label}
                  </Checkbox>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Container for table with fixed header and footer */}
      <div className="relative border rounded-lg overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
          <table className="min-w-full table-fixed border-collapse">
            {/* Table Header */}
            <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
              <tr>
                {visibleColumns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="p-3 text-left font-semibold border-b border-gray-200 dark:border-gray-800"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data?.map((item) => (
                <tr
                  key={item.user_id}
                  className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-950"
                >
                  {visibleColumns.map((col) => (
                    <td
                      key={`${item.user_id}-${String(col.key)}`}
                      className="p-3"
                    >
                      {renderCellValue(item, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            {/* Table Footer - using tfoot */}
            <tfoot className="dark:bg-gray-800 bg-gray-200 sticky bottom-0 left-0">
              <tr>
                {visibleColumns.map((col, index) => {
                  // First column shows "Total"
                  if (index === 0) {
                    return (
                      <td
                        key={`total-${String(col.key)}`}
                        className="p-3 font-bold"
                      >
                        Total
                      </td>
                    );
                  }

                  const isSummable = [
                    "lbrlunas",
                    "ttltagihanlunas",
                    "sisatagihan",
                    "denda",
                    "dendalunas",
                    "rekairlunas",
                    "rekair",
                    "angsuran",
                    "dendalunas",
                    "rekairlunas",
                    "angsuranlunas",
                  ].includes(col.key);

                  return (
                    <td
                      key={`total-${String(col.key)}`}
                      className="p-3 font-semibold"
                    >
                      {isSummable && totals[col.key] !== undefined
                        ? totals[col.key].toLocaleString("id-ID")
                        : ""}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

// Helper function to format cell values based on column type
const renderCellValue = (item: DRDTimPenagihan, key: keyof DRDTimPenagihan) => {
  const value = item[key];

  // Handle currency values
  if (
    key === "denda" ||
    key === "dendalunas" ||
    key === "rekairlunas" ||
    key === "rekair" ||
    key === "angsuran" ||
    key === "ttltagihan" ||
    key === "ttltagihanlunas" ||
    key === "sisatagihan"
  ) {
    return formatRupiah(parseInt(value as string));
  }

  if (key === "tglbayar" && value) {
    try {
      if (value !== "0" || 0) {
        return format(value as string, "dd MMM yyyy HH:mm:ss", {
          locale: id,
        });
      } else {
        return "-";
      }
    } catch {
      return "-";
    }
  }

  return value;
};

export default DataTable;
