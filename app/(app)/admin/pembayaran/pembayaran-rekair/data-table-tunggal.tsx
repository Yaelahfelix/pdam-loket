"use client";

import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import {
  addToast,
  Card,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { DRD, TotalDRD } from "@/types/drd";
import { useFilterStore } from "./useFilterStore";
import { DRDNonAir, TotalDRNonAir } from "@/types/lpp-nonair";
import { useLPPNonAirStore } from "@/store/lppNonAir";
import { DataPembayaranRekAir } from "@/types/pembayran-rekair";
import { formatRupiah } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EllipsisVertical } from "lucide-react";
import { formatPeriode } from "@/lib/formatPeriode";

type Props = {
  data?: DataPembayaranRekAir[];
  setData: React.Dispatch<React.SetStateAction<DataPembayaranRekAir[]>>;
  strictPayment: boolean;
};

const DataTableTunggal = ({ data, setData, strictPayment }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const hapusPel = (nopel: string) => {
    const filteredData = data!.filter((data) => data.no_pelanggan !== nopel);
    setData(filteredData);
  };

  const hapusLbr = (id: number) => {
    const targetData = data!.find((item) => item.id === id);
    if (!targetData) return;

    const { no_pelanggan, urut } = targetData;

    const relatedData = data!.filter(
      (item) => item.no_pelanggan === no_pelanggan
    );

    const minUrut = Math.min(...relatedData.map((item) => item.urut));

    if (urut !== minUrut) {
      addToast({
        color: "danger",
        title: "Gagal menghapus tagihan",
        description: "Harap menghapus tagihan dari periode yang paling terbaru",
      });
      return;
    }

    const filteredData = data!.filter((item) => item.id !== id);
    setData(filteredData);
  };

  return (
    <>
      {data && data.length !== 0 ? (
        <div>
          <Table
            classNames={{
              wrapper: "max-h-[80vh]",
            }}
            isHeaderSticky
            color="warning"
            selectionMode="single"
            onSelectionChange={(val) => {
              setIsOpen(true);
              console.log(Array.from(val));
            }}
          >
            <TableHeader>
              <TableColumn width={10}>No Pel</TableColumn>
              <TableColumn width={120}>Nama</TableColumn>
              <TableColumn width={200}>Alamat</TableColumn>
              <TableColumn width={100}>Periode</TableColumn>
              <TableColumn width={50}>S. Lalu</TableColumn>
              <TableColumn width={50}>S. Skrg</TableColumn>
              <TableColumn width={100}>Pakai</TableColumn>
              <TableColumn width={100}>Tagihan</TableColumn>
              <TableColumn width={100}>Denda</TableColumn>
              <TableColumn width={100}>Materai</TableColumn>
              <TableColumn width={100}>Total</TableColumn>
              <TableColumn width={10}>Actions</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data, i) => (
                  <TableRow key={data.id}>
                    <TableCell>
                      <div
                        // @ts-ignore
                        style={{ backgroundColor: data.color }}
                        className="rounded-lg shadow p-1 text-center"
                      >
                        {data.no_pelanggan}
                      </div>
                    </TableCell>
                    <TableCell>{data.nama}</TableCell>
                    <TableCell>{data.alamat}</TableCell>
                    <TableCell>{formatPeriode(data.periode_rek)}</TableCell>
                    <TableCell>
                      {data.stanlalu.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {data.stanskrg.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {data.pakaiskrg.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>{formatRupiah(data.rekair)}</TableCell>
                    <TableCell>
                      {formatRupiah(Number(data.denda1) + Number(data.denda2))}
                    </TableCell>
                    <TableCell>{formatRupiah(data.materai)}</TableCell>
                    <TableCell>{formatRupiah(Number(data.totalrek))}</TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <EllipsisVertical className="w-4 h-4" />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Actions">
                          <DropdownItem
                            key="pelanggan"
                            isDisabled={strictPayment}
                            onPress={() => hapusLbr(data.id)}
                          >
                            Hapus Lembar
                          </DropdownItem>
                          <DropdownItem
                            key="lbr"
                            color="danger"
                            onPress={() => hapusPel(data.no_pelanggan)}
                          >
                            Hapus Pelanggan
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                )) as any
              }
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardHeader className="p-5 justify-center items-center flex flex-row">
            <div className="text-center">Tidak ada data</div>
          </CardHeader>
        </Card>
      )}
    </>
  );
};

export default DataTableTunggal;
