"use client";

import React, { useEffect, useState } from "react";
import {
  addToast,
  Button,
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
import { EllipsisVertical, Trash2 } from "lucide-react";
import { DataKolektif, Kolektif } from "./page";
import { formatPeriode } from "@/lib/formatPeriode";

type Props = {
  data?: DataKolektif[];
  setData: React.Dispatch<React.SetStateAction<DataKolektif[]>>;
  strictPayment: boolean;
};

const DataTableKolektif = ({ data, setData, strictPayment }: Props) => {
  const hapusLbr = (id: number, i: number, kolektif: Kolektif) => {
    const updatedDataItem = { ...data![i] };

    const allItems = updatedDataItem.data.flatMap(
      (dataGroup) => dataGroup.data
    );

    const targetItem = allItems.find((item) => item.id === id);
    if (!targetItem) return;

    const { no_pelanggan, urut } = targetItem;

    const relatedItems = allItems.filter(
      (item) => item.no_pelanggan === no_pelanggan
    );
    const minUrut = Math.min(...relatedItems.map((item) => item.urut));

    if (urut !== minUrut) {
      addToast({
        color: "danger",
        title: "Gagal menghapus tagihan",
        description: "Harap menghapus tagihan dari periode yang paling terbaru",
      });
      return;
    }

    updatedDataItem.data = updatedDataItem.data.map((dataGroup) => {
      return {
        ...dataGroup,
        data: dataGroup.data.filter((item) => item.id !== id),
      };
    });

    const filteredData = data!.filter(
      (item) => item.kolektif.id !== kolektif.id
    );
    setData([...filteredData, updatedDataItem]);
  };

  const hapusPel = (nopel: string, i: number, kolektif: Kolektif) => {
    const updatedDataItem = { ...data![i] };

    updatedDataItem.data = updatedDataItem.data.map((dataGroup) => {
      return {
        ...dataGroup,
        data: dataGroup.data.filter((item) => item.no_pelanggan !== nopel),
      };
    });

    const filteredData = data!.filter(
      (item) => item.kolektif.id !== kolektif.id
    );
    setData([...filteredData, updatedDataItem]);
  };

  const hapusKol = (kolektif: Kolektif) => {
    const filteredData = data!.filter(
      (item) => item.kolektif.id !== kolektif.id
    );
    setData([...filteredData]);
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
                data?.map((data1, i) => (
                  <>
                    <TableRow className="border rounded-lg">
                      <TableCell colSpan={12}>
                        <div className="flex justify-between items-center">
                          <p>
                            Kolektif {data1.kolektif.no_kolektif} -{" "}
                            {data1.kolektif.nama}
                          </p>
                          <Button
                            color="danger"
                            size="sm"
                            isIconOnly
                            onPress={() => hapusKol(data1.kolektif)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {data1.data.map((main) => {
                      return main.data.map((data) => {
                        return (
                          <TableRow key={data.id}>
                            <TableCell>
                              <div
                                style={{ backgroundColor: main.color }}
                                className="rounded-lg shadow p-1 text-center"
                              >
                                {data.no_pelanggan}
                              </div>
                            </TableCell>
                            <TableCell>{data.nama}</TableCell>
                            <TableCell>{data.alamat}</TableCell>
                            <TableCell>
                              {formatPeriode(data.periode_rek)}
                            </TableCell>
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
                              {formatRupiah(
                                Number(data.denda1) + Number(data.denda2)
                              )}
                            </TableCell>
                            <TableCell>{formatRupiah(data.materai)}</TableCell>
                            <TableCell>
                              {formatRupiah(Number(data.totalrek))}
                            </TableCell>
                            <TableCell>
                              <Dropdown>
                                <DropdownTrigger>
                                  <EllipsisVertical className="w-4 h-4" />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Actions">
                                  <DropdownItem
                                    key="pelanggan"
                                    isDisabled={strictPayment}
                                    onPress={() =>
                                      hapusLbr(data.id, i, data1.kolektif)
                                    }
                                  >
                                    Hapus Lembar
                                  </DropdownItem>

                                  <DropdownItem
                                    key="lbr"
                                    color="danger"
                                    onPress={() =>
                                      hapusPel(
                                        data.no_pelanggan,
                                        i,
                                        data1.kolektif
                                      )
                                    }
                                  >
                                    Hapus Pelanggan
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })}
                  </>
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

export default DataTableKolektif;
