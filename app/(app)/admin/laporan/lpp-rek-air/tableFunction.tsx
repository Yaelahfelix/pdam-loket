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
  user,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useUpdateQuery from "@/components/hooks/useUpdateQuery";
import { format, parseISO } from "date-fns";
import { BlobProvider } from "@react-pdf/renderer";
import { useLPPRekAirStore } from "@/store/lppRekAir";
import Link from "next/link";
import PDF from "./pdfPage";
import { useReactToPrint } from "react-to-print";
import { FilterData } from "./page";
import { RotateCw, X } from "lucide-react";
import { useFilterStore } from "./useFilterStore";
import fetcher from "@/lib/swr/fetcher";
import { TTD } from "@/types/ttd";
import { DekstopSettings } from "@/types/settings";
import { id } from "date-fns/locale";

function TableFunction({ filter }: { filter: FilterData }) {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const updateQuery = useUpdateQuery();
  const { drd } = useLPPRekAirStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dekstop, setDekstop] = useState<DekstopSettings>();

  const [signatureData, setSignatureData] = useState<TTD>();
  const tgl1 = searchParams.get("tgl1");
  const tgl2 = searchParams.get("tgl2");

  const [isLoading, setIsLoading] = useState(true);
  const {
    kasir,
    loket,
    golongan,
    kecamatan,
    setKasir,
    setKasirName,
    setLoket,
    setLoketName,
    setGolongan,
    setGolonganName,
    setKecamatan,
    setKecamatanName,
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
    fetcher("/api/settings/dekstop").then((res) => {
      setDekstop(res.data);
      fetcher("/api/ttd/lppa")
        .then((res) => {
          setSignatureData(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

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
                <div className="flex gap-2">
                  <Select
                    className="w-[200px]"
                    label="Berdasarkan kasir"
                    selectedKeys={new Set([kasir])}
                    onChange={(e) => {
                      const selectedValue = filter.user.find(
                        (item) => item.id === Number(e.target.value)
                      );
                      setKasir(e.target.value);
                      setKasirName(selectedValue?.nama || "");
                    }}
                  >
                    {filter.user.map((user) => (
                      <SelectItem key={user.id.toString()}>
                        {user.nama}
                      </SelectItem>
                    ))}
                  </Select>
                  <div>
                    <Button
                      className="h-full p-1  rounded-lg "
                      isIconOnly
                      color="danger"
                      isDisabled={!kasir}
                      onPress={() => setKasir("")}
                      variant={kasir ? "bordered" : "faded"}
                      size="sm"
                    >
                      <X className="text-red-500"></X>
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    className="w-[200px]"
                    label="Berdasarkan loket"
                    selectedKeys={new Set([loket])}
                    onChange={(e) => {
                      const selectedValue = filter.loket.find(
                        (item) => item.id === Number(e.target.value)
                      );
                      setLoket(e.target.value);
                      setLoketName(selectedValue?.loket || "");
                    }}
                  >
                    {filter.loket.map((loket) => (
                      <SelectItem key={loket.id}>{loket.loket}</SelectItem>
                    ))}
                  </Select>
                  <div>
                    <Button
                      className="h-full p-1  rounded-lg "
                      isIconOnly
                      color="danger"
                      isDisabled={!loket}
                      onPress={() => setLoket("")}
                      variant={loket ? "bordered" : "faded"}
                      size="sm"
                    >
                      <X className="text-red-500"></X>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select
                    className="w-[200px]"
                    label="Berdasarkan golongan"
                    selectedKeys={new Set([golongan])}
                    onChange={(e) => {
                      setGolongan(e.target.value);
                      const selectedValue = filter.golongan.find(
                        (item) => item.id === Number(e.target.value)
                      );
                      setGolonganName(selectedValue?.nama || "");
                    }}
                  >
                    {filter.golongan.map((gol) => (
                      <SelectItem key={gol.id}>{gol.kode_golongan}</SelectItem>
                    ))}
                  </Select>
                  <div>
                    <Button
                      className="h-full p-1  rounded-lg "
                      isIconOnly
                      color="danger"
                      isDisabled={!golongan}
                      onPress={() => setGolongan("")}
                      variant={golongan ? "bordered" : "faded"}
                      size="sm"
                    >
                      <X className="text-red-500"></X>
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    className="w-[200px]"
                    label="Berdasarkan kecamatan"
                    selectedKeys={new Set([kecamatan])}
                    onChange={(e) => {
                      setKecamatan(e.target.value);
                      const selectedValue = filter.kecamatan.find(
                        (item) => item.id === Number(e.target.value)
                      );
                      setKecamatanName(selectedValue?.nama || "");
                    }}
                  >
                    {filter.kecamatan.map((kec) => (
                      <SelectItem key={kec.id}>{kec.nama}</SelectItem>
                    ))}
                  </Select>
                  <div>
                    <Button
                      className="h-full p-1  rounded-lg "
                      isIconOnly
                      color="danger"
                      isDisabled={!kecamatan}
                      onPress={() => setKecamatan("")}
                      variant={kecamatan ? "bordered" : "faded"}
                      size="sm"
                    >
                      <X className="text-red-500"></X>
                    </Button>
                  </div>
                </div>
                <Button
                  variant="solid"
                  color="primary"
                  className="w-full"
                  startContent={<RotateCw className="w-5 h-5" />}
                  onPress={() => {
                    setKecamatan("");
                    setGolongan("");
                    setLoket("");
                    setKasir("");
                    setIsFilterOpen(false);
                  }}
                >
                  Hapus semua filter
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {tgl1 && tgl2 && (
          <PDF
            data={drd?.data}
            total={drd?.total}
            // @ts-ignore
            filter={drd?.filter}
            headerlap1={dekstop?.headerlap1}
            headerlap2={dekstop?.headerlap2}
            alamat1={dekstop?.alamat1}
            footer={dekstop?.footerkota}
            alamat2={dekstop?.alamat2}
            signatureData={signatureData}
            isLoading={isLoading}
            tanggal={`${
              tgl1 &&
              format(parseISO(tgl1), "d MMMM yyyy", {
                locale: id,
              })
            } s/d ${
              tgl2 && format(parseISO(tgl2), "d MMMM yyyy", { locale: id })
            }
            `}
          />
        )}
      </div>
    </div>
  );
}

export default TableFunction;
