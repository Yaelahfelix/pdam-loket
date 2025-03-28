"use client";

import {
  Button,
  Checkbox,
  DateRangePicker,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useUpdateQuery from "@/components/hooks/useUpdateQuery";
import { format } from "date-fns";
import { BlobProvider } from "@react-pdf/renderer";
import { useLPPRekAirStore } from "@/store/lppRekAir";
import Link from "next/link";
import DRDTable from "./pdfPage";
import { useReactToPrint } from "react-to-print";
import { FilterData } from "./page";
import { RotateCw } from "lucide-react";
import { useFilterStore } from "./useFilterStore";

function TableFunction({ filter }: { filter: FilterData }) {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const updateQuery = useUpdateQuery();
  const { drd } = useLPPRekAirStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    kasir,
    loket,
    golongan,
    kecamatan,
    setKasir,
    setLoket,
    setGolongan,
    setKecamatan,
  } = useFilterStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        updateQuery({ q: query });
      } else {
        updateQuery({ q: null });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, []);

  return (
    <div className="flex justify-between flex-wrap gap-4 items-center">
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        <DateRangePicker
          className="max-w-xs"
          label="Rentan Waktu"
          onChange={(tgl) => {
            if (!tgl?.start) return;
            const tgl1 = format(
              tgl?.start.toDate("Asia/Jakarta"),
              "yyyy-MM-dd"
            );
            const tgl2 = format(tgl?.end.toDate("Asia/Jakarta"), "yyyy-MM-dd");
            updateQuery({
              tgl1,
              tgl2,
            });
          }}
        />
      </div>
      <div className="flex flex-row gap-3.5 flex-wrap">
        <Popover
          placement="left-start"
          showArrow={true}
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        >
          <PopoverTrigger>
            <Button
              color="primary"
              startContent={<AdjustmentsVerticalIcon className="w-5" />}
            >
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold text-center">Filter</div>
              <div className="flex flex-col gap-3 my-3 flex-shrink-0">
                <Select
                  className="w-[200px]"
                  label="Berdasarkan kasir"
                  selectedKeys={new Set([kasir])}
                  onChange={(e) => setKasir(e.target.value)}
                >
                  {filter.user.map((user) => (
                    <SelectItem key={user.id.toString()}>
                      {user.nama}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  className="w-[200px]"
                  label="Berdasarkan loket"
                  selectedKeys={new Set([loket])}
                  onChange={(e) => setLoket(e.target.value)}
                >
                  {filter.loket.map((loket) => (
                    <SelectItem key={loket.id}>{loket.loket}</SelectItem>
                  ))}
                </Select>

                <Select
                  className="w-[200px]"
                  label="Berdasarkan golongan"
                  selectedKeys={new Set([golongan])}
                  onChange={(e) => setGolongan(e.target.value)}
                >
                  {filter.golongan.map((gol) => (
                    <SelectItem key={gol.id}>{gol.kode_golongan}</SelectItem>
                  ))}
                </Select>

                <Select
                  className="w-[200px]"
                  label="Berdasarkan kecamatan"
                  selectedKeys={new Set([kecamatan])}
                  onChange={(e) => setKecamatan(e.target.value)}
                >
                  {filter.kecamatan.map((kec) => (
                    <SelectItem key={kec.id}>{kec.nama}</SelectItem>
                  ))}
                </Select>
                <Button
                  variant="solid"
                  color="primary"
                  className="w-full"
                  startContent={<RotateCw className="w-5 h-5" />}
                  onPress={() => {
                    updateQuery({
                      kec: null,
                      kasir: null,
                      lok: null,
                      gol: null,
                    });
                    setIsFilterOpen(false);
                  }}
                >
                  Hapus semua filter
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <DRDTable data={drd?.data} total={drd?.total} />
      </div>
    </div>
  );
}

export default TableFunction;
