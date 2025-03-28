"use client";

import {
  Button,
  Checkbox,
  DateRangePicker,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { useReactToPrint } from "react-to-print";
import { ComboboxPelanggan } from "@/components/combobox/pelanggan";
import { ComboboxKolektif } from "@/components/combobox/kolektif";
import PDFPelanggan from "./pdfPage";
import { useInfoPelStore } from "@/store/infopel";

function TableFunction({}: {}) {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const updateQuery = useUpdateQuery();
  const { data } = useInfoPelStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
        <ComboboxPelanggan
          placeHolder="Cari berdasarkan no pelanggan"
          handler={(value) =>
            updateQuery({
              kolektif_id: null,
              "no-pelanggan": value,
            })
          }
        />
        <ComboboxKolektif
          placeHolder="Cari berdasarkan no kolektif"
          handler={(value) =>
            updateQuery({
              kolektif_id: value,
              "no-pelanggan": null,
            })
          }
        />
      </div>
      <div className="flex flex-row gap-3.5 flex-wrap">
        <Popover
          placement="bottom"
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
              <div className="text-small font-bold text-center"></div>
            </div>
          </PopoverContent>
        </Popover>

        <PDFPelanggan data={data?.tagihanBlmLunas} total={data?.total} />
      </div>
    </div>
  );
}

export default TableFunction;
