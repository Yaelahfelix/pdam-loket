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
  Tab,
  Tabs,
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
import BayarHandler from "./pdfPage";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";

export interface Kolektif {
  id: number;
  nama: string;
  no_kolektif: string;
}
export interface DataKolektif {
  data: {
    data: DataPembayaranRekAir[];
    color: string;
  }[];
  kolektif: Kolektif;
}
const PembayaranRekAir = () => {
  const [nopelVal, setNopelVal] = useState("");
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

  const handleBeforePrint = () => {
    isPrinting.current = true;
  };

  const handleAfterPrint = () => {
    setTimeout(() => {
      isPrinting.current = false;
    }, 500);
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [tunggal, setTunggal] = useState<{
    data: DataPembayaranRekAir[];
    pelanggan: PelangganPembayaranRekAir;
  } | null>(null);
  const [errorTunggal, setErrorTunggal] = useState<any>(null);
  const [isLoadingTunggal, setIsLoadingTunggal] = useState(false);
  useEffect(() => {
    fetcher("/api/settings/dekstop/get-strictpayment").then((res) => {
      setStrictPayment(!!res.data.stricpayment);
    });
  }, []);

  const fetchTunggalData = useCallback(async () => {
    if (!nopel || isPrinting.current) return;

    setIsLoadingTunggal(true);
    try {
      const formattedDate = format(tgl?.toDate("Asia/Jakarta"), "yyyy-MM-dd");
      const url = `/api/pembayaran/pembayaran-rekair/by-pelanggan?tgl=${formattedDate}&nopel=${nopel}&flag-is-admin=${isAdmin}`;
      const response = await fetcher(url);
      setTunggal(response);
      setErrorTunggal(null);
    } catch (error) {
      setErrorTunggal(error);
    } finally {
      setIsLoadingTunggal(false);
    }
  }, [nopel, tgl, isAdmin, fetcher]);

  useEffect(() => {
    fetchTunggalData();
  }, [fetchTunggalData]);

  const [colorIndexTunggal, setColorIndexTunggal] = useState<number>(0);
  const [allDataTunggal, setAllDataTunggal] = useState<DataPembayaranRekAir[]>(
    []
  );
  const [totalTunggal, setTotalTunggal] = useState(0);
  const [bayarTunggal, setBayarTunggal] = useState(0);
  const [kembalianTunggal, setKembalianTunggal] = useState(0);

  useEffect(() => {
    setKembalianTunggal(bayarTunggal - totalTunggal);
  }, [bayarTunggal, totalTunggal]);

  useEffect(() => {
    if (tunggal && !errorTunggal) {
      const colors = [
        { name: "merah", backgroundColor: "rgba(255, 0, 0, 0.2)" },
        { name: "kuning", backgroundColor: "rgba(255, 255, 0, 0.2)" },
        { name: "hijau", backgroundColor: "rgba(0, 128, 0, 0.2)" },
      ];
      if (tunggal.pelanggan.status === 0) {
        setModalAlertDesc("Pelanggan ini tidak aktif!");
        onOpen();
      }
      if (tunggal.data.length === 0) {
        setModalAlertDesc("Tagihan pelanggan ini sudah lunas!");
        onOpen();
      }
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
      total += Number(data.totalrek);
    });
    setTotalTunggal(total);
  }, [allDataTunggal]);

  // !KOLEKTIF

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
    data: DataPembayaranRekAir[][];
    kolektif: Kolektif;
  } | null>(null);
  const [errorKolektif, setErrorKolektif] = useState<any>(null);
  const [isLoadingKolektif, setIsLoadingKolektif] = useState(false);

  const fetchKolektifData = useCallback(async () => {
    if (!kolektif || isPrinting.current) return;

    setIsLoadingKolektif(true);
    try {
      const formattedDate = format(
        tglKolektif?.toDate("Asia/Jakarta"),
        "yyyy-MM-dd"
      );
      const url = `/api/pembayaran/pembayaran-rekair/by-kolektif?tgl=${formattedDate}&kolektif=${kolektif}&flag-is-admin=${isAdmin}`;
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
    setKembalianKolektif(bayarKolektif - totalKolektif);
  }, [bayarKolektif, totalKolektif]);

  useEffect(() => {
    if (kolektifData && !errorKolektif) {
      const colors = [
        { name: "merah", backgroundColor: "rgba(255, 0, 0, 0.2)" },
        { name: "kuning", backgroundColor: "rgba(255, 255, 0, 0.2)" },
        { name: "hijau", backgroundColor: "rgba(0, 128, 0, 0.2)" },
      ];

      const allEmpty = kolektifData.data.every((arr) => arr.length === 0);
      if (allEmpty) {
        return addToast({
          color: "warning",
          title: "Tidak ada data tagihan pada nomor kolektif ini!",
        });
      }
      const newData: any = [];
      kolektifData.data.forEach((dataGroup, groupIndex) => {
        const currentColor =
          colors[(colorIndexKolektif + groupIndex) % colors.length];

        newData.push({
          data: dataGroup,
          color: currentColor.backgroundColor,
        });
      });

      const filteredData = allDataKolektif.filter(
        (item) => item.kolektif.id !== kolektifData.kolektif.id
      );

      setAllDataKolektif([
        ...filteredData,
        {
          data: newData,
          kolektif: kolektifData.kolektif,
        },
      ]);

      if (kolektifData.data.length > 0) {
        setColorIndexKolektif(
          (prevIndex) => (prevIndex + kolektifData.data.length) % colors.length
        );
      }
    }
  }, [kolektifData]);

  useEffect(() => {
    let total = 0;
    allDataKolektif.forEach((data) => {
      data.data.forEach((data) => {
        data.data.forEach((data) => {
          total += Number(data.totalrek);
        });
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
            Pembayaran Rekening Air (Tunggal)
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
                    isDisabled={!isAdmin}
                    onChange={(tgl) => {
                      if (!tgl) return;
                      setAllDataTunggal([]);
                      setNopel("");
                      setTunggal(null);
                      setTgl(tgl);
                    }}
                  />
                </div>
                <div>
                  {!isAdmin && (
                    <Button color="danger" onPress={() => onOpenTgl()}>
                      Ubah Tanggal
                    </Button>
                  )}
                  <TglModal
                    isOpen={isOpenTgl}
                    onOpenChange={onOpenChangeTgl}
                    handler={(val) => {
                      setIsAdmin(val);
                      setNopel("");
                      setKolektif("");
                      setAllDataKolektif([]);
                      setKolektifData(null);
                      setAllDataTunggal([]);
                      setTunggal(null);
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
                    setIsAdmin(false);
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
                <Input
                  value={formatRupiah(bayarTunggal)}
                  onValueChange={(val) => {
                    const numericValue = val.replace(/\D/g, "");
                    setBayarTunggal(numericValue ? Number(numericValue) : 0);
                  }}
                  variant="bordered"
                  label="Bayar"
                />
                <Input
                  disabled
                  value={formatRupiah(kembalianTunggal)}
                  variant="bordered"
                  label="Kembalian"
                />
                <div>
                  <BayarHandler
                    handleAfterPrint={handleAfterPrint}
                    handleBeforePrint={handleBeforePrint}
                    isAdmin={isAdmin}
                    tgl={format(
                      new Date(tgl.year, tgl.month - 1, tgl.day),
                      "yyyy-MM-dd",
                      { locale: id }
                    )}
                    data={allDataTunggal}
                    handler={() => {
                      setAllDataTunggal([]);
                      setTunggal(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="kolektif" title="Kolektif">
          <h3 className="text-xl font-semibold">
            Pembayaran Rekening Air (Kolektif)
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
                    isDisabled={!isAdmin}
                    onChange={(tglKolektif) => {
                      if (!tglKolektif) return;
                      setTglKolektif(tglKolektif);
                      setAllDataKolektif([]);
                      setKolektif("");
                      setKolektifData(null);
                    }}
                  />
                </div>
                <div>
                  {!isAdmin && (
                    <Button color="danger" onPress={() => onOpenTglKolektif()}>
                      Ubah Tanggal
                    </Button>
                  )}
                  <TglModal
                    isOpen={isOpenTglKolektif}
                    onOpenChange={onOpenChangeTglKolektif}
                    handler={(val) => {
                      setIsAdmin(val);
                      setNopel("");
                      setKolektif("");
                      setAllDataKolektif([]);
                      setKolektifData(null);
                      setAllDataTunggal([]);
                      setTunggal(null);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-5">
              <DataTableKolektif
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
                    setIsAdmin(false);
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
                <Input
                  value={formatRupiah(bayarKolektif)}
                  onValueChange={(val) => {
                    const numericValue = val.replace(/\D/g, "");
                    setBayarKolektif(numericValue ? Number(numericValue) : 0);
                  }}
                  variant="bordered"
                  label="Bayar"
                />
                <Input
                  disabled
                  value={formatRupiah(kembalianKolektif)}
                  variant="bordered"
                  label="Kembalian"
                />
                <div>
                  <BayarHandler
                    isAdmin={isAdmin}
                    handleAfterPrint={handleAfterPrint}
                    handleBeforePrint={handleBeforePrint}
                    tgl={format(
                      new Date(
                        tglKolektif.year,
                        tglKolektif.month - 1,
                        tglKolektif.day
                      ),
                      "yyyy-MM-dd",
                      { locale: id }
                    )}
                    data={allDataKolektif.flatMap((data) =>
                      data.data.flatMap((data) => data.data)
                    )}
                    handler={() => {
                      setTotalKolektif(0);
                      setBayarKolektif(0);
                      setIsAdmin(false);
                      setAllDataKolektif([]);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PembayaranRekAir;
