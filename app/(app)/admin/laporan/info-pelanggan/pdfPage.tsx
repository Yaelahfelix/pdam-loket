import { DRD, TotalDRD } from "@/types/drd";
import { Button } from "@heroui/react";
import Image from "next/image";
import React, { Ref, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Signature from "./signature";
import { Printer } from "lucide-react";
import {
  DataKolektif,
  TagihanBlmLunasInfoPel,
  TotalTagihan,
} from "@/types/info-pelanggan";
import { formatRupiah } from "@/lib/utils";
import fetcher from "@/lib/swr/fetcher";
import { TTD } from "@/types/ttd";
import clsx from "clsx";

// Props type definition
type DRDTableProps = {
  data?: TagihanBlmLunasInfoPel[];
  title?: string;
  total?: TotalTagihan;
  subtitle?: string;
  headerlap1?: string;
  dataKolektif?: DataKolektif;
  headerlap2?: string;
  alamat1?: string;
  alamat2?: string;
  signatureData?: TTD;
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
      dataKolektif,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="print-container"
        style={{ backgroundColor: "#ffffff" }}
      >
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
                <div>
                  <div className="text-[12px] border-l border-r border-t  border-black">
                    <div className="p-2 border-b  border-black bg-slate-100  text-center">
                      Detail Pelanggan
                    </div>
                    <div className="flex gap-5 p-5">
                      <div className="w-6/12">
                        <div className="flex justify-between">
                          <p>No Pelanggan</p>
                          <p className="font-normal">
                            {data[0]?.no_pelanggan || ""}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p>Rayon</p>
                          <p className="font-normal">{data[0]?.rayon || ""}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Golongan</p>
                          <p className="font-normal">
                            {data[0]?.golongan || ""}
                          </p>
                        </div>
                      </div>
                      <div className="w-6/12">
                        <div className="flex justify-between">
                          <p>Nama</p>
                          <p className="font-normal">{data[0]?.nama || ""}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Alamat</p>
                          <p className="font-normal">{data[0]?.alamat || ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                          Periode
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "10%",
                          }}
                        >
                          Stan Lalu
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "20%",
                          }}
                        >
                          Stan Skrg
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "6%",
                          }}
                        >
                          Pakai M3
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
                          Angsuran
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
                          Materai
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
                      {data?.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.periode_rek}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.stanlalu}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.stanskrg}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.pakaiskrg}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(item.rekair)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(item.angsuran)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(Number(item.denda1))}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(item.materai)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(Number(item.totalrek))}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td
                          colSpan={9}
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
                          {total?.blmLunas}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ttd */}
                <div className="signature mt-5">
                  <div
                    className=" flex justify-between items-end gap-5"
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

const PDFPelanggan: React.FC<DRDTableProps> = (props) => {
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
        size: A4; margin: 30px;
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

  console.log(props);
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

export default PDFPelanggan;
