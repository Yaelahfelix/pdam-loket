import { DRD, DRDResponPembayaranAir, TotalDRD } from "@/types/drd";
import { addToast, Button } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Signature from "./signature";
import { Printer, PrinterIcon } from "lucide-react";
import { TTD } from "@/types/ttd";
import { formatRupiah } from "@/lib/utils";
import clsx from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DRDNonAir, TotalDRNonAir } from "@/types/lpp-nonair";
import {
  CUDataPembayaranRekAir,
  DataPembayaranRekAir,
} from "@/types/pembayran-rekair";
import { getSession } from "@/lib/session";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/types/axios";
import { deleteAuthCookie } from "@/actions/auth.action";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { useRouter } from "next/navigation";
import { formatPeriode } from "@/lib/formatPeriode";
import { DekstopSettings } from "@/types/settings";
import fetcher from "@/lib/swr/fetcher";

// Props type definition
type DRDTableProps = {
  data?: CUDataPembayaranRekAir[];
  handler: () => void;
  subtitle?: string;
  headerlap1?: string;
  headerlap2?: string;
  alamat1?: string;
  alamat2?: string;
};

// Component to be printed
const ReportPrintComponent = React.forwardRef<HTMLDivElement, DRDTableProps>(
  ({ data = [], headerlap1, headerlap2, alamat1, alamat2 }, ref) => {
    return (
      <div>
        {data.map((data) => (
          <div
            ref={ref}
            className="page"
            style={{
              backgroundColor: "#ffffff",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "11px",
              lineHeight: "1rem",
            }}
          >
            <div className="header w-full">
              <div className="w-full ">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <img
                      src="/logo/pudam-bayuangga.png"
                      alt="Perumda Air Minum Bayuangga Logo"
                      height={30}
                      width={30}
                    />
                  </div>
                  <div>
                    <div>
                      <p>{headerlap1}</p>
                      <p>{headerlap2}</p>
                    </div>
                  </div>
                </div>

                <div className="my-1">
                  <h1 className=" text-center uppercase">
                    Bukti pembayaran rekening air minum
                  </h1>
                </div>
              </div>
            </div>
            <div>
              <div className="px-5">
                <div className="flex">
                  <div className="w-4/12 font-semibold">No. Sambungan</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">{data.no_pelanggan}</div>
                </div>

                <div className="flex">
                  <div className="w-4/12 font-semibold">Nama</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">{data.nama}</div>
                </div>

                <div className="flex">
                  <div className="w-4/12 font-semibold">Alamat</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">{data.alamat}</div>
                </div>

                <div className="flex">
                  <div className="w-4/12 font-semibold">Rayon / Gol</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">
                    {data.rayon} / {data.kodegol}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-4/12 font-semibold">Bln. Tagihan</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">
                    {formatPeriode(data.periode_rek)}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-4/12 font-semibold">Stand Meter</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">
                    {data.stanlalu.toLocaleString("id-ID")} S/D{" "}
                    {data.stanskrg.toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="flex">
                  <div className="w-4/12 font-semibold">Pemakaian</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">
                    {data.pakaiskrg.toLocaleString("id-ID")} M3
                  </div>
                </div>

                <div className="ml-6">
                  <div className="flex justify-between">
                    <div className="w-4/12">Harga Air</div>
                    <div className="w-1/12 text-center">=</div>
                    <div className="w-1/6 text-right">Rp.</div>
                    <div className="w-1/4 text-right font-medium">
                      {data.harga_air.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-4/12">Pemeliharaan</div>
                    <div className="w-1/12 text-center">=</div>
                    <div className="w-1/6 text-right">Rp.</div>
                    <div className="w-1/4 text-right font-medium">
                      {data.pemeliharaan.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-4/12">Administrasi</div>
                    <div className="w-1/12 text-center">=</div>

                    <div className="w-1/6 text-right">Rp.</div>
                    <div className="w-1/4 text-right font-medium">
                      {data.administrasi.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-4/12">Materai</div>
                    <div className="w-1/12 text-center">=</div>

                    <div className="w-1/6 text-right">Rp.</div>
                    <div className="w-1/4 text-right font-medium">
                      {data.meterai.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-4/12">Angsuran Nonair ke</div>
                    <div className="w-1/12 text-center">=</div>

                    <div className="w-1/6 text-right">Rp.</div>
                    <div className="w-1/4 text-right font-medium">
                      {data.angsuran.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-4/12">Denda Tunggakan</div>
                    <div className="w-1/12 text-center">=</div>

                    <div className="w-1/6 text-right">Rp.</div>
                    <div className="w-1/4 text-right font-medium">
                      {data.denda.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="border-t ">
                    <div className="flex justify-between font-bold">
                      <div className="w-4/12 text-gray-800">Total Tagihan</div>
                      <div className="w-1/12 text-center">=</div>

                      <div className="w-1/6 text-right">Rp.</div>
                      <div className="w-1/4 text-right">
                        {data.total.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer px-5 pt-2 ">
              <div className="flex">
                <div className="w-4/12 font-semibold">Tgl Bayar</div>
                <div className="w-1/12 text-center">:</div>
                <div className="flex-1 font-medium">
                  {" "}
                  {data.tglbayar &&
                    format(data.tglbayar, "d MMMM yyyy HH:mm:ss", {
                      locale: id,
                    })}
                </div>
              </div>
              <div className="flex">
                <div className="w-4/12 font-semibold">Kasir/Loket</div>
                <div className="w-1/12 text-center">:</div>
                <div className="flex-1 font-medium flex justify-between">
                  <p>{data.kasir + "/" + data.loket}</p>
                  <p>CU</p>
                </div>
              </div>
              <div className="pt-2 text-center">
                <p>PDAM menyatakan resi ini sebagai bukti yang sah.</p>
                <p>Info Tagihan kini bisa di lihat dari HP Android.</p>
                <p>Download BSINFO PDAM KOTA Probolinggo di Playstore.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

ReportPrintComponent.displayName = "ReportPrintComponent";

const BayarHandler: React.FC<DRDTableProps> = (props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const Router = useRouter();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,

    pageStyle: `
    @media print {
      @page { 
        size: 5.5in 4.25in; 
        margin: 5px;
      }
   
        .page {
    page-break-after: always;
    page-break-inside: avoid;
  }
  
  .page:last-child {
    page-break-after: auto;
  }

      body { 
        -webkit-print-color-adjust: exact; 
        counter-reset: page;
      }

      thead {
        display: table-header-group !important;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      thead tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }
            
    
      
      table {
        page-break-inside: avoid;
      }
                    
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      .signature {
        page-break-before: auto;
        position: relative;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      .page-number::after {
        counter-increment: page;
        content: "Halaman " counter(page);
        position: fixed;
        bottom: 10px;
        right: 20px;
        font-size: 12px;
      }
    }
    `,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dekstop, setDekstop] = useState<DekstopSettings>();
  useEffect(() => {
    setIsLoading(true);
    fetcher("/api/settings/dekstop")
      .then((res) => {
        setDekstop(res.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="h-full">
      <div ref={componentRef} className="hidden-print">
        <ReportPrintComponent
          {...props}
          headerlap1={dekstop?.headerlap1}
          headerlap2={dekstop?.headerlap2}
        />
      </div>

      <Button
        onPress={() => handlePrint()}
        color="success"
        isDisabled={props.data?.length === 0}
        className="h-full w-32"
        isLoading={isLoading}
        startContent={<PrinterIcon />}
      >
        Cetak
      </Button>

      <style jsx>{`
        .hidden-print {
          display: none;
        }

        @media print {
          .hidden-print {
            display: block;
          }

          body * {
            visibility: hidden;
          }

          .hidden-print,
          .hidden-print * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default BayarHandler;
