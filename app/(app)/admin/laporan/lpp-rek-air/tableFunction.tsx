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
import React, { useEffect, useState } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { Role } from "@/types/role";
import { RotateCw } from "lucide-react";
import { useRoleStore } from "@/store/role";
import { Loket } from "@/types/loket";
import { useLoketStore } from "@/store/userloket";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useUpdateQuery from "@/components/hooks/useUpdateQuery";
import { format } from "date-fns";
import { BlobProvider } from "@react-pdf/renderer";
import { useLPPRekAirStore } from "@/store/lppRekAir";
import PDFPage from "./pdfPage";
import Link from "next/link";

function TableFunction({}: {}) {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const updateQuery = useUpdateQuery();
  const { drd } = useLPPRekAirStore();

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

        <BlobProvider document={<PDFPage data={drd?.data} />}>
          {({ url, loading, error }) => {
            console.log(error);
            return (
              <Link href={url || ""} target="_blank">
                <Button
                  color="primary"
                  startContent={<ExportIcon />}
                  isLoading={loading}
                  isDisabled={!drd}
                >
                  Export to PDF
                </Button>
              </Link>
            );
          }}
        </BlobProvider>
      </div>
    </div>
  );
}

export default TableFunction;
