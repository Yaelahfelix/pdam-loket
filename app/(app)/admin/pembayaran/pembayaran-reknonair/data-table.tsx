"use client";
import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { DataNonair } from "@/types/pembayaran-nonair";
import { formatRupiah } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type Props = {
  data?: DataNonair[];
  setData: React.Dispatch<React.SetStateAction<DataNonair[]>>;
};

const DataTable = ({ data, setData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveItem = (kodeToRemove: string) => {
    setData((prev) => {
      const updatedArray = prev.filter((item) => item.kode !== kodeToRemove);

      return updatedArray;
    });
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
              <TableColumn width={10}>Jenis</TableColumn>
              <TableColumn width={120}>Nama</TableColumn>
              <TableColumn width={200}>Alamat</TableColumn>
              <TableColumn width={100}>Jumlah</TableColumn>
              <TableColumn width={50}>PPN</TableColumn>
              <TableColumn width={50}>Total</TableColumn>
              <TableColumn width={50}>Action</TableColumn>
            </TableHeader>
            <TableBody className="rounded-lg">
              {
                data?.map((data, i) => (
                  <TableRow key={data.kode}>
                    <TableCell>{data.jenisnonair || "-"}</TableCell>
                    <TableCell>{data.nama}</TableCell>

                    <TableCell>{data.alamat}</TableCell>
                    <TableCell>{formatRupiah(data.jumlah)}</TableCell>
                    <TableCell>{formatRupiah(data.ppn)}</TableCell>
                    <TableCell>{formatRupiah(data.total)}</TableCell>
                    <TableCell>
                      <Button
                        color="danger"
                        isIconOnly
                        onPress={() => handleRemoveItem(data.kode)}
                      >
                        <Trash2 />
                      </Button>
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

export default DataTable;
