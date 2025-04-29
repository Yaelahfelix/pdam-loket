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
import {
  DataPembayaranRekAir,
  PelangganPembayaranRekAir,
} from "@/types/pembayran-rekair";
import { getLocalTimeZone, today } from "@internationalized/date";
import useSWR from "swr";
import { format } from "date-fns";
import fetcher from "@/lib/swr/fetcher";
import { ComboboxKolektif } from "@/components/combobox/kolektif";
import AlertModal from "./alertModal";
import TglModal from "./tglModal";
import DataTableKolektif from "./data-table-kolektif";
import { formatRupiah } from "@/lib/utils";
import { ComboboxPelanggan } from "@/components/combobox/pelanggan";
import DataTableTunggal from "./data-table-tunggal";
import { id } from "date-fns/locale";
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
  const [nopelVal, setNopelVal] = useState("");
  const [alasanBatal, setAlasanBatal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenTgl,
    onOpen: onOpenTgl,
    onOpenChange: onOpenChangeTgl,
  } = useDisclosure();
  const [nopel, setNopel] = useState("");
  const [tgl, setTgl] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [strictPayment, setStrictPayment] = useState<boolean>(true);
  const isPrinting = useRef(false);

  const [tunggal, setTunggal] = useState<{
    data: PembatalanRekAir[];
    pelanggan: PelangganPembayaranRekAir;
  } | null>(null);
  const [errorTunggal, setErrorTunggal] = useState<any>(null);
  const [isLoadingTunggal, setIsLoadingTunggal] = useState(false);
  const Router = useRouter();

  const fetchTunggalData = useCallback(async () => {
    if (!nopel || isPrinting.current) return;

    setIsLoadingTunggal(true);
    try {
      const formattedDate = format(tgl?.toDate("Asia/Jakarta"), "yyyy-MM-dd");
      const url = `/api/pembatalan/rek-air/by-pelanggan?tgl=${formattedDate}&nopel=${nopel}`;
      const response = await fetcher(url);
      setTunggal(response);
      setErrorTunggal(null);
    } catch (error) {
      setErrorTunggal(error);
    } finally {
      setIsLoadingTunggal(false);
    }
  }, [nopel, tgl, fetcher]);

  useEffect(() => {
    fetchTunggalData();
  }, [fetchTunggalData]);

  const batalTunggalHandler = async (onClose: () => void) => {
    setIsLoading(true);
    const session = await getSession();
    axios["post"](
      "/api/pembatalan/rek-air",
      {
        data: tunggalId,
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
  const [allDataTunggal, setAllDataTunggal] = useState<PembatalanRekAir[]>([]);
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
          color: currentColor.backgroundColor,
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

  useEffect(() => {
    let total = 0;
    allDataTunggal.forEach((data) => {
      total += Number(data.total);
    });
    setTotalTunggal(total);
  }, [allDataTunggal]);

  // !KOLEKTIF

  const {
    isOpen: isOpenBatalKolektif,
    onOpen: onOpenBatalKolektif,
    onOpenChange: onOpenChangeBatalKolektif,
  } = useDisclosure();
  const [kolektifVal, setKolektifVal] = useState("");
  const {
    isOpen: isOpenTglKolektif,
    onOpen: onOpenTglKolektif,
    onOpenChange: onOpenChangeTglKolektif,
  } = useDisclosure();
  const [kolektif, setKolektif] = useState("");
  const [tglKolektif, setTglKolektif] = useState<CalendarDate>(
    today(getLocalTimeZone())
  );

  const [kolektifData, setKolektifData] = useState<{
    data: DataPembayaranRekAir[];
    kolektif: Kolektif;
  } | null>(null);
  const [errorKolektif, setErrorKolektif] = useState<any>(null);
  const [isLoadingKolektif, setIsLoadingKolektif] = useState(false);
  const [tunggalId, setTunggalId] = useState<string[] | "all" | null>(null);

  const batalKolektifHandler = async () => {
    setIsLoading(true);
    const session = await getSession();
    axios["post"](
      "/api/pembatalan/rek-air",
      {
        data: allDataKolektif.map((data) =>
          // @ts-ignore
          data.data.map((data) => data.data.map((data) => data.id))
        ),
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

  const fetchKolektifData = useCallback(async () => {
    if (!kolektif || isPrinting.current) return;

    setIsLoadingKolektif(true);
    try {
      const formattedDate = format(
        tglKolektif?.toDate("Asia/Jakarta"),
        "yyyy-MM-dd"
      );
      const url = `/api/pembatalan/rek-air/by-kolektif?tgl=${formattedDate}&kolektif_id=${kolektif}`;
      const response = await fetcher(url);
      setKolektifData(response);
      setErrorKolektif(null);
    } catch (error) {
      setErrorKolektif(error);
    } finally {
      setIsLoadingKolektif(false);
    }
  }, [kolektif, tglKolektif, fetcher]);

  useEffect(() => {
    fetchKolektifData();
  }, [fetchKolektifData]);

  const [colorIndexKolektif, setColorIndexKolektif] = useState<number>(0);
  const [allDataKolektif, setAllDataKolektif] = useState<DataKolektif[]>([]);
  const [modalAlertDesc, setModalAlertDesc] = useState("");
  const [totalKolektif, setTotalKolektif] = useState(0);
  const [bayarKolektif, setBayarKolektif] = useState(0);
  const [kembalianKolektif, setKembalianKolektif] = useState(0);

  useEffect(() => {
    setKembalianKolektif(totalKolektif - bayarKolektif);
  }, [bayarKolektif, totalKolektif]);

  useEffect(() => {
    if (kolektifData && !errorKolektif) {
      const colors = [
        { name: "merah", backgroundColor: "rgba(255, 0, 0, 0.2)" },
        { name: "kuning", backgroundColor: "rgba(255, 255, 0, 0.2)" },
        { name: "hijau", backgroundColor: "rgba(0, 128, 0, 0.2)" },
      ];

      const currentColor = colors[colorIndexKolektif];
      const newItemsMap = new Map();

      kolektifData.data.forEach((item) => {
        newItemsMap.set(item.id, {
          ...item,
          color: currentColor.backgroundColor,
        });
      });

      const filteredData = allDataKolektif.filter(
        (item) => item.kolektif.id !== kolektifData.kolektif.id
      );

      const newKolektifData: DataKolektif = {
        data: Array.from(newItemsMap.values()),
        kolektif: kolektifData.kolektif,
      };

      setAllDataKolektif([...filteredData, newKolektifData]);

      if (kolektifData.data.length > 0) {
        setColorIndexKolektif((colorIndexKolektif + 1) % colors.length);
      }
    }
  }, [kolektifData]);

  useEffect(() => {
    let total = 0;
    allDataKolektif.forEach((data) => {
      data.data.forEach((data) => {
        total += Number(data.total);
      });
    });
    setTotalKolektif(total);
  }, [allDataKolektif]);
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <BreadcrumbsComponent />
      <Tabs aria-label="Metode">
        <Tab key="tunggal" title="Tunggal">
          <h3 className="text-xl font-semibold">
            Pembatalan Rekening Air (Tunggal)
          </h3>
          <div>
            <div className="mt-5 flex justify-between">
              <div className="flex gap-5 items-center">
                <div className="w-64">
                  <ComboboxPelanggan
                    handler={(val) => {
                      setNopel(val);
                    }}
                    isLoading={isLoadingTunggal}
                    placeHolder="Pilih pelanggan..."
                  />
                </div>
                <div>
                  <AlertModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    modalAlertDesc={modalAlertDesc}
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
                      setNopel("");
                      setTunggal(null);
                      setTgl(tgl);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-5">
              {tunggal?.pelanggan && (
                <Card>
                  <CardHeader className="font-bold justify-center">
                    Informasi Pelanggan
                  </CardHeader>
                  <CardBody className="">
                    {!Boolean(tunggal.pelanggan.status) && (
                      <Alert color="danger" className="mb-5 text-center">
                        Pelanggan ini tidak aktif
                      </Alert>
                    )}
                    <div className="flex flex-row gap-5">
                      <div className="w-6/12">
                        <div className="flex justify-between">
                          <p className="font-bold">Nama</p>
                          <p>{tunggal.pelanggan.nama}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="font-bold">Rayon</p>
                          <p>{tunggal.pelanggan.rayon}</p>
                        </div>
                      </div>

                      <div className="w-6/12">
                        <div className="flex justify-between">
                          <p className="font-bold">Golongan</p>
                          <p>{tunggal.pelanggan.golongan}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="font-bold">Alamat</p>
                          <p>{tunggal.pelanggan.alamat}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
              <DataTableTunggal
                data={allDataTunggal}
                strictPayment={strictPayment}
                handler={(id) => id && setTunggalId(id)}
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
        </Tab>
        <Tab key="kolektif" title="Kolektif">
          <h3 className="text-xl font-semibold">
            Pembatalan Rekening Air (Kolektif)
          </h3>

          {/* KOLEKTIF */}
          <div>
            <div className="mt-5 flex justify-between">
              <div className="flex gap-5 items-center">
                <div className="w-64">
                  <ComboboxKolektif
                    handler={(val) => {
                      setKolektif(val);
                    }}
                    isLoading={isLoadingKolektif}
                    placeHolder="Pilih kolektif..."
                  />
                </div>
              </div>
              <div className="flex justify-between items-center gap-5">
                <div>
                  <DatePicker
                    className="w-full max-w-xs"
                    label="Tgl Bayar"
                    value={tglKolektif}
                    onChange={(tglKolektif) => {
                      if (!tglKolektif) return;
                      setTglKolektif(tglKolektif);
                      setAllDataKolektif([]);
                      setKolektif("");
                      setKolektifData(null);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-5">
              <DataTableKolektif
                handler={() => {}}
                data={allDataKolektif}
                strictPayment={strictPayment}
                setData={setAllDataKolektif}
              />
            </div>
            <div className="mt-5 flex justify-between">
              <div>
                <Button
                  color="warning"
                  className="h-full"
                  onPress={() => {
                    setTotalKolektif(0);
                    setBayarKolektif(0);
                    setAllDataKolektif([]);
                  }}
                >
                  Reset Tagihan
                </Button>
              </div>
              <div className="flex gap-5">
                <Input
                  disabled
                  value={formatRupiah(totalKolektif)}
                  variant="bordered"
                  label="Total Tagihan"
                />

                <div></div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PembayaranRekAir;
