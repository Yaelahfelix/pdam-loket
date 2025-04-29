"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import BreadcrumbsComponent from "./breadcrumbs";
import {
  addToast,
  Alert,
  Button,
  CalendarDate,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { PelangganPembayaranRekAir } from "@/types/pembayran-rekair";
import { getLocalTimeZone, today } from "@internationalized/date";
import useSWR from "swr";
import { format } from "date-fns";
import fetcher from "@/lib/swr/fetcher";
import { formatRupiah } from "@/lib/utils";
import DataTableTunggal from "./data-table-tunggal";

import { useRouter } from "next/navigation";
import { PembatalanRekAir } from "@/types/pembatalan-rekair";
import { getSession } from "@/lib/session";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/types/axios";
import { deleteAuthCookie } from "@/actions/auth.action";
import { deleteSidebar } from "@/lib/sidebar";
import {
  errToast_INTERNALSERVER,
  errToast_UNAUTHORIZED,
} from "@/lib/toast/templatemsg/error";
import { ComboboxNonAir } from "@/components/combobox/pembatalan-nonair";
import { PembatalanNonAir } from "@/types/pembatalan-nonair";

export interface Kolektif {
  id: number;
  nama: string;
  no_kolektif: string;
}
export interface DataKolektif {
  data: PembatalanRekAir[];

  kolektif: Kolektif;
}
const PembayaranRekAir = () => {
  const {
    isOpen: isOpenBatalTunggal,
    onOpen: onOpenBatalTunggal,
    onOpenChange: onOpenChangeBatalTunggal,
  } = useDisclosure();
  const [alasanBatal, setAlasanBatal] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenTgl,
    onOpen: onOpenTgl,
    onOpenChange: onOpenChangeTgl,
  } = useDisclosure();
  const [noPembayaran, setNoPembayaran] = useState("");
  const [tgl, setTgl] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [strictPayment, setStrictPayment] = useState<boolean>(true);
  const isPrinting = useRef(false);

  const [tunggal, setTunggal] = useState<{
    data: PembatalanNonAir[];
    pelanggan: PelangganPembayaranRekAir;
  } | null>(null);
  const [errorTunggal, setErrorTunggal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const fetchTunggalData = useCallback(async () => {
    if (!noPembayaran || isPrinting.current) return;

    setIsLoading(true);
    try {
      const formattedDate = format(tgl?.toDate("Asia/Jakarta"), "yyyy-MM-dd");
      const url = `/api/pembatalan/non-air?no_pembayaran=${noPembayaran}`;
      const response = await fetcher(url);
      setTunggal(response);
      setErrorTunggal(null);
    } catch (error) {
      setErrorTunggal(error);
    } finally {
      setIsLoading(false);
    }
  }, [noPembayaran, tgl, fetcher]);

  useEffect(() => {
    fetchTunggalData();
  }, [fetchTunggalData]);

  const batalTunggalHandler = async (onClose: () => void) => {
    setIsLoading(true);
    const session = await getSession();
    axios["post"](
      "/api/pembatalan/non-air",
      {
        data: allDataTunggal.map((data) => data.id),
        alasan: alasanBatal,
        user_name: session?.session.username,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.token.value}`,
        },
      }
    )
      .then((res) => {
        addToast({ color: "success", title: res.data.message });
        onClose();
        setAllDataTunggal([]);
        setTotalTunggal(0);
        Router.refresh();
      })
      .catch(async (err: AxiosError<ErrorResponse>) => {
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
      })
      .finally(() => setIsLoading(false));
  };

  const [colorIndexTunggal, setColorIndexTunggal] = useState<number>(0);
  const [allDataTunggal, setAllDataTunggal] = useState<PembatalanNonAir[]>([]);
  const [totalTunggal, setTotalTunggal] = useState(0);
  const [bayarTunggal, setBayarTunggal] = useState(0);
  const [kembalianTunggal, setKembalianTunggal] = useState(0);

  useEffect(() => {
    setKembalianTunggal(totalTunggal - bayarTunggal);
  }, [bayarTunggal, totalTunggal]);

  useEffect(() => {
    if (tunggal && !errorTunggal) {
      const colors = [
        { name: "merah", backgroundColor: "rgba(255, 0, 0, 0.2)" },
        { name: "kuning", backgroundColor: "rgba(255, 255, 0, 0.2)" },
        { name: "hijau", backgroundColor: "rgba(0, 128, 0, 0.2)" },
      ];
      const currentColor = colors[colorIndexTunggal];
      const newItemsMap = new Map();
      tunggal.data.forEach((item) => {
        newItemsMap.set(item.id, {
          ...item,
        });
      });

      // Filter out existing items with IDs that match new data
      const filteredData = allDataTunggal.filter(
        (item) => !newItemsMap.has(item.id)
      );

      // Combine filtered data with new data
      setAllDataTunggal([...filteredData, ...(newItemsMap.values() as any)]);

      if (tunggal.data.length > 0) {
        setColorIndexTunggal((colorIndexTunggal + 1) % colors.length);
      }
    }
  }, [tunggal]);

  console.log(allDataTunggal);
  useEffect(() => {
    let total = 0;
    allDataTunggal.forEach((data) => {
      total += Number(data.total);
    });
    setTotalTunggal(total);
  }, [allDataTunggal]);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />

      <h3 className="text-xl font-semibold">Pembatalan Transaksi Nonair</h3>
      <div>
        <div className="mt-5 flex justify-between">
          <div className="flex gap-5 items-center">
            <div className="w-64">
              <ComboboxNonAir
                handler={(val) => {
                  setNoPembayaran(val || "");
                }}
                isLoading={isLoading}
                placeHolder="Pilih no pembayaran..."
              />
            </div>
          </div>
          <div className="flex justify-between items-center gap-5">
            <div>
              <DatePicker
                className="w-full max-w-xs"
                label="Tgl Bayar"
                value={tgl}
                onChange={(tgl) => {
                  if (!tgl) return;
                  setAllDataTunggal([]);
                  setNoPembayaran("");
                  setTunggal(null);
                  setTgl(tgl);
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-5">
          <DataTableTunggal
            data={allDataTunggal}
            strictPayment={strictPayment}
            setData={setAllDataTunggal}
          />
        </div>
        <div className="mt-5 flex justify-between">
          <div>
            <Button
              color="warning"
              className="h-full"
              onPress={() => {
                setTotalTunggal(0);
                setBayarTunggal(0);
                setAllDataTunggal([]);
              }}
            >
              Reset Tagihan
            </Button>
          </div>
          <div className="flex gap-5">
            <Input
              disabled
              value={formatRupiah(totalTunggal)}
              variant="bordered"
              label="Total Tagihan"
            />

            <div>
              <Modal
                isOpen={isOpenBatalTunggal}
                onOpenChange={onOpenChangeBatalTunggal}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Konfirmasi Pembatalan
                      </ModalHeader>
                      <ModalBody>
                        <Textarea
                          label="Alasan Batal"
                          value={alasanBatal}
                          onValueChange={setAlasanBatal}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="bordered"
                          onPress={onClose}
                        >
                          Tidak jadi
                        </Button>
                        <Button
                          color="danger"
                          onPress={() => batalTunggalHandler(onClose)}
                        >
                          Batalkan
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
              <Button
                color="danger"
                className="h-full"
                onPress={onOpenBatalTunggal}
                isDisabled={allDataTunggal.length === 0}
              >
                Batalkan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PembayaranRekAir;
