import { DRD, TotalDRD } from "@/types/drd";
import { Button } from "@heroui/react";
import Image from "next/image";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Signature from "./signature";
import { Printer } from "lucide-react";

// Props type definition
type DRDTableProps = {
  data?: DRD[];
  title?: string;
  total?: TotalDRD;
  subtitle?: string;
};

// Component to be printed
const DRDTablePrintComponent = React.forwardRef<HTMLDivElement, DRDTableProps>(
  (
    {
      data = [],
      total,
      title = "LAPORAN TAGIHAN",
      subtitle = "PERUMDA AIR MINUM BAYUANGGA KOTA PROBOLINGGO",
    },
    ref
  ) => {
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
              <th
                colSpan={2}
                style={{
                  padding: "10px",
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                <img
                  src="/logo/pudam-bayuangga.png"
                  alt="Perumda Air Minum Bayuangga Logo"
                  height={80}
                  width={80}
                />
              </th>
              <th
                colSpan={8}
                style={{
                  padding: "10px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#0066cc",
                  }}
                >
                  PERUMDA AIR MINUM BAYUANGGA KOTA PROBOLINGGO
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  Jl. Hayam Wuruk No.5 Kota Probolinggo
                </div>
              </th>
            </tr>
            <tr>
              <th
                colSpan={10}
                style={{
                  padding: "10px",
                  fontSize: "12px",
                }}
              >
                <div>Laporan Tagihan Air</div>
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
                No Pelanggan
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  fontSize: "12px",
                  width: "20%",
                }}
              >
                Nama
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  fontSize: "12px",
                  width: "6%",
                }}
              >
                Kode Gol
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
                Meterai
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
                Admin PPOB
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
                  {item.no}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "12px",
                  }}
                >
                  {item.periodestr}
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
                  {item.kodegol}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {item.rekair}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {item.meterai}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {item.denda}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {item.admin_ppob}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "12px",
                    textAlign: "right",
                  }}
                >
                  {item.total}
                </td>
              </tr>
            ))}
            <tr>
              <td
                colSpan={5}
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
                {total?.rekair}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  fontSize: "12px",
                  textAlign: "right",
                }}
              >
                {total?.meterai}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  fontSize: "12px",
                  textAlign: "right",
                }}
              >
                {total?.denda}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  fontSize: "12px",
                  textAlign: "right",
                }}
              >
                {total?.admin_ppob}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  fontSize: "12px",
                  textAlign: "right",
                }}
              >
                {total?.keseluruhan}
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <div
            className="text-center w-full mt-5"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "12px",
            }}
          >
            Probolinggo, 28 Maret 2025
          </div>
          <div className="flex justify-between">
            <Signature
              name="RISA ROSALINA, S. A. P."
              position="Kasubag Penagihan"
            />
            <Signature name="Admin" position="Kepala" showDate={true} />
          </div>
        </div>
      </div>
    );
  }
);

DRDTablePrintComponent.displayName = "DRDTablePrintComponent";

// Main component with print functionality
const DRDTable: React.FC<DRDTableProps> = (props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    // Use documentTitle instead of content
    documentTitle: `${props.title || "LAPORAN TAGIHAN"}`,
    // The contentRef property should be used instead of content
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
        

   
 
                @page {
          @top-center {
            content: element(header);
          }
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

export default DRDTable;
