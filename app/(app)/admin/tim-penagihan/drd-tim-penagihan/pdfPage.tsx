import { DRD, TotalDRD } from "@/types/drd";
import { Button } from "@heroui/react";
import Image from "next/image";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Signature from "./signature";
import { Printer } from "lucide-react";
import { TTD } from "@/types/ttd";
import { formatRupiah } from "@/lib/utils";
import clsx from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DRDTimPenagihan } from "@/types/drd-tim-penagihan";

// Props type definition
type DRDTableProps = {
  data?: DRDTimPenagihan[];
  filter?: string;
  footer?: string;
  headerlap1?: string;
  headerlap2?: string;
  alamat1?: string;
  alamat2?: string;
  signatureData?: TTD;
  tanggal?: string;
  isLoading: boolean;
};

// Component to be printed
export const ReportPrintComponent = React.forwardRef<
  HTMLDivElement,
  DRDTableProps
>(
  (
    {
      data = [],
      headerlap1,
      headerlap2,
      alamat1,
      alamat2,
      signatureData,
      footer,
      tanggal,
      filter,
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
                Laporan Penerimaan Air
              </h1>
              <h3 className="text-base text-center capitalize">{tanggal}</h3>
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
                      <tr>
                        <th colSpan={9}>
                          <div className="text-xs text-left font-normal pb-1">
                            {filter}
                          </div>
                        </th>
                      </tr>
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
                          No. Pel
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "10%",
                          }}
                        >
                          Nama
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "20%",
                          }}
                        >
                          Alamat
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "6%",
                          }}
                        >
                          Gol
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
                          Rayon
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "15%",
                            textAlign: "right",
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
                          L/S
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            fontSize: "12px",
                            width: "30%",
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
                            {item.no_pelanggan}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.nama}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.alamat}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {item.kode_golongan}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {item.rayon}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {item.periodetag}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {item.jmlrek} / {item.sisarek}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "5px",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {formatRupiah(parseInt(item.ttltagihan))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ttd */}
                <div className="signature mt-5">
                  <div
                    className="flex justify-between items-end gap-5"
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
                        {footer},{" "}
                        {format(new Date(), "d MMMM yyyy", { locale: id })}
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
                      !signatureData?.is_id_4 ? "hidden" : ""
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

ReportPrintComponent.displayName = "ReportPrintComponent";

const PDFCetak: React.FC<DRDTableProps> = (props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      console.log("Print completed");
    },
    pageStyle: `
    @media print {
      @page { 
        size: A4; margin: 30px;
        @bottom-right {
          font-size: 12px;
          content: counter(page) " / " counter(pages);
        }
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
        height: 180px;
      }
      
      .footer, .footer-space {
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

  return (
    <div>
      <div ref={componentRef} className="hidden-print">
        <ReportPrintComponent {...props} />
      </div>

      <Button
        onPress={handlePrint as any}
        color="primary"
        startContent={<Printer />}
        isLoading={props.isLoading}
      >
        Cetak DRD
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

export default PDFCetak;
