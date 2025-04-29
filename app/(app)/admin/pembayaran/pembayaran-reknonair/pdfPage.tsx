import { DRD, DRDResponPembayaranAir, TotalDRD } from "@/types/drd";
import { addToast, Button } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Signature from "./signature";
import { CreditCard, Printer } from "lucide-react";
import { TTD } from "@/types/ttd";
import { formatRupiah } from "@/lib/utils";
import clsx from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DRDNonAir, TotalDRNonAir } from "@/types/lpp-nonair";
import { DataPembayaranRekAir } from "@/types/pembayran-rekair";
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
import { DataNonair, DataPrintNonAir } from "@/types/pembayaran-nonair";
import fetcher from "@/lib/swr/fetcher";
import { DekstopSettings } from "@/types/settings";

type DRDTableProps = {
  data?: DataNonair[];
  handler: () => void;
  tgl?: string;
  dataPrint?: DataPrintNonAir[];
  subtitle?: string;
  headerlap1?: string;
  headerlap2?: string;
  alamat1?: string;
  alamat2?: string;
};

const ReportPrintComponent = React.forwardRef<HTMLDivElement, DRDTableProps>(
  ({ dataPrint = [], headerlap1, headerlap2, alamat1, alamat2 }, ref) => {
    return (
      <div>
        {dataPrint.map((data) => (
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
                      <p>Perumda Air Minum Bayuangga</p>

                      <p>Kota Probolinggo</p>
                    </div>
                  </div>
                </div>

                <div className="my-1">
                  <h1 className=" text-center uppercase">
                    Bukti pembayaran Nonair
                  </h1>
                </div>
              </div>
            </div>
            <div>
              <div className="px-5">
                <div className="flex">
                  <div className="w-4/12 font-semibold">No. Pembayaran</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">{data.no_pembayaran}</div>
                </div>
                <div className="flex">
                  <div className="w-4/12 font-semibold">No. Hublang</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">{data.nohublang}</div>
                </div>
                <div className="flex">
                  <div className="w-4/12 font-semibold">No. Pelanggan</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">
                    {data.no_pelanggan || "-"}
                  </div>
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

                <div className="flex mt-5">
                  <div className="w-4/12 font-semibold">Keterangan</div>
                  <div className="w-1/12 text-center">:</div>
                  <div className="flex-1 font-medium">{data.keterangan}</div>
                </div>

                <div className="ml-6 mt-5">
                  <div className="flex justify-between">
                    <div className="w-4/12">Jumlah</div>
                    <div className="w-1/12 text-center">=</div>

                    <div className="w-1/6 text-right">Rp.</div>
                    <div className="w-1/4 text-right font-medium">
                      {data.jumlah.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-4/12">PPN</div>
                    <div className="w-1/12 text-center">=</div>

                    <div className="w-1/6 text-right">Rp.</div>
                    <div className="w-1/4 text-right font-medium">
                      {data.ppn.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="border-t ">
                    <div className="flex justify-between font-bold">
                      <div className="w-4/12 text-gray-800">Total</div>
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
            <div className="footer px-5 pt-2 mt-2">
              <div className="flex">
                <div className="w-4/12 font-semibold">Tgl Bayar</div>
                <div className="w-1/12 text-center">:</div>
                <div className="flex-1 font-medium">
                  {" "}
                  {data.tglbayar &&
                    format(data.tglbayar, "d MMMM yyyy", { locale: id })}
                </div>
              </div>
              <div className="flex">
                <div className="w-4/12 font-semibold">Kasir/Loket</div>
                <div className="w-1/12 text-center">:</div>
                <div className="flex-1 font-medium flex justify-between">
                  <p>{data.nama_user + "/" + data.nama_loket}</p>
                  <p>CA</p>
                </div>
              </div>
              <div className="pt-2 text-center mt-5">
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

  const [printData, setPrintData] = useState<DataPrintNonAir[]>([]);
  const [dekstop, setDekstop] = useState<DekstopSettings>();

  useEffect(() => {
    setIsLoading(true);
    fetcher("/api/settings/dekstop")
      .then((res) => {
        setDekstop(res.data);
      })
      .finally(() => setIsLoading(false));
  }, []);
  useEffect(() => {
    if (printData.length > 0) {
      setTimeout(() => {
        handlePrint();
        setIsLoading(false);
        props.handler();
      }, 100);
    }
  }, [printData]);
  const bayarHandler = async () => {
    const session = await getSession();
    setIsLoading(true);

    axios["post"](
      "/api/pembayaran/pembayaran-nonair",
      {
        data: props.data,
        detail: {
          user_id: session?.session.id,
          nama_user: session?.session.nama,
          loket_id: session?.session.loketId,
          nama_loket: session?.session.kodeloket,
          kode_loket: session?.session.kodeloket,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      }
    )
      .then((res) => {
        setPrintData(res.data.data);
        props.handler();
      })
      .catch(async (err: AxiosError<ErrorResponse>) => {
        setIsLoading(false);
        if (err.status === 401) {
          await deleteAuthCookie();
          await deleteSidebar();
          addToast({
            title: "Gagal memperbarui data!",
            ...errToast_UNAUTHORIZED,
          });
          return Router.replace("/login");
        }
        if (err.status !== 500) {
          return addToast({
            title: "Gagal memperbarui data!",
            description: err.response?.data.message,
            color: "danger",
          });
        }
        addToast({
          title: "Gagal memperbarui data!",
          ...errToast_INTERNALSERVER,
        });
      });
  };
  return (
    <div className="h-full">
      <div ref={componentRef} className="hidden-print">
        <ReportPrintComponent
          dataPrint={printData}
          {...props}
          headerlap1={dekstop?.headerlap1}
          headerlap2={dekstop?.headerlap2}
        />
      </div>

      <Button
        onPress={bayarHandler}
        color="success"
        className="h-full w-32"
        isLoading={isLoading}
        startContent={<CreditCard />}
      >
        Bayar
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
