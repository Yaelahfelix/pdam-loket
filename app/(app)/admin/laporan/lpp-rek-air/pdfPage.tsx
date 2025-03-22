import { DRD } from "@/types/drd";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    // Important: This ensures each row stays together
    breakInside: "avoid",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    fontSize: 8,
  },
  cellContent: {
    // Adding this to handle text overflow properly
    whiteSpace: "pre-wrap",
    overflow: "hidden",
  },
  noCell: {
    width: "4%",
  },
  periodeCell: {
    width: "10%",
  },
  noPelangganCell: {
    width: "10%",
  },
  namaCell: {
    width: "20%",
  },
  kodeGolCell: {
    width: "6%",
  },
  numberCell: {
    width: "10%",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: "center",
  },
});

// Define component prop types
type PDFPageProps = {
  data?: DRD[];
  title?: string;
  subtitle?: string;
};

const PDFPage = ({
  data = [],
  title = "LAPORAN TAGIHAN",
  subtitle = "PERUMDA AIR MINUM BAYUANGGA KOTA PROBOLINGGO",
}: PDFPageProps) => {
  // Table Header component that will be repeated on each page
  const TableHeader = () => (
    <View style={[styles.tableRow, styles.tableHeader]} fixed>
      <View style={[styles.tableCell, styles.noCell]}>
        <Text>No</Text>
      </View>
      <View style={[styles.tableCell, styles.periodeCell]}>
        <Text>Periode</Text>
      </View>
      <View style={[styles.tableCell, styles.noPelangganCell]}>
        <Text>No Pelanggan</Text>
      </View>
      <View style={[styles.tableCell, styles.namaCell]}>
        <Text>Nama</Text>
      </View>
      <View style={[styles.tableCell, styles.kodeGolCell]}>
        <Text>Kode Gol</Text>
      </View>
      <View style={[styles.tableCell, styles.numberCell]}>
        <Text>Rek Air</Text>
      </View>
      <View style={[styles.tableCell, styles.numberCell]}>
        <Text>Meterai</Text>
      </View>
      <View style={[styles.tableCell, styles.numberCell]}>
        <Text>Denda</Text>
      </View>
      <View style={[styles.tableCell, styles.numberCell]}>
        <Text>Admin PPOB</Text>
      </View>
      <View style={[styles.tableCell, styles.numberCell]}>
        <Text>Total</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={styles.page}>
        {/* Document Header - Fixed at the top of every page */}
        <View fixed>
          <Text style={styles.header}>{subtitle}</Text>
          <Text style={styles.subheader}>{title}</Text>
        </View>

        {/* Table container with fixed header */}
        <View style={styles.table}>
          {/* Table Header - Will appear on every page */}
          <TableHeader />

          {/* Table Body - Rows can break across pages */}
          {data?.map((item, index) => (
            <View key={index} style={styles.tableRow} wrap={false}>
              <View style={[styles.tableCell, styles.noCell]}>
                <Text style={styles.cellContent}>{item.no}</Text>
              </View>
              <View style={[styles.tableCell, styles.periodeCell]}>
                <Text style={styles.cellContent}>{item.periodestr}</Text>
              </View>
              <View style={[styles.tableCell, styles.noPelangganCell]}>
                <Text style={styles.cellContent}>{item.no_pelanggan}</Text>
              </View>
              <View style={[styles.tableCell, styles.namaCell]}>
                <Text style={styles.cellContent}>{item.nama}</Text>
              </View>
              <View style={[styles.tableCell, styles.kodeGolCell]}>
                <Text style={styles.cellContent}>{item.kodegol}</Text>
              </View>
              <View style={[styles.tableCell, styles.numberCell]}>
                <Text style={styles.cellContent}>{item.rekair}</Text>
              </View>
              <View style={[styles.tableCell, styles.numberCell]}>
                <Text style={styles.cellContent}>{item.meterai}</Text>
              </View>
              <View style={[styles.tableCell, styles.numberCell]}>
                <Text style={styles.cellContent}>{item.denda}</Text>
              </View>
              <View style={[styles.tableCell, styles.numberCell]}>
                <Text style={styles.cellContent}>{item.admin_ppob}</Text>
              </View>
              <View style={[styles.tableCell, styles.numberCell]}>
                <Text style={styles.cellContent}>{item.total}</Text>
              </View>
            </View>
          ))}

          {/* Total row */}
          {/* <View style={[styles.tableRow, styles.tableHeader]} wrap={false}>
            <View style={[styles.tableCell, styles.noCell]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, styles.periodeCell]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, styles.noPelangganCell]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, styles.namaCell]}>
              <Text style={{ fontWeight: "bold" }}>TOTAL</Text>
            </View>
            <View style={[styles.tableCell, styles.kodeGolCell]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, styles.numberCell]}>
              <Text style={{ fontWeight: "bold" }}>
                Rp {data.rekair)}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.numberCell]}>
              <Text style={{ fontWeight: "bold" }}>
                Rp {data.meterai)}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.numberCell]}>
              <Text style={{ fontWeight: "bold" }}>
                Rp {data.denda)}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.numberCell]}>
              <Text style={{ fontWeight: "bold" }}>
                Rp {data.admin_ppob)}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.numberCell]}>
              <Text style={{ fontWeight: "bold" }}>
                Rp {data.total)}
              </Text>
            </View>
          </View> */}
        </View>

        {/* Footer */}
        <View fixed style={styles.footer}>
          <Text>Dicetak pada: {new Date().toLocaleString("id-ID")}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFPage;
