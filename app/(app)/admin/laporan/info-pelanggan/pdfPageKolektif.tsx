import { DRD, TotalDRD } from "@/types/drd";
import { Button } from "@heroui/react";
import Image from "next/image";
import React, { Ref, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Signature from "./signature";
import { Printer } from "lucide-react";
import { TagihanBlmLunasInfoPel, TotalTagihan } from "@/types/info-pelanggan";
import { formatRupiah } from "@/lib/utils";
import fetcher from "@/lib/swr/fetcher";
import { TTD } from "@/types/ttd";
import clsx from "clsx";

// Props type definition
type DRDTableProps = {
  data?: {
    tagihanBlmLunas: TagihanBlmLunasInfoPel[];
    total: string;
  }[];
  title?: string;
  total?: string;
  subtitle?: string;
  headerlap1: string;
  headerlap2: string;
  alamat1: string;
  alamat2: string;
  signatureData: TTD;
};

// Component to be printed
const DRDTablePrintComponent = React.forwardRef<HTMLDivElement, DRDTableProps>(
  (
    {
      data = [],
      total,
      headerlap1,
      headerlap2,
      alamat1,
      alamat2,
      title = "LAPORAN TAGIHAN",
      signatureData,
    },
    ref
  ) => {
    console.log(total);
    return (
      <div
        ref={ref}
        className="print-container"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Document Header */}
        {/* <div className="page-header" style={{ marginBottom: "20px" }}>
          <h1
            style={{
              fontSize: "16px",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {subtitle}
          </h1>
          <h2
            style={{
              fontSize: "14px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {title}
          </h2>
        </div> */}

        <div className="header w-full">
          <div className="w-full ">
            <div
              className="border-b w-full border-black"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px",
                paddingBottom: "15px",
              }}
            >
              <div style={{ marginRight: "10px" }}>
                <img
                  src="/logo/pudam-bayuangga.png"
                  alt="Perumda Air Minum Bayuangga Logo"
                  height={80}
                  width={80}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  <p>{headerlap1}</p>
                  <p>{headerlap2}</p>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                  }}
                >
                  <p>{alamat1}</p>
                  <p>{alamat2}</p>
                </div>
              </div>
            </div>

            <div className="my-4">
              <h1 className="text-lg text-center uppercase">
                Informasi Tagihan Kolektif
              </h1>
            </div>
          </div>
        </div>
        <div className="footer"></div>

        {/* Table container */}
        <table className="w-full">
          <thead>
            <tr>
              <td>
                <div className="header-space">&nbsp;</div>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  {/* Table Header */}

                  <thead
                    style={{
                      display: "table-header-group",
                    }}
                  >
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "4%",
                        }}
                      >
                        No
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "10%",
                        }}
                      >
                        No.Pel
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "36%",
                        }}
                      >
                        Nama
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "4%",
                        }}
                      >
                        Gol
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "6%",
                        }}
                      >
                        Periode
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "10%",
                          textAlign: "right",
                        }}
                      >
                        M3
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "10%",
                          textAlign: "right",
                        }}
                      >
                        Rek Air
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "10%",
                          textAlign: "right",
                        }}
                      >
                        Denda
                      </th>

                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          width: "10%",
                          textAlign: "right",
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data?.map((pelanggan, i) =>
                      pelanggan.tagihanBlmLunas.map((tagihan, j) => (
                        <tr key={`${i}-${j}`}>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {i + 1}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {tagihan.no_pelanggan}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {tagihan.nama}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            A
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {tagihan.periode_rek}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {tagihan.pakaiskrg}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(tagihan.rekair)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(Number(tagihan.denda1))}
                          </td>

                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(Number(tagihan.totalrek))}
                          </td>
                        </tr>
                      ))
                    )}

                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          textAlign: "right",
                        }}
                      >
                        Total
                      </td>

                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          fontSize: "12px",
                          textAlign: "right",
                        }}
                      >
                        {total}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="signature mt-5">
                  <div
                    className=" flex justify-between items-end"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div className={!signatureData?.is_id_1 ? "invisible" : ""}>
                      <Signature
                        position={signatureData?.jabatan1}
                        name={signatureData?.nama1}
                        description={signatureData?.header1}
                      />
                    </div>
                    <div className={!signatureData?.is_id_2 ? "invisible" : ""}>
                      <Signature
                        position={signatureData?.jabatan2}
                        name={signatureData?.nama2}
                        description={signatureData?.header2}
                      />
                    </div>
                    <div
                      className={clsx(
                        "flex flex-col items-center gap-5",
                        !signatureData?.is_id_3 ? "invisible" : ""
                      )}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: "12px",
                        }}
                      >
                        Probolinggo, 28 Maret 2025
                      </div>
                      <Signature
                        position={signatureData?.jabatan3}
                        name={signatureData?.nama3}
                        description={signatureData?.header3}
                      />
                    </div>
                  </div>
                  <div
                    className={clsx(
                      "flex justify-center mt-7",
                      !signatureData?.is_id_4 ? "invisible" : ""
                    )}
                  >
                    <Signature
                      position={signatureData?.jabatan4}
                      name={signatureData?.nama4}
                      description={signatureData?.header4}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                <div className="page-footer-space"></div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
);

DRDTablePrintComponent.displayName = "DRDTablePrintComponent";

const PDFKolektif: React.FC<DRDTableProps> = (props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {}, []);
  const handlePrint = useReactToPrint({
    documentTitle: `${props.title || "LAPORAN TAGIHAN"}`,
    contentRef: componentRef,

    onAfterPrint: () => {
      console.log("Print completed");
    },

    pageStyle: `
    
    @media print {
      @page { 
        size: landscape; margin: 30px;
      }
   
        body { 
          -webkit-print-color-adjust: exact; 
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
        

   .header, .header-space {
   height: 170px;
   }
.footer, .footer-space{
  height: 100px;
}
.header {
  position: fixed;
  top: 0;
}
.footer {
  position: fixed;
  bottom: 0;
}

 

        
        table {
          page-break-inside: avoid;
        }

                
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
    .signature-section {

    }
        
     .signature {
    page-break-before: auto;
    position: relative;
      break-inside: avoid;
      page-break-inside: avoid;
  }
 
   
                
        body { 
          -webkit-print-color-adjust: exact; 
        }

      }
    `,
  });

  return (
    <div>
      <div ref={componentRef} className="hidden-print">
        <DRDTablePrintComponent {...props} />
      </div>

      <Button
        onPress={handlePrint as any}
        color="primary"
        startContent={<Printer />}
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

export default PDFKolektif;
