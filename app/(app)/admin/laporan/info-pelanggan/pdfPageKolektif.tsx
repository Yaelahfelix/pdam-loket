import { DRD, TotalDRD } from "@/types/drd";
import { Button } from "@heroui/react";
import Image from "next/image";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Signature from "./signature";
import { Printer } from "lucide-react";
import { TagihanBlmLunasInfoPel, TotalTagihan } from "@/types/info-pelanggan";
import { formatRupiah } from "@/lib/utils";

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
      subtitle = "PERUMDA AIR MINUM BAYUANGGA KOTA PROBOLINGGO",
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

        <div className="header">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
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
                    color: "#0066cc",
                  }}
                >
                  <p>{headerlap1}</p>
                  <p>{headerlap2}</p>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  Jl. Hayam Wuruk No.5 Kota Probolinggo
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "10px",
                fontSize: "12px",
              }}
            >
              Informasi Tagihan Kolektif
            </div>
          </div>
        </div>
        <div className="footer">...</div>

        {/* Table container */}
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
              <td>
                <div className="header-space">&nbsp;</div>
              </td>
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
                No.Pel
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
                    {tagihan.golongan}
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
                    {formatRupiah(tagihan.materai)}
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
                    {tagihan.golongan}
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
                    {formatRupiah(tagihan.materai)}
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
                {total}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                <div className="footer-space">&nbsp;</div>
              </td>
            </tr>
          </tfoot>
        </table>

        {/* <div>
          <div
            classNameName="text-center w-full mt-5"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "12px",
            }}
          >
            Probolinggo, 28 Maret 2025
          </div>
          <div className="flex justify-between">
            <Signature
              name="Kasubag Penagihan"
              position="Risa Rosalina, S.A.P."
            />
            <Signature name="Admin" position="Kepala" />
          </div>
        </div> */}
      </div>
    );
  }
);

DRDTablePrintComponent.displayName = "DRDTablePrintComponent";

// Main component with print functionality
const PDFKolektif: React.FC<DRDTableProps> = (props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `${props.title || "LAPORAN TAGIHAN"}`,
    contentRef: componentRef,
    onAfterPrint: () => console.log("Print completed"),

    pageStyle: `
      @page { 
        size: landscape; 
        margin: 30px;
      }
      
      @media print {
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
        

   .header, .header-space,
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
