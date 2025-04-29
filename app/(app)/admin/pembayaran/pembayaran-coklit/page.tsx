"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import BreadcrumbsComponent from "./breadcrumbs";
import DataTable from "./data-table";
import {
  ComboboxPembayaranNonAir,
  DataNonair,
} from "@/types/pembayaran-nonair";
import BayarHandler from "./strukPdf";
import {
  Button,
  CalendarDate,
  DatePicker,
  Input,
  NumberInput,
  useDisclosure,
} from "@heroui/react";
import { formatRupiah } from "@/lib/utils";
import { ComboboxNonAir } from "@/components/combobox/pembayaran-nonair";
import { TagihanPelcoklit } from "@/types/pelCoklit";
import fetcher from "@/lib/swr/fetcher";
import TglModal from "./tglModal";
import { getLocalTimeZone, today } from "@internationalized/date";
import { format } from "date-fns";
import { DekstopSettings } from "@/types/settings";
import { TTD } from "@/types/ttd";
import CetakPDF from "./pdfPage";
import { formatPeriode } from "@/lib/formatPeriode";
import { id } from "date-fns/locale";

const CUPembayaranRekNonAir = () => {
  const [allData, setAllData] = useState<TagihanPelcoklit[]>([]);
  const [periode, setPeriode] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isOpenTglKolektif,
    onOpen: onOpenTglKolektif,
    onOpenChange: onOpenChangeTglKolektif,
  } = useDisclosure();
  const [isAdmin, setIsAdmin] = useState(false);
  const [total, setTotal] = useState(0);
  const [tglAdmin, setTglAdmin] = useState<CalendarDate>(
    today(getLocalTimeZone())
  );
  const [dekstop, setDekstop] = useState<DekstopSettings>();

  const [signatureData, setSignatureData] = useState<TTD>();

  useEffect(() => {
    fetcher("/api/settings/dekstop").then((res) => {
      setDekstop(res.data);
      fetcher("/api/ttd/info")
        .then((res) => {
          setSignatureData(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  }, []);

  const submitHander = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedDate = format(
      tglAdmin?.toDate("Asia/Jakarta"),
      "yyyy-MM-dd"
    );

    setTotal(0);
    setAllData([]);
    setIsLoading(true);
    fetcher(
      `/api/pembayaran/pembayaran-coklit?periode=${periode}&isAdmin=${isAdmin}&tglAdmin=${formattedDate}`
    )
      .then((res) =>
        setAllData(res.data.filter((item: any) => item.tagihan.length > 0))
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let total = 0;
    allData.forEach((data) =>
      data.tagihan.forEach((data) => (total += Number(data.totalrek)))
    );
    setTotal(total);
  }, [allData]);
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <h3 className="text-xl font-semibold">
        Pembayaran Rekening Air Khusus Coklit
      </h3>
      <div className="flex justify-between">
        <form className="flex gap-5 w-[400px] " onSubmit={submitHander}>
          <Input
            type="number"
            variant="bordered"
            label="Periode"
            placeholder="202503"
            value={periode}
            onValueChange={setPeriode}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <div className=" flex items-center">
            <Button type="submit" color="primary" isLoading={isLoading}>
              Cek Tagihan
            </Button>
          </div>
        </form>
        <div className="flex gap-5 items-center">
          <div>
            <DatePicker
              className="w-full max-w-xs"
              label="Tgl Bayar"
              value={tglAdmin}
              isDisabled={!isAdmin}
              onChange={(tglAdmin) => {
                if (!tglAdmin) return;
                setTglAdmin(tglAdmin);
              }}
            />
          </div>
          {!isAdmin && (
            <Button color="danger" onPress={() => onOpenTglKolektif()}>
              Ubah Tanggal
            </Button>
          )}
          <TglModal
            handler={() => {
              setIsAdmin(true);
            }}
            isOpen={isOpenTglKolektif}
            onOpenChange={onOpenChangeTglKolektif}
          />
        </div>
      </div>
      <DataTable data={allData} />
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
          <CetakPDF
            isLoading={isLoading || allData.length === 0}
            data={allData.filter((item) => item.tagihan.length > 0)}
            periode={periode ? formatPeriode(periode) : ""}
            headerlap1={dekstop?.headerlap1}
            headerlap2={dekstop?.headerlap2}
            footer={dekstop?.footerkota}
            signatureData={signatureData}
            alamat1={dekstop?.alamat1}
            alamat2={dekstop?.alamat2}
          />
          <BayarHandler
            isLoading={isLoading || allData.length === 0}
            headerlap1={dekstop?.headerlap1}
            headerlap2={dekstop?.headerlap2}
            isAdmin={isAdmin}
            tgl={format(
              new Date(tglAdmin.year, tglAdmin.month - 1, tglAdmin.day),
              "yyyy-MM-dd",
              { locale: id }
            )}
            data={allData}
            handler={() => {
              setAllData([]);
            }}
          />
          {/* <BayarHandler data={selectedData} handler={() => {}} /> */}
        </div>
      </div>
    </div>
  );
};

export default CUPembayaranRekNonAir;
