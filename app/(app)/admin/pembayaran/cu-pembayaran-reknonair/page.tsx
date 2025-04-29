"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import BreadcrumbsComponent from "./breadcrumbs";
import DataTable from "./data-table";
import {
  ComboboxPembayaranNonAir,
  DataNonair,
} from "@/types/pembayaran-nonair";
import BayarHandler from "./pdfPage";
import { Button, Input } from "@heroui/react";
import { formatRupiah } from "@/lib/utils";
import { ComboboxNonAir } from "@/components/combobox/pembayaran-nonair";

const CUPembayaranRekNonAir = () => {
  const [allData, setAllData] = useState<ComboboxPembayaranNonAir[]>([]);
  const [selectedData, setSelectedData] = useState<ComboboxPembayaranNonAir[]>(
    []
  );
  const [total, setTotal] = useState(0);

  const handleComboboxSelection = (
    val: ComboboxPembayaranNonAir | undefined
  ) => {
    if (!val) return;

    setAllData((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.id === val.id);

      if (existingItemIndex !== -1) {
        return prev.map((item, index) =>
          index === existingItemIndex ? val : item
        );
      } else {
        return [...prev, val];
      }
    });
  };

  useEffect(() => {
    let total = 0;
    allData.forEach((data) => (total += data.total));
    setTotal(total);
  }, [allData]);
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">Cek Pembayaran</h3>
      <div className="flex w-[400px]">
        <ComboboxNonAir
          handler={(val) => {
            handleComboboxSelection(val);
          }}
        />
      </div>
      <DataTable
        data={allData}
        handler={(ids) => {
          const filteredData = allData.filter((item) =>
            ids.includes(String(item.id))
          );
          setSelectedData(filteredData);
        }}
      />
      <div className="h-full flex justify-between">
        <div>
          <Button
            color="warning"
            className="h-full"
            onPress={() => {
              setAllData([]);
              setTotal(0);
            }}
          >
            Reset Tagihan
          </Button>
        </div>
        <div className="flex gap-5">
          <Input
            disabled
            value={formatRupiah(total)}
            variant="bordered"
            label="Total Tagihan"
          />
          <BayarHandler data={selectedData} handler={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default CUPembayaranRekNonAir;
