"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import BreadcrumbsComponent from "./breadcrumbs";
import { ComboboxByPendaftaran } from "./combobox/pendaftaran";
import { ComboboxByPsb } from "./combobox/psb";
import { ComboboxByPellain } from "./combobox/pelLain";
import DataTable from "./data-table";
import { DataNonair } from "@/types/pembayaran-nonair";
import BayarHandler from "./pdfPage";
import { Button, Input } from "@heroui/react";
import { formatRupiah } from "@/lib/utils";

const PembayaranRekAir = () => {
  const [allData, setAllData] = useState<DataNonair[]>([]);
  const [total, setTotal] = useState(0);

  const handleComboboxSelection = (val: DataNonair | undefined) => {
    if (!val) return;

    setAllData((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.kode === val.kode
      );

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
      <h3 className="text-xl font-semibold">Pembayaran Non Air</h3>
      <div className="flex gap-5">
        <ComboboxByPendaftaran
          handler={handleComboboxSelection}
          allData={allData}
        />
        <ComboboxByPsb handler={handleComboboxSelection} allData={allData} />
        <ComboboxByPellain
          handler={handleComboboxSelection}
          allData={allData}
        />
      </div>
      <DataTable data={allData} setData={setAllData} />
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
          <BayarHandler
            data={allData}
            handler={() => {
              setAllData([]);
              setTotal(0);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PembayaranRekAir;
